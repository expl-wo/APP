<template>
	<view class="form">
		<u--form labelPosition="left" :model="formData" :rules="rules" ref="uForm">
			<view class="form-item" v-for="(item,index) in submitFormData" :key="index">
				<u-form-item :label="item.operationName" :prop="item.operationCode" @click="showAction(item)"
					ref="item1" :ref="`item${index}`">
					<text class="description">{{item.operationDescription}}</text>
					<u--input v-model="formData[item.operationCode]" disabled disabledColor="#fff" placeholder="请选择"
						border="none" v-if="item.operationType!=='0'"></u--input>
					<u--textarea v-model="formData[item.operationCode]" placeholder="请输入内容" v-else></u--textarea>
					<u-icon slot="right" name="arrow-right" v-if="item.operationType!=='0'"></u-icon>
				</u-form-item>
				<!-- 执行频率 -->
				<view class="execute">
					<view class='picker-tag' v-if="item.executionFrequency !== '2'">
						<text class="tip">执行频率:</text>
						<view class="time-select-box" v-if="item.executionFrequency === '0'">
							<text class="btn-link" @click="showTimeActionSheet(item,index,'day')">请选择天</text>
							<text class="time-type">{{item.time}}</text>
							<text class="btn-link" @click="showTimeActionSheet(item,index,'hour')">请选择小时</text>
							<text class="time-type">{{item.time}}</text>
						</view>
						<view class="time-select-box" v-else-if="item.executionFrequency === '1'">
							<text class="btn-link" @click="showTimeActionSheet(item,index,'day')">请选择天</text>
							<text class="time-type">{{item.time}}</text>
						</view>
					</view>
				</view>
				<view class="photo">
					<u-cell>
						<view slot="title" class="u-slot-title">
							<u-upload :fileList="item.fileList" :maxCount="3" :previewFullImage="true"
								@afterRead="afterRead($event,index)" @delete="deletePic($event,index)" name="1"
								multiple></u-upload>
						</view>
					</u-cell>
				</view>
			</view>
			<view class="save-btn">
				<view class="save btn" @click="submit">保存</view>
				<u-line-progress :percentage="percentage" activeColor="#3a62d7" height='20'></u-line-progress>
				<view style="display: flex;margin-top: 10px;">
					<button @click="computedWidth('minus')" style="margin-right:5px;">减少</button>
					<button @click="computedWidth('plus')">增加</button>
				</view>
				<view class="report btn" @click="handleReport">报工</view>
			</view>
		</u--form>
		<u-action-sheet :show="showSingalAction" :actions="actions" title="请选择" @close="showSingalAction = false"
			@select="singleSelect">
		</u-action-sheet>
		<CustomSheet :show='showCustomSheet' :title="customSheetTitle" :selects='selectHours' @close='closeCustomSheet'
			@handleCheck='handleCheck' @reset='reset' @customSheetConfirm='customSheetConfirm'>
		</CustomSheet>
		<u-calendar confirmDisabledText="请选择日期" :formatter="formatter" :show="isShowCalendar" :maxDate="maxDate"
			:closeOnClickOverlay='true' @confirm="confirmCalendar" ref="calendar" @close='isShowCalendar = false'>
		</u-calendar>
	</view>
</template>

<script>
	import CustomSheet from '@/components/common/customSheet.vue'
	import moment from 'moment'
	import {
		queryBatchRecord,
		reportWorkContent,
		queryHistoryRecordByTime
	} from "@/https/staging/index.js";
	export default {
		name: "From",
		components: {
			CustomSheet
		},
		props: {
			// 表单列表数据
			formList: {
				type: Array,
				default: () => []
			},
		},
		watch: {
			formList(val) {
				if (val.length) {
					// 表单回显
					this.submitFormData = JSON.parse(JSON.stringify(val))
					// 初始化表单数据
					this.initFormData()
					// 设置验证规则
					this.setRules()
				}

			}
		},
		data() {
			const d = new Date()
			const year = d.getFullYear()
			let month = d.getMonth() + 1
			month = month < 10 ? `0${month}` : month
			const date = d.getDate()

			const selectHours = [];
			for (let i = 0; i < 24; i++) {
				selectHours.push({
					value: i,
					label: `${i}时`,
					isCheck: false
				})
			};
			return {
				// 表单数据
				formData: {},
				// 单选操作面板数据
				actions: [{
						name: '男',
						value: 1
					},
					{
						name: '女',
						value: 2
					},
					{
						name: '保密',
						value: 3
					},
				],
				// 表单验证规则
				rules: {},
				showCustomSheet: false,
				// 表格提交数据
				submitFormData: [],
				// 展示日历选择
				isShowCalendar: false,
				// 最大日期限制
				maxDate: `${year}-${month}-${date + 10}`,
				// 展示单选操作面板
				showSingalAction: false,
				// 当前操作的记录项=下标
				currentIndex: 0,
				// 选择小时的列表
				selectHours,
				// 自定义面板标题
				customSheetTitle: '小时选择',
				// 报工进度
				percentage: 2
			}
		},
		methods: {
			// 进度条增减操作
			computedWidth(type) {
				if (type === 'plus') {
					this.percentage = uni.$u.range(0, 100, this.percentage + 10)
				} else {
					this.percentage = uni.$u.range(0, 100, this.percentage - 10)
				}
			},
			// 根据数据生成表单验证规则
			setRules() {
				this.formList.forEach(item => {
					if (item.isRequired === '1') {
						const tempObj = {
							type: 'string',
							required: true,
							message: '请填写' + item.operationName,
							trigger: ['blur', 'change']
						}
						this.rules[item.operationCode] = tempObj
					}
				})
				console.log(this.rules, 'setRules')
				this.$refs.uForm.setRules(this.rules)
			},
			singleSelect(e) {
				this.actions.forEach(item => {
					if (item.name === e.name) {
						this.formData.userInfo.sex = item.value
						this.$refs.uForm.validateField('userInfo.sex')
					}
				})
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					uni.$u.toast('校验通过')

				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			// 删除图片
			deletePic(event, index) {
				debugger
				this.submitFormData[index].fileList.splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event, index) {
				debugger
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				const idx = index;
				let lists = [].concat(event.file)
				let fileListLen = this.submitFormData[idx].fileList.length
				debugger
				lists.map((item) => {
					this.submitFormData[idx].fileList.push({
						...item,
						// status: 'uploading',
						// message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this.submitFormData[idx].fileList[fileListLen]
					this.submitFormData[idx].fileList.splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			closeCustomSheet(selectedList) {
				console.log(selectedList, 'selectedList')
				this.showCustomSheet = false
			},
			reset() {
				this.selectHours.forEach(item => {
					item.isCheck = false
				})
			},
			confirmCalendar(date) {
				this.submitFormData[this.currentIndex].data = data[0]
				console.log(date, 'confirmCalendar', this.submitFormData)
			},
			// 日历显示已选择的日期
			formatter(day) {
				const d = new Date()
				let month = d.getMonth() + 1
				const date = d.getDate()
				if (day.month == month && day.day == date + 3) {
					day.bottomInfo = '已操作'
					day.dot = true
				}
				return day
			},
			handleSave() {
				console.log('handleSave')
				const param = {
					"workCode": "20220705093359824311000301954583",
					"craftCode": "20231125",
					"contentCode": "",
					"workScene": "SURVEY_SCENE",
					list: this.submitFormData
				}
				reportWorkContent(param).then(res => {
					if (res) {
						uni.$u.toast('保存成功')
					}
				}).catch(() => {
					uni.$u.toast('保存失败')
				})
			},
			handleReport() {
				console.log('handleReport')
				const param = {
					workCode: 111,
					workProcedureCode: 111, // 	工步编码
					workScene: 111, // 工单场景
					progress: this.progress,
					isStart: 1, // 是否开工 1: 开工
					isFinished: 1, // 	是否完工 1:完工
					operator: 1, // 操作人id
				}
				reportWork(param).then(res => {
					uni.$u.toast('报工成功')
				}).catch(error => {
					uni.$u.toast('报工失败')
				})
			},
			// 展示时间选择
			showTimeActionSheet(item, index, type) {
				console.log(item.executionFrequency, 'form-item')
				if (type === 'day') {
					console.log(this.$refs.calendar, 'calendar')
					this.isShowCalendar = true
				} else {
					this.showCustomSheet = true
				}
				this.currentIndex = index
			},
			showAction(item) {
				console.log(item.operationType, 'showAction')
				if (item.operationType === '0') return;
				this.showSingalAction = true;
			},
			handleCheck(index) {
				this.selectHours[index].isCheck = true
			},
			initFormData() {
				this.formList.forEach(item => {
					this.formData[item.operationCode] = item.contentInfo
				})
				console.log(this.formData, 'initFormData')
			},
			customSheetConfirm(selectedList) {
				console.log(selectedList, 'selectedList')
			}
		},
		mounted() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			console.log(this.formList, 'formList', this.submitFormData)

		}
	}
</script>

<style lang='scss' scoped>
	.form {
		height: calc(100% - 280px);
		overflow-y: auto;
		margin: 0 16rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.form-item {
			.picker-tag {
				flex: 1;
				margin-left: 20rpx;

				.tip {
					margin-right: 10rpx;
					font-size: 12px;
				}

				.time-type {
					padding: 0 20rpx;
					color: #3a62d7;
				}

				.time-select-box {
					display: inline-block;

					.btn-link {
						color: #3a62d7;
					}
				}
			}


		}

		.save-btn {
			margin: 0 16rpx;
			border-radius: 16rpx;

			.btn {
				height: 60rpx;
				line-height: 60rpx;
				margin: 10rpx 0;
				background-color: #f6f8fb;
				text-align: center;
			}
		}

		.description {
			margin-right: 10rpx;
		}


		/deep/.u-form {
			.u-form-item__body__left {
				width: 120rpx !important;
			}

			.u-form-item__body__left__content__label {
				font-size: 18px;
			}

			.u-form-item__body {
				margin: 0 20rpx;
			}
		}
	}
</style>