<template>
	<view class="form">
		<u--form labelPosition="left" :model="formData" :rules="rules" ref="uForm">
			<view class="form-item" v-for="(item,index) in formList" :key="index">
				<u-form-item :label="item.operationName" :prop="item.OPERATION_CODE" @click="showAction(item)"
					ref="item1" :ref="`item${index}`">
					<text class="description">{{item.operationDescription}}</text>
					<u--input v-model="formData.userInfo.sex" disabled disabledColor="#fff" placeholder="请选择"
						border="none" v-if="item.operationType!=='0'"></u--input>
					<u--textarea v-model="formData.userInfo.name" placeholder="请输入内容" v-else></u--textarea>
					<u-icon slot="right" name="arrow-right" v-if="item.operationType!=='0'"></u-icon>
				</u-form-item>
				<!-- 执行频率 -->
				<view class="execute">
					<view class='picker-tag' v-if="item.executionFrequency !== '2'">
						<text class="tip">执行频率:</text>
						<view class="time-select-box" v-if="item.executionFrequency === '0'">
							<text class="btn-link" @click="showTimeActionSheet(item,index)">请选择天</text>
							<text class="time-type">{{item.time}}</text>
							<text class="btn-link" @click="showTimeActionSheet(item,index)">请选择小时</text>
							<text class="time-type">{{item.time}}</text>
						</view>
						<view class="time-select-box" v-else-if="item.executionFrequency === '1'">
							<text class="btn-link" @click="showTimeActionSheet(item,index)">请选择天</text>
							<text class="time-type">{{item.time}}</text>
						</view>
					</view>
				</view>
				<view class="photo">
					<u-cell>
						<view slot="title" class="u-slot-title">
							<u-upload :fileList="item.fileList" :maxCount="3" :previewFullImage="true"
								@afterRead="afterRead($event,index)" @delete="deletePic" name="1" multiple></u-upload>
						</view>
					</u-cell>
				</view>
			</view>
			<view class="save-btn">
				<view class="save btn" @click="submit">保存</view>
				<view class="report btn" @click="handleReport">报工</view>
			</view>
		</u--form>
		<u-action-sheet :show="isShowActionSheet" :actions="actions" title="请选择" @close="isShowActionSheet = false"
			@select="singleSelect">
		</u-action-sheet>
		<CustomSheet :show='showCustomSheet' title="测试" :selects='selects' @close='closeCustomSheet'
			@handleCheck='handleCheck' @reset='reset'>
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
		queryBatchRecord
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
			haveActionSheet: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			haveActionSheet(newV, oldV) {
				if (!newV) {
					this.activeIndex = ''
				}
			}
		},
		computed: {
			showFormData() {

			}
		},
		data() {
			const d = new Date()
			const year = d.getFullYear()
			let month = d.getMonth() + 1
			month = month < 10 ? `0${month}` : month
			const date = d.getDate()
			return {
				formData: {
					userInfo: {
						name: 'uViewUI',
						sex: "",
					},
				},
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
				rules: {
					'userInfo.name': {
						type: 'string',
						required: true,
						message: '请填写',
						trigger: ['blur', 'change']
					},
					'userInfo.sex': {
						type: 'string',
						max: 1,
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					},
				},
				radio: '',
				switchVal: false,
				showCustomSheet: false,
				selects: [{
					value: 1,
					name: '哈哈哈哈',
					isCheck: false
				}, {
					value: 2,
					name: 'hihihihi',
					isCheck: false
				}, {
					value: 3,
					name: '哈喽哈喽哈喽',
					isCheck: false
				}, {
					value: 4,
					name: '你好',
					isCheck: false
				}],
				submitFormData: [{
					fileList: [],
				}, {
					fileList: [],
				}],
				// 展示日历选择
				isShowCalendar: false,
				mode: 'range',
				maxDate: `${year}-${month}-${date + 10}`,
				isShowActionSheet: false,
				currentIndex: 0
			}
		},


		methods: {
			setRules() {
				// 根据数据生成规则
				this.formList.forEach(item => {
					if (item.isRequired === '1') {
						const tempObj = {
							type: 'string',
							required: true,
							message: '请填写' + item.operationName,
							trigger: ['blur', 'change']
						}
						this.rules[item.OPERATION_CODE] = tempObj
					}
				})
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
			// 新增图片
			async afterRead(event, index) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				const idx = index;
				let lists = [].concat(event.file)
				let fileListLen = this.submitFormData[idx].fileList.length
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
				this.selects.forEach(item => {
					item.isCheck = false
				})
			},
			confirmCalendar(date) {
				console.log(date, 'confirmCalendar')
				this.submitFormData[this.currentIndex].data = data
			},
			// 日历显示已选择的日期
			formatter(day) {
				debugger
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
			},
			handleReport() {
				console.log('handleReport')
			},
			// 展示时间选择
			showTimeActionSheet(item, index) {
				console.log(item.executionFrequency, 'form-item')
				if (item.executionFrequency === '2') return;
				if (item.executionFrequency === '1') {
					console.log(this.$refs.calendar, 'calendar')
					this.formatte
					// queryBatchRecord  查询记录历史填写
					queryBatchRecord().then(res => {
						if (res.data) {
							this.isShowCalendar = true
						}
					})
				} else {
					this.showCustomSheet = true
				}
				this.currentIndex = index
			},
			showAction(item) {
				console.log(item.operationType, 'showAction')
				if (item.operationType === '0') return;
				this.isShowActionSheet = true;
				// this.actions = this.selects
			}
		},
		mounted() {
			debugger
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			console.log(this.formList, 'formList')
			this.setRules()
			this.$refs.uForm.setRules(this.rules)
		},
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