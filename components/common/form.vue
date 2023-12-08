<template>
	<view class="form">
		<u--form labelPosition="left" :model="formData" :rules="rules" ref="uForm">
			<view class="form-item" v-for="(item,index) in submitFormData" :key="index">
				<u-form-item :label="item.operationName" :prop="item.operationCode" @click="showAction(item)"
					ref="item1" :ref="`item${index}`">
					<text class="description">{{item.operationDescription}}</text>
					<u--textarea v-model="formData[item.operationCode]" placeholder="请输入内容" v-if="item.operationType==='0'" :maxlength='item.maximumContentLength'></u--textarea>
					<u-number-box :min="lowerLimit" :max="upperLimit" v-model="formData[item.operationCode]" v-else-if="item.operationType ==='1'"></u-number-box>
					<u--input v-model="formData[item.operationCode]" disabled disabledColor="#fff" placeholder="请选择"
						border="none" v-else></u--input>
					<u-icon slot="right" name="arrow-right" v-if="item.operationType!=='0'"></u-icon>
				</u-form-item>
				<!-- 执行频率 -->
				<view class="execute">
					<view class='picker-tag' v-if="item.executionFrequency !== '2'">
						<text class="tip">执行频率:</text>
						<view class="time-select-box" v-if="item.executionFrequency === '0'">
							<text class="btn-link" @click="showTimeActionSheet(item,index,'day')">选择天</text>
							<text class="time-type">{{showTimeList[index] && showTimeList[index].date}}</text>
							<text class="btn-link" @click="showTimeActionSheet(item,index,'hour')">选择小时</text>
							<text class="time-type">{{ showTimeList[index] && showTimeList[index].hourTime}}</text>
						</view>
						<view class="time-select-box" v-else-if="item.executionFrequency === '1'">
							<text class="btn-link" @click="showTimeActionSheet(item,index,'day')">选择天</text>
							<text class="time-type">{{showTimeList[index] && showTimeList[index].date}}</text>
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
				<view class="save btn">
					<u-button  @click="submit" text="保存" :disabled="!isStart"></u-button>
				</view>
				<u-line-progress :percentage="percentage" activeColor="#3a62d7" height='20'></u-line-progress>
				<view style="display: flex;margin-top: 10px;">
					<button @click="computedWidth('minus')" style="margin-right:5px;">减少</button>
					<button @click="computedWidth('plus')">增加</button>
				</view>
				<view class="report btn">
					<u-button  @click="handleReport" text="报工" :disabled="!isStart"></u-button>
				</view>
			</view>
		</u--form>
		<u-action-sheet :show="showSingalAction" :actions="actions" title="请选择" @close="showSingalAction = false"
			@select="singleSelect">
		</u-action-sheet>
		<CustomSheet :show='isShowCustomSheet' :title="customSheetTitle" :selects='selectHours'
			:isHourSelect='isHourSelect' @close='closeCustomSheet' @handleCheck='handleCheck' @reset='reset'
			@selectHourConfirm='selectHourConfirm'>
		</CustomSheet>
		<u-calendar confirmDisabledText="请选择日期" :formatter="formatter" :show="isShowCalendar" :maxDate="maxDate"
			:minDate='minDate' :closeOnClickOverlay='true' @confirm="confirmCalendar" ref="calendar"
			@close='isShowCalendar = false'>
		</u-calendar>
	</view>
</template>

<script>
	import CustomSheet from '@/components/common/customSheet.vue'
	import moment from 'moment'
	import {
		queryBatchRecord,
		reportWorkContent,
		queryHistoryRecordByTime,
		reportWork
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
			isStart:{
				type:Boolean,
				default:false
			},
			commonParam:{
				type:Object,
				default:()=>({})
			}
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
					value: `${i}:00:00`,
					label: `${i}:00~${i+1}:00`,
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
				isShowCustomSheet: false,
				// 表格提交数据
				submitFormData: [],
				// 展示日历选择
				isShowCalendar: false,
				// 最大日期限制
				maxDate: `${year}-${month}-${date}`,
				minDate: `${year}-${month}-${date -30}`,
				// 展示单选操作面板
				showSingalAction: false,
				// 当前操作的记录项=下标
				currentIndex: 0,
				// 选择小时的列表
				selectHours,
				// 自定义面板标题
				customSheetTitle: '小时选择',
				// 报工进度
				percentage: 0,
				// 已经填写内容的时间列表
				selectedTimeList: [],
				// 是否是选择小时-只能选中一个时间点
				isHourSelect: false,
				// 显示的时间列表
				showTimeList:[]
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
				console.log(this.formData,'formData',this.submitFormData)
				this.$refs.uForm.validate().then(res => {
					this.submitFormData.forEach((item,index)=>{
						item.contentInfo = this.formData[item.operationCode];
						const time = this.selectHours.filter(item=>item.label == this.showTimeList[index].hourTime);
						console.log(this.selectHours, this.showTimeList[index].hourTime, ' this.showTimeList[index].hourTime',time);
						if(item.executionFrequency === '0'){
							item.workPlanTime = this.showTimeList[index].date + " " + time[0].value;
						}else if(item.executionFrequency === '1'){
							item.workPlanTime = moment().format('YYYY-MM-DD HH:mm:ss') + "" + time[0].value;
						}
					})
					const param = {
						...this.commonParam,
						craftCode:this.commonParam.craftId,
						list: this.submitFormData
					}
					reportWorkContent(param).then(res => {
						if (res) {
							uni.$u.toast('保存成功')
						}
					}).catch(() => {
						uni.$u.toast('保存失败')
					})
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			// 删除图片
			deletePic(event, index) {
				this.submitFormData[index].fileList.splice(event.index, 1)
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
				this.isShowCustomSheet = false
			},
			reset() {
				this.selectHours.forEach(item => {
					item.isCheck = false
				})
			},
			handleReport() {
				const userInfo = JSON.parse(localStorage.getItem('hb_dq_mes_user_info'))
				const param = {
					progress: this.percentage,
					workCode:this.commonParam.workCode,
					workScene:this.commonParam.workScene,
					workProcedureCode: this.commonParam.craftId,
					isStart:this.isStart ? 1 : 0 ,
					// isFinished: 1, // 	是否完工 1:完工
					operator: userInfo.username
				}
				console.log('handleReport',param,userInfo)
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
					this.queryRecordHistoryByTime(item, type)
					setTimeout(() => {
						this.isShowCalendar = true
					}, 500)
				} else {
					this.isHourSelect = true;
					// 小时显示单选picker
					this.isShowCustomSheet = true
				}
				this.currentIndex = index
			},
			// 日历显示已选择的日期
			formatter(day) {
				this.selectedTimeList.forEach(item => {
					const d = new Date(item)
					let month = d.getMonth() + 1
					const date = d.getDate()
					if (day.month == month && day.day == date) {
						day.bottomInfo = '已操作'
						day.dot = true
					}
				})
				return day
			},
			// 日历
			confirmCalendar(date) {
				this.$set(this.showTimeList[this.currentIndex], 'date', date[0])
				console.log(date, 'confirmCalendar', this.submitFormData)
				this.isShowCalendar = false
			},
			// 根据当前时间查询
			queryRecordHistoryByTime(item, type) {
				const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
				const beginTime =  moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
				const param = {
					workCode:this.commonParam.workCode,
					craftCode:this.commonParam.craftId,
					workScene:this.commonParam.workScene,
					operationCode:item.operationCode,
					beginTime: beginTime,
					endTime: currentTime
				}
				queryHistoryRecordByTime(param).then(res => {
					if (res && res.data && Array.isArray(res.data.value)) {
						this.selectedTimeList = res.data.value || []
					}
				})
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
				this.formList.forEach((item,index) => {
					this.formData[item.operationCode] = item.contentInfo
					const tempObj =  {
						date:item.date || '',
						hourTime:item.hourTime || '',
					}
					this.showTimeList.push(tempObj)
				})
				console.log(this.formData, 'initFormData',this.showTimeList)
			},
			// 小时确认框
			selectHourConfirm(selectedList) {
				console.log(selectedList, 'selectedList')
				this.$set(this.showTimeList[this.currentIndex], 'hourTime', selectedList[0].label)
				this.showTimeList[this.currentIndex]
				let beginTime = moment().format('YYYY-MM-DD') + " " + selectedList[0].value;
				if(this.showTimeList[this.currentIndex].date){
					beginTime = this.showTimeList[this.currentIndex].date + " " + selectedList[0].value
				}else{
					uni.$u.toast('请选择日期')
				}
				const params = [
					{
						workCode:this.commonParam.workCode,
						craftCode:this.commonParam.craftId,
						workScene:this.commonParam.workScene,
						operationCode:this.submitFormData[this.currentIndex].operationCode,
						beginTime: beginTime,
						executionFrequency:this.submitFormData[this.currentIndex].executionFrequency
					}
				] 
				this.$emit('getBatchRecord',params)
				this.isShowCustomSheet = false
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
					/* color: #3a62d7; */
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
				margin: 20rpx 0;
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