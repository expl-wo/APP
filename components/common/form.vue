<template>
	<view class="form">
		<u--form labelPosition="left" :model="formData" :rules="rules" ref="uForm">
			<view class="form-item" v-for="(item,index) in submitFormData" :key="index">
				<view class="title">
					<view class="operation-name">
						<view class="name">
							{{item.operationName}}
						</view>
						<!-- 执行频率 -->
						<view class="execute">
							<view class='picker-tag' v-if="item.executionFrequency !== '2'">
								<!-- <text class="tip">频率:</text> -->
								<view class="time-select-box" v-if="item.executionFrequency === '0'">
									<text class="btn-link" @click="showTimeActionSheet(item,index,'day')">
										<u-icon name="arrow-down"></u-icon>
									</text>
									<text class="time-type">{{showTimeList[index] && showTimeList[index].date}}</text>
									<text class="btn-link" @click="showTimeActionSheet(item,index,'hour')">
										<u-icon name="arrow-down"></u-icon>
									</text>
									<text
										class="time-type">{{ showTimeList[index] && showTimeList[index].hourTime}}</text>
								</view>
								<view class="time-select-box" v-else-if="item.executionFrequency === '1'">
									<text class="btn-link" @click="showTimeActionSheet(item,index,'day')">
										<u-icon name="arrow-down"></u-icon>
									</text>
									<text class="time-type">{{showTimeList[index] && showTimeList[index].date}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="operation-description" v-if="item.operationDescription">
						{{item.operationDescription}}
					</view>
				</view>
				<!-- 表单项 -->
				<u-form-item :prop="item.operationCode" :ref="`item${index}`" @click="showAction(item,index)">
					<text class="description">选项:</text>
					<u--textarea v-model="formData[item.operationCode]" placeholder="请输入内容"
						v-if="item.operationType==='0'" :maxlength='item.maximumContentLength'></u--textarea>
					<u-number-box :min="item.lowerLimit" :max="item.upperLimit" v-model="formData[item.operationCode]"
						v-else-if="item.operationType ==='1'"></u-number-box>
					<u--input v-model="formData[item.operationCode]" disabled disabledColor="#fff" placeholder="请选择"
						border="none" v-else></u--input>
					<u-icon slot="right" name="arrow-right" v-if="!['0','1'].includes(item.operationType)"></u-icon>
				</u-form-item>

				<!-- 图片上传 -->
				<view class="photo">
					<text class="tip">图片:</text>
					<u-upload :fileList="item.fileList" :maxCount="3" :previewFullImage="true"
						@afterRead="afterRead($event,index)" @beforeRead="beforeRead($event, 'image')"
						@delete="deletePic($event,index)" name="1" multiple></u-upload>
					<view slot="title" class="u-slot-title">
					</view>
				</view>
			</view>
			<view class="save-btn">
				<view class="save btn">
					<!-- <u-button @click="submit" text="保存" :disabled="!isStart"></u-button> -->
					<u-button @click="submit" text="保存" color="#3a62d7"></u-button>
				</view>
				<u-line-progress :percentage="percentage" activeColor="#3a62d7" height='20'></u-line-progress>
				<view style="display: flex;margin-top: 10px;">
					<button @click="computedWidth('minus')" style="margin-right:5px;">减少</button>
					<button @click="computedWidth('plus')">增加</button>
				</view>
				<view class="report btn">
					<u-button @click="handleReport" text="报工" :disabled="!isStart" color="#3a62d7"></u-button>
				</view>
			</view>
		</u--form>
		<!-- 操作面板 -->
		<u-action-sheet :show="showSingleAction" :actions="actions" title="请选择" @close="showSingleAction = false"
			@select="singleSelect">
		</u-action-sheet>
		<CustomSheet :show='isShowCustomSheet' :title="customSheetTitle" :selects='selects' :isHourSelect='isHourSelect'
			@close='closeCustomSheet' @selectHourConfirm='selectHourConfirm' @customSheetConfirm='customSheetConfirm'>
		</CustomSheet>
		<u-calendar confirmDisabledText="请选择日期" :formatter="formatter" :show="isShowCalendar" :maxDate="maxDate"
			:minDate='minDate' :closeOnClickOverlay='true' @confirm="confirmCalendar" ref="calendar"
			@close='isShowCalendar = false'>
		</u-calendar>
		<u-datetime-picker :show="isShowDatePicker" v-model="dateValue" mode="datetime" :closeOnClickOverlay='true'
			@close='isShowDatePicker = false' @cancel='isShowDatePicker = false'
			@confirm='handleDateTimePicker'></u-datetime-picker>
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
	import uploadHttp from '@/https/_public/upload';
	import {
		getToken,
		setToken
	} from '@/utils/auth.js';
	import {
		UPLOAD_LIMIT
	} from '@/utils/constants-custom';
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
			// 是否开工-开工才能操作
			isStart: {
				type: Boolean,
				default: false
			},
			commonParam: {
				type: Object,
				default: () => ({})
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
			// 设置日历最大日期
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
				// 显示自定义面板
				isShowCustomSheet: false,
				// 表格提交数据
				submitFormData: [],
				// 展示日历选择
				isShowCalendar: false,
				// 最大日期限制
				maxDate: `${year}-${month}-${date}`,
				minDate: `${year}-${month}-${date -30}`,
				// 展示单选操作面板
				showSingleAction: false,
				// 当前操作的记录项=下标
				currentIndex: 0,
				// 选择小时的列表-多选列表
				selects: [],
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
				showTimeList: [],
				// 日期时间选择
				isShowDatePicker: false,
				// 日期值
				dateValue: Number(new Date()),
			}
		},
		methods: {
			// 初始化表单数据
			initFormData() {
				this.formList.forEach((item, index) => {
					this.formData[item.operationCode] = item.contentInfo || "";
					const tempObj = {
						date: item.date || '',
						hourTime: item.hourTime || '',
					}
					this.showTimeList.push(tempObj);
				})
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
			submit() {
				console.log(this.formData, 'formData', this.submitFormData)
				this.$refs.uForm.validate().then(res => {
					this.submitFormData.forEach((item, index) => {
						item.contentInfo = this.formData[item.operationCode];
						const time = this.selectHours.filter(item => item.label == this.showTimeList[index]
							.hourTime);
						console.log(this.selectHours, this.showTimeList[index].hourTime,
							' this.showTimeList[index].hourTime', time);
						if (item.executionFrequency === '0') {
							item.workPlanTime = this.showTimeList[index].date + " " + time[0].value;
						} else if (item.executionFrequency === '1') {
							item.workPlanTime = moment().format('YYYY-MM-DD HH:mm:ss') + "" + time[0]
								.value;
						}
					})
					const param = {
						...this.commonParam,
						craftCode: this.commonParam.craftId,
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
			// 判断是否图片是否超出限制
			isOverSize(size, type) {
				return size > UPLOAD_LIMIT[type].maxSize;
			},
			// 图片上传之前事件
			beforeRead(event, type) {
				let {
					file
				} = event;
				return new Promise((resolve, reject) => {
					let eligibleFile = file.filter(item => {
						return !this.isOverSize(item.size, type)
					})
					if (!eligibleFile.length) {
						uni.showToast({
							title: `所选${UPLOAD_LIMIT[type].label}大小不符合要求`,
							duration: 2000
						});
						reject();
					}
					if (eligibleFile.length && eligibleFile.length < file.length) {
						uni.showToast({
							title: `已自动过滤不符合条件的${UPLOAD_LIMIT[type].label}`,
							duration: 2000
						});
						resolve(eligibleFile, type);
					}
					resolve(file, type);
				})
			},
			// 新增图片
			async afterRead(event, index) {
				let uploadList = event.file;
				let uploadTask = [];
				for (let i = 0; i < uploadList.length; i++) {
					uploadTask.push(this.uploadFilePromise(uploadList[i].url));
				}
				Promise.all(uploadTask)
					.then(res => {
						let successList = res.filter(item => item.status === 0);
						if (successList.length < this.imageList) {
							uni.showToast({
								title: '存在上传失败的图片',
								duration: 2000
							});
						}
						let uploadedList = successList.map(item => {
							return {
								imgUrl: `http://10.16.9.128:9000/${item.filePath}`,
								url: item.filePath,
								name: item.fileName,
								type: fileName.spilt(".")[1]
							}
						})
						this.submitFormData[index].fileList.push(...uploadedList)
					})
			},
			// 上传图片接口
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					uploadHttp.upload({
						token: getToken(),
						filePath: url
					}).then(response => {
						if (response.code === 200) {
							setTimeout(() => {
								return resolve({
									status: 0,
									...response.data
								})
							}, 150)
						} else {
							return resolve({
								status: 500,
								msg: '上传失败'
							});
						}
					});
				})
			},
			// 关掉自定义面板（多选-小时操作面板）
			closeCustomSheet(selectedList) {
				console.log(selectedList, 'selectedList')
				this.isShowCustomSheet = false
			},
			// 处理报工事件
			handleReport() {
				const userInfo = JSON.parse(localStorage.getItem('hb_dq_mes_user_info'))
				const param = {
					progress: this.percentage,
					workCode: this.commonParam.workCode,
					workScene: this.commonParam.workScene,
					workProcedureCode: this.commonParam.craftId,
					isStart: this.isStart ? 1 : 0,
					// isFinished: 1, // 	是否完工 1:完工
					operator: userInfo.username
				}
				console.log('handleReport', param, userInfo)
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
					this.selects = this.selectHours;
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
			// 日历确认框
			confirmCalendar(date) {
				this.$set(this.showTimeList[this.currentIndex], 'date', date[0])
				console.log(date, 'confirmCalendar', this.submitFormData)
				this.isShowCalendar = false
			},
			// 根据当前时间查询工作内容
			queryRecordHistoryByTime(item, type) {
				const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
				const beginTime = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
				const param = {
					workCode: this.commonParam.workCode,
					craftCode: this.commonParam.craftId,
					workScene: this.commonParam.workScene,
					operationCode: item.operationCode,
					beginTime: beginTime,
					endTime: currentTime
				}
				queryHistoryRecordByTime(param).then(res => {
					if (res && res.data && Array.isArray(res.data.value)) {
						this.selectedTimeList = res.data.value || []
					}
				})
			},
			// 展示选择操作面板
			showAction(item, index) {
				this.currentIndex = index;
				console.log(item.operationType, 'showAction')
				if (item.operationType === '0' || item.operationType === '1') {
					return
				} else if (item.operationType === '2') {
					this.isShowDatePicker = true;
				} else if (item.operationType === '3') {
					this.showSingleAction = true;
					this.actions = item.dictionaryContent
				} else if (item.operationType === '4') {
					if (item.dictionaryContent && item.dictionaryContent.length) {
						const list = [];
						item.dictionaryContent.forEach(item => {
							list.push({
								value: item.code,
								label: item.name,
								isCheck: false
							})
						})
						this.selects = list;
						console.log(this.selects, 'selects')
						this.customSheetTitle = item.operationName + '选择';
						this.isShowCustomSheet = true;
					}
				}
			},
			// 日期时间选择确认-区别日期选择
			handleDateTimePicker(dateObj) {
				const date = moment(dateObj.value).format('YYYY-MM-DD HH:mm:ss')
				const currentItem = this.submitFormData[this.currentIndex];
				this.formData[currentItem.operationCode] = date;
				this.$refs.uForm.validateField(currentItem.operationCode);
				this.isShowDatePicker = false;
			},
			// 单选面板确认事件
			singleSelect(e) {
				const currentItem = this.submitFormData[this.currentIndex];
				this.formData[currentItem.operationCode] = e.name;
				this.$refs.uForm.validateField(currentItem.operationCode);
			},
			// 多选面板确认
			customSheetConfirm(list) {
				const currentItem = this.submitFormData[this.currentIndex];
				const contentInfo = list.map(item => item.label).join(',');
				this.formData[currentItem.operationCode] = contentInfo;
				this.$refs.uForm.validateField(currentItem.operationCode);
				this.isShowCustomSheet = false;
			},
			// 小时确认框
			selectHourConfirm(selectedList) {
				console.log(selectedList, 'selectedList')
				this.$set(this.showTimeList[this.currentIndex], 'hourTime', selectedList[0].label)
				this.showTimeList[this.currentIndex]
				let beginTime = moment().format('YYYY-MM-DD') + " " + selectedList[0].value;
				if (this.showTimeList[this.currentIndex].date) {
					beginTime = this.showTimeList[this.currentIndex].date + " " + selectedList[0].value
				} else {
					uni.$u.toast('请选择日期')
				}
				const params = [{
					workCode: this.commonParam.workCode,
					craftCode: this.commonParam.craftId,
					workScene: this.commonParam.workScene,
					operationCode: this.submitFormData[this.currentIndex].operationCode,
					beginTime: beginTime,
					executionFrequency: this.submitFormData[this.currentIndex].executionFrequency
				}]
				this.$emit('getBatchRecord', params)
				this.isShowCustomSheet = false
			},
			// 进度条增减操作
			computedWidth(type) {
				if (type === 'plus') {
					this.percentage = uni.$u.range(0, 100, this.percentage + 10)
				} else {
					this.percentage = uni.$u.range(0, 100, this.percentage - 10)
				}
			},
		}
	}
</script>

<style lang='scss' scoped>
	.form {
		height: calc(100% - 260px);
		overflow-y: auto;
		margin: 0 16rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.form-item {
			.tip {
				margin-right: 10rpx;
				font-size: 14px;
			}

			.title {
				margin-left: 20rpx;
				margin-top: 10rpx;

				.operation-name {
					display: flex;
					justify-content: space-between;
					font-size: 20px;
					margin-bottom: 10rpx;

					.picker-tag {
						display: flex;
						margin-bottom: 10rpx;
						margin-left: 20rpx;

						.time-type {
							padding: 0 12rpx;
							color: #3a62d7;
						}

						.time-select-box {
							display: flex;

							.btn-link {
								margin-top: 5px;
								color: #3a62d7;
							}
						}
					}
				}

				.operation-description {
					font-size: 14px;
				}
			}

			.photo {
				display: flex;
				padding-left: 20rpx;
				border-bottom: 1px solid #cecece;
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