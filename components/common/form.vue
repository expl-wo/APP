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
									<text class="time-type"
										@click="showTimeActionSheet(item,index,'day')">{{showTimeList[index] && showTimeList[index].date}}</text>
									<text class="btn-link" @click="showTimeActionSheet(item,index,'hour')">
										<u-icon name="arrow-down"></u-icon>
									</text>
									<text class="time-type"
										@click="showTimeActionSheet(item,index,'hour')">{{ showTimeList[index] && showTimeList[index].hourTime}}</text>
								</view>
								<view class="time-select-box" v-else-if="item.executionFrequency === '1'">
									<text class="btn-link" @click="showTimeActionSheet(item,index,'day')">
										<u-icon name="arrow-down"></u-icon>
									</text>
									<text class="time-type"
										@click="showTimeActionSheet(item,index,'day')">{{showTimeList[index] && showTimeList[index].date}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="operation-description" v-if="item.operationDescription">
						<text>操作描述:</text>
						<text>{{item.operationDescription}}</text>
					</view>
				</view>
				<!-- 表单项 -->
				<u-form-item :prop="item.operationCode" :ref="`item${index}`" @click="showAction(item, index)">
					<text class="description">填写内容:</text>
					<u--textarea v-model="formData[item.operationCode]" placeholder="请输入内容"
						v-if="item.operationType==='0'" :maxlength='item.maximumContentLength'></u--textarea>
					<view v-else-if="item.operationType ==='1'" class="number">
						<u--input v-model="formData[item.operationCode]" inputWidth='200' type='number'
							@blur='changeNumber($event,item,index)'></u--input>
						<text v-if="item.dataUnit" class="data-unit">{{item.dataUnit}}</text>
					</view>
					<u--input v-model="formData[item.operationCode]" disabled disabledColor="#fff" placeholder="请选择"
						border="none" v-else></u--input>
					<u-icon slot="right" name="arrow-right" v-if="!['0','1'].includes(item.operationType)"></u-icon>
				</u-form-item>

				<!-- 图片上传 -->
				<view class="photo" v-if="item.requireImageFile !== '0' || !item.requireImageFile">
					<text class="tip">图片:</text>
<!-- 					<u-upload :aiAppendixDTOList="item.aiAppendixDTOList" :maxCount="3" :previewFullImage="true"
						@afterRead="afterRead($event,index)" @beforeRead="beforeRead($event, 'image')"
						@delete="deletePic($event,index)" name="1" multiple></u-upload>
					<view slot="title" class="u-slot-title">
					</view> -->
					<u-icon name="camera-fill" size="28px" color="#243d8f" @click="takePhotoAndVideo(item, index)" />
				</view>
				<view class="image-photo-list" v-for="(el, idx) in item.aiAppendixDTOList" :key="idx">
					<view v-if="['jpg', 'jpeg', 'png', 'mp4'].includes(el.type)" class="el-item">
						<view class="left">
							<u--image v-if="el.type === 'mp4'" src="/static/img/default_video.png" width="60px" height="60px" @click="preview(el)" />
							<u--image v-if="['jpg', 'jpeg', 'png'].includes(el.type)" :src="getImgSrc(el.filePath)" width="60px" height="60px" @click="preview(el)" />
							<view class="delete-icon">
								<u-icon name="close" size="20px" @click="deleteFile(el, idx, index)"></u-icon>
							</view>
							<view v-if="['jpg', 'jpeg', 'png'].includes(el.type)" class="extra-info">
								<u-icon name="error-circle" size="28px" color="#ff0000"></u-icon>
							</view>
						</view>

						<view class="right">
							<view class="channel-name">图片来源：{{ el.channelName || '本地上传图片' }}</view>
							<view>
								<u-radio-group
									v-model="el.flag"
									placement="row"
								>
									<u-radio
										v-for="item in checkboxOptions"
										class="mr10"
										:key="item.value"
										:label="item.name"
										:name="item.value"
									/>
								</u-radio-group>
							</view>
							<view v-if="el.flag">
								<u--textarea v-model="el.flagDesc" placeholder="请输入内容" height="60px" />
							</view>
						</view>
					</view>
					
				</view>
			</view>
			<view class="save-btn">
				<!-- <u-button @click="submit" text="保存" color="#3a62d7" class="btn"></u-button> -->
				<u-button @click="submit" text="保存" :disabled="saveBtnDisabled" color="#3a62d7" class="btn"></u-button>
			</view>
		</u--form>
		<!-- 操作面板 -->
		<u-action-sheet :show="showSingleAction" :actions="actions" title="请选择" @close="showSingleAction = false"
			@select="singleSelect">
		</u-action-sheet>
		<CustomSheet :show='isShowCustomSheet' :title="customSheetTitle" :selects='selects' :isHourSelect='isHourSelect'
			@close='isShowCustomSheet = false' @selectHourConfirm='selectHourConfirm'
			@customSheetConfirm='customSheetConfirm'>
		</CustomSheet>
		<u-calendar confirmDisabledText="请选择日期" :formatter="formatter" :show="isShowCalendar" :maxDate="maxDate"
			:minDate='minDate' :closeOnClickOverlay='true' :defaultDate='defaultDate' @confirm="confirmCalendar"
			ref="calendar" @close='isShowCalendar = false'>
		</u-calendar>
		<u-datetime-picker :show="isShowDatePicker" v-model="dateValue" mode="datetime" :closeOnClickOverlay='true'
			@close='isShowDatePicker = false' @cancel='isShowDatePicker = false'
			@confirm='handleDateTimePicker'></u-datetime-picker>
		<photo-and-video :show="showFlag" @closeModal="closeModal" />
		<preview-modal :show="showPreview" :src="videoSrc" @closeModal="closePreviewModal" />
	</view>
</template>

<script>
	
	const acceptImage = ['jpg', 'jpeg', 'png'];
	
	import CustomSheet from '@/components/common/customSheet.vue';
	import PhotoAndVideo from '@/components/common/photoAndVideo.vue';
	import PreviewModal from '@/components/common/previewModal.vue';
	import moment from 'moment'
	import {
		reportWorkContent,
		queryHistoryRecordByTime,
		queryBatchRecord,
		getRecord,
		deleteRecord
	} from "@/https/staging/index.js";
	import uploadHttp from '@/https/_public/upload';
	import {
		getToken
	} from '@/utils/auth.js';
	import {
		UPLOAD_LIMIT
	} from '@/utils/constants-custom';
	export default {
		name: "From",
		components: {
			CustomSheet,
			PhotoAndVideo,
			PreviewModal
		},
		props: {
			// 表单列表数据
			formList: {
				type: Array,
				default: () => []
			},
			// 保存按钮是否不可用
			saveBtnDisabled: {
				type: Boolean,
				default: false
			},
			// 公共参数
			commonParam: {
				type: Object,
				default: () => ({})
			}
		},
		watch: {
			formList: {
				handler(val) {
					if (val.length) {
						// 表单回显
						this.$nextTick(() => {
							// 初始化表单数据
							this.initFormData()
							this.submitFormData = JSON.parse(JSON.stringify(val))
						})
					}
				},
				// deep: true,
				immediate: true
			},
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
				const tempObj = {
					num: i,
					value: `${i>9?i:'0'+ i}:00:00`,
					label: `${i}:00~${i+1}:00`,
					isCheck: false
				}
				if (i === 23) {
					tempObj.value = `${i>9?i:'0'+ i}:59:59`
				}
				selectHours.push(tempObj)
			};
			const checkboxOptions = [{ name: '正常', value: 0, disabled: false }, {name: '异常', value: 1, disabled: false }];
			return {
				// 选择项
				checkboxOptions: Object.freeze(checkboxOptions),
				// 表单数据
				formData: {},
				// 单选操作面板数据
				actions: [],
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
				// 最小日期限制
				minDate: `${year}-${month}-${date -30}`,
				// 展示单选操作面板
				showSingleAction: false,
				// 当前操作的记录项下标
				currentIndex: 0,
				// 选择小时的列表-多选列表
				selects: [],
				// 时间为小时的选项
				selectHours,
				// 自定义面板标题
				customSheetTitle: '小时选择',
				// 已经填写内容的时间列表
				selectedDateList: [],
				// 是否是选择小时-只能选中一个时间点
				isHourSelect: false,
				// 显示的时间列表
				showTimeList: [],
				// 日期时间选择
				isShowDatePicker: false,
				// 日期值
				dateValue: Number(new Date()),
				// 日历默认值
				defaultDate: [moment().format('YYYY-MM-DD')],
				// 视频拍照框
				showFlag: false,
				checkboxValue1: 0,
				// 当前索引
				currentOperationIndex: null,
				// 图片视频预览
				showPreview: false,
				// 预览内容
				previewInfo: {},
				// 视频默认的图片
				defaultImgSrc: '/static/img/default_video.png',
				videoSrc: ''
			}
		},
		methods: {
			// 初始化表单数据
			initFormData() {
				this.showTimeList = [];
				this.formList.forEach((item, index) => {
					if (item.operationType === '1') {
						this.formData[item.operationCode] = item.contentInfo || item.lowerLimit || '';
					} else if (item.operationType === '3') {
						item.dictionaryContent.forEach(d => {
							if (d.code === item.contentInfo) {
								item.contentInfo = d.name
							}
						})
						this.formData[item.operationCode] = item.contentInfo || '';
					} else if (item.operationType === '4') {
						const list = item.contentInfo && item.contentInfo.split(',')
						const nameList = []
						list && list.length && item.dictionaryContent.forEach(d => {
							if (list.includes(d.code)) {
								nameList.push(d.name)
							}
						})
						item.contentInfo = nameList && nameList.join(',')
						this.formData[item.operationCode] = item.contentInfo || "";
					} else {
						this.formData[item.operationCode] = item.contentInfo || "";
					}

					// 初始化时间显示
					const hour = new Date().getHours()
					let hourTime = ''
					let hourValue = ''
					this.selectHours.forEach(h => {
						if (h.num === hour) {
							h.isCheck = true;
							hourTime = h.label;
							hourValue = h.value;
						}
					})
					const tempObj = {
						date: item.date || moment().format('YYYY-MM-DD'),
						hourTime: ''
					}
					if (item.executionFrequency === '0') {
						tempObj.hourTime = hourTime;
						tempObj.hourValue = hourValue;
					}
					this.showTimeList.push(tempObj);
				})
				// 设置验证规则
				this.setRules()
			},
			// 根据数据生成表单验证规则
			setRules() {
				this.formList.forEach(item => {
					if (item.isRequired) {
						const tempObj = {
							type: 'string',
							required: true,
							// message: '请填写' + item.operationName,
							message: '请填写',
							trigger: ['blur']
						}
						this.rules[item.operationCode] = tempObj
					}
				})
				this.$refs.uForm.setRules(this.rules)
			},
			// 表单保存
			submit() {
				this.$refs.uForm.validate().then(res => {
					console.log('----', this.submitFormData)
					this.submitFormData.forEach((item, index) => {
						if (item.operationType === "1") {
							item.contentInfo = this.formData[item.operationCode] || item.lowerLimit || '';
						} else {
							item.contentInfo = this.formData[item.operationCode];
						}
						const time = this.selectHours.filter(item => item.label == this.showTimeList[index]
							.hourTime);
						const timeStr = (time.length && time[0].value) || ''
						if (item.executionFrequency === '0') {
							item.workPlanTime = this.showTimeList[index].date + " " + timeStr;
						} else if (item.executionFrequency === '1') {
							const timeStr = (time.length && time[0].value) || ''
							item.workPlanTime = this.showTimeList[index].date + " 23:59:59";
						} else {
							item.workPlanTime = ''
						}
						item.aiAppendixDTOList.length && item.aiAppendixDTOList.forEach(f => {
							debugger;
							f.url = f.fileUrl || f.filePath;
							
						})
						item.aiAppendixList = item.aiAppendixDTOList;
						if (item.operationType === '3') {
							const obj = item.dictionaryContent.filter(d => d.name === item
								.contentInfo)[
								0]
							item.contentInfo = obj && obj.code
						} else if (item.operationType === '4') {
							const nameList = item.contentInfo && item.contentInfo.split(',');
							const codeList = []
							item.dictionaryContent.forEach(d => {
								if (nameList.includes(d.name)) {
									codeList.push(d.code)
								}
							})
							item.contentInfo = codeList.length && codeList.join(',')
						}
					})
					const param = {
						...this.commonParam,
						craftCode: this.commonParam.craftId,
						list: this.submitFormData,
					}
					reportWorkContent(param).then(res => {
						if (res.success) {
							uni.$u.toast('保存成功')
							this.showTimeList = [];
							this.$emit('reload')
						} else {
							uni.$u.toast(res.errMsg || '保存失败')
						}
					})
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			// 删除图片
			deletePic(event, index) {
				this.submitFormData[index].aiAppendixDTOList.splice(event.index, 1)
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
							let temp = item.fileName.split('.');
							let fileExt = temp[temp.length - 1];
							return {
								url: `http://10.16.9.128:9000/${item.filePath}`,
								filePath: item.filePath,
								fileName: item.fileName,
								name: item.fileName,
								type: fileExt.toLocaleLowerCase()
							}
						})
						this.submitFormData[index].aiAppendixDTOList.push(...uploadedList);
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

			// 展示时间选择（执行频率选择）
			async showTimeActionSheet(item, index, type) {
				this.currentIndex = index;

				const param = {
					workCode: this.commonParam.workCode,
					craftCode: this.commonParam.craftId,
					workScene: this.commonParam.workScene,
					operationCode: item.operationCode,
				}
				if (type === 'day') {
					const date = this.showTimeList[this.currentIndex].date;
					this.defaultDate = [date];
					param.endTime = moment().format('YYYY-MM-DD') + ' ' + '23:59:59';
					param.beginTime = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
					const results = await queryHistoryRecordByTime(param);
					this.selectedDateList = results.data.value || []
					this.isShowCalendar = true
				} else {
					param.beginTime = this.showTimeList[this.currentIndex].date + ' ' + '00:00:00';
					param.endTime = this.showTimeList[this.currentIndex].date + ' ' + '23:59:59';
					const results = await queryHistoryRecordByTime(param);
					const selectedHours = results.data.value || [];

					this.selectHours.forEach(item => {
						item.isDot = false
					})
					selectedHours.length && selectedHours.forEach(item => {
						this.selectHours.forEach((hour, index) => {
							if (item.includes(hour.value)) {
								hour.isDot = true;
							}
						})
					})
					this.selects = this.selectHours;
					this.isHourSelect = true;
					// 小时显示单选picker
					this.isShowCustomSheet = true
				}

			},
			// 日历显示已选择的日期
			formatter(day) {
				this.selectedDateList.forEach(item => {
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
						this.selectedDateList = res.data.value || []
					}
				})
			},
			// 展示选择操作面板
			showAction(item, index) {
				this.currentIndex = index;
				if (item.operationType === '0' || item.operationType === '1') {
					return
				} else if (item.operationType === '2') {
					this.isShowDatePicker = true;
				} else if (item.operationType === '3') {
					this.showSingleAction = true;
					this.actions = item.dictionaryContent
				} else if (item.operationType === '4') {
					if (item.dictionaryContent && item.dictionaryContent.length) {
						const selectedList = (item.contentInfo && item.contentInfo.split(',')) || []
						const list = [];
						item.dictionaryContent.forEach(item => {
							let checkFlag = selectedList.includes(item.name);
							list.push({
								value: item.code,
								label: item.name,
								isCheck: checkFlag
							})
						})
						this.isHourSelect = false;
						this.selects = list;
						this.customSheetTitle = item.operationName + '选择';
						this.isShowCustomSheet = true;
					}
				}
			},
			// 日期时间选择确认-区别日期选择
			handleDateTimePicker(dateObj) {
				const date = moment(dateObj.value).format('YYYY-MM-DD HH:mm')
				const currentItem = this.submitFormData[this.currentIndex];
				this.formData[currentItem.operationCode] = date;
				this.$refs.uForm.validateField(currentItem.operationCode);
				this.isShowDatePicker = false;
			},
			// 单选面板确认事件
			singleSelect(e) {
				const currentItem = this.submitFormData[this.currentIndex];
				// this.formData[currentItem.operationCode] = e.code;
				this.formData[currentItem.operationCode] = e.name;
				this.$refs.uForm.validateField(currentItem.operationCode);
			},
			// 多选面板确认
			customSheetConfirm(list) {
				const currentItem = this.submitFormData[this.currentIndex];
				const contentInfo = list.map(item => item.label).join(',');
				this.$set(this.submitFormData[this.currentIndex], 'contentInfo', contentInfo);
				this.formData[currentItem.operationCode] = contentInfo;
				this.$refs.uForm.validateField(currentItem.operationCode);
				this.isShowCustomSheet = false;
			},
			// 小时确认框
			selectHourConfirm(selectedList) {
				this.$set(this.showTimeList[this.currentIndex], 'hourTime', selectedList[0].label);
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
				this.updateRecord(params, this.submitFormData[this.currentIndex].operationCode)
				this.isShowCustomSheet = false
			},
			// 日历确认框
			confirmCalendar(date) {
				this.$set(this.showTimeList[this.currentIndex], 'date', date[0])
				const currentItem = this.submitFormData[this.currentIndex];
				let hourTime = this.showTimeList[this.currentIndex].hourTime || '00:00:00';
				this.selectHours.forEach(item => {
					if (item.label === hourTime) {
						hourTime = item.value
					}
				})
				const beginTime = date[0] + ' ' + hourTime;
				const params = [{
					workCode: this.commonParam.workCode,
					craftCode: this.commonParam.craftId,
					workScene: this.commonParam.workScene,
					operationCode: this.submitFormData[this.currentIndex].operationCode,
					beginTime,
					executionFrequency: this.submitFormData[this.currentIndex].executionFrequency
				}]
				this.updateRecord(params, this.submitFormData[this.currentIndex].operationCode)
				this.isShowCalendar = false;
			},
			changeNumber(value, item, index) {
				this.currentIndex = index;
				const currentItem = this.submitFormData[this.currentIndex];
				if (Number(value) < Number(currentItem.lowerLimit)) {
					uni.$u.toast('输入值不能小于最小值' + currentItem.lowerLimit)
					this.formData[currentItem.operationCode] = currentItem.lowerLimit;
				} else if (Number(value) > Number(currentItem.upperLimit)) {
					uni.$u.toast('输入值不能大于最大值' + currentItem.upperLimit)
					this.formData[currentItem.operationCode] = currentItem.upperLimit;
				} else {
					this.formData[currentItem.operationCode] = value;
				}
				this.$refs.uForm.validateField(currentItem.operationCode);
			},
			// 更新单个记录数据
			updateRecord(params, operationCode) {
				queryBatchRecord(params).then(res => {
					if (res.success && res.data && Array.isArray(res.data.value)) {
						const record = res.data.value[0] || {}
						const aiAppendixDTOList = record.aiAppendixDTOList || [];
						aiAppendixDTOList.forEach(img => {
							img.url =
								`http://10.16.9.128:9000/${img.fileUrl}`;
							img.type = img.fileType || "";
							img.name = img.fileName || '';
							img.filePath = img.fileUrl;
						})
						let contentInfo = record.contentInfo;
						const item = this.submitFormData.filter(item => item.operationCode === operationCode)[0];
						// 根据返回code，回显中文
						if (item.operationType === '1') {
							contentInfo = record.contentInfo || record.lowerLimit || '';
						} else if (item.operationType === '3') {
							item.dictionaryContent.forEach(d => {
								if (d.code === record.contentInfo || d.name === record.contentInfo) {
									contentInfo = d.name;
								}
							})
						} else if (item.operationType === '4') {
							const list = record.contentInfo && record.contentInfo.split(',')
							const nameList = []
							item.dictionaryContent.forEach(d => {
								if (list && list.length && list.includes(d.code)) {
									nameList.push(d.name)
								}
							})
							item.contentInfo = nameList && nameList.join(',')
							contentInfo = item.contentInfo || "";
						}
						this.$set(this.submitFormData[this.currentIndex], 'contentInfo', contentInfo);
						this.$set(this.submitFormData[this.currentIndex], 'id', record.id);
						this.$set(this.submitFormData[this.currentIndex], 'aiAppendixDTOList', aiAppendixDTOList);
						this.$set(this.formData, operationCode, contentInfo);
						this.$refs.uForm.validateField(operationCode);
						this.$forceUpdate(); // 强制更新页面，解决单选时不更新页面问题
					}
				})
			},
			// 拍照录像
			takePhotoAndVideo(item, index) {
				uni.setStorageSync('ims_currentWorkProcedure', item);
				this.currentOperationIndex = index;
				this.showFlag = true;
			},
			// 关闭视频与图片弹框
			closeModal(flag) {
				this.showFlag = false;
				if(flag) {
					let temp = JSON.parse(uni.getStorageSync('ims_uploadOperation'));
					let oldData = this.submitFormData[this.currentOperationIndex].aiAppendixDTOList;
					console.log('-------', oldData);
					let oldDataIdList = oldData.map(item => item.id);
					console.log('oldDataIdList-------', oldDataIdList);
					let params = {
						operationCode: temp.operationCode,
						workCode: this.commonParam.workCode,
						workScene: this.commonParam.workScene
					}
					getRecord(params)
					.then(res => {
						if (res.success && res.data) {
							let revData = res.data.value || [];
							let newData = [];
							revData.map((item, index) => {
								if (!oldDataIdList.includes(item.id)) {
									let temp = item.appendixUrl.split('.');
									newData.push({
										...item,
										url: `http://10.16.9.128:9000/${item.appendixUrl}`,
										filePath: item.appendixUrl,
										type: temp[temp.length - 1]
									});
								}
							})
							// this.submitFormData[this.currentOperationIndex].aiAppendixDTOList = [...oldData, ...newData];
							
							this.$set(this.submitFormData[this.currentOperationIndex], 'aiAppendixDTOList', [...oldData, ...newData]);
							console.log('After Add', this.submitFormData[this.currentOperationIndex].aiAppendixDTOList)

								this.$forceUpdate();
							this.showFlag = false;
						}

					})
				} else {
					this.showFlag = false;
				}

				// this.showFlag = false;
				// if (!testData || !testData.length) return;
				// // 查询数据信息
				// let newData = testData.map(item => {
				// 	return {
				// 	...item,
				// 	isNormal: 1,
				// 	note: ''
				// 	}
				// })
				// this.submitFormData[this.currentOperationIndex].aiAppendixDTOList.push(...newData);
				// console.log(this.submitFormData[this.currentOperationIndex].aiAppendixDTOList)
				
			},
			// 获 取图片地址
			getImgSrc(src) {
				return `http://10.16.9.128:9000/${src}`;
			},
			// 预览图片和视频
			preview(info) {
				if (acceptImage.includes(info.type)) {
					uni.previewImage({
						current: 0,
						urls: [this.getImgSrc(info.filePath)]
					});
					return;
				}
				if (info.type === 'mp4') {
					this.showPreview = true;
					this.videoSrc = info.url;
				}
			},
			// 关闭预览框
			closePreviewModal() {
				this.showPreview = false;
			},
			// 删除
			deleteFile(item, idx, index) {
				deleteRecord(item.id)
				.then(res => {
					if (res.success) {
						
						this.submitFormData[index].aiAppendixDTOList.splice(idx, 1);
						console.log('After delete----', this.submitFormData[index].aiAppendixDTOList)
					} 
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	@import '@/assets/css/staging/index.scss';

	.form {
		height: calc(100% - 260px);
		overflow-y: auto;
		margin: 0 16rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.form-item {
			.tip {
				margin-right: 10rpx;
				font-size: $minFontSize;
			}

			.title {
				margin-left: 20rpx;
				margin-top: 10rpx;

				.operation-name {
					display: flex;
					justify-content: space-between;
					font-size: $titleFontSize;
					margin-bottom: 10rpx;

					.picker-tag {
						display: flex;
						margin-bottom: 10rpx;
						margin-left: 20rpx;

						.time-type {
							padding: 0 12rpx;
							color: #3a62d7;
							font-size: $minFontSize;
						}

						.time-select-box {
							display: flex;

							.btn-link {
								margin-top: 3px;
								color: #3a62d7;
							}
						}
					}

					.name {
						width: 60%;
						/* white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis; */
					}
				}

				.operation-description {
					font-size: $minFontSize;
				}
			}

			.number {
				display: flex;

				.data-unit {
					margin-left: 20px;
					margin-top: 5px;
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
			display: flex;
			justify-content: space-around;

			.btn {
				width: 90%;
				height: 60rpx;
				line-height: 60rpx;
				margin: 20rpx 10rpx;
				background-color: #f6f8fb;
				border-radius: 10rpx;
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
				font-size: $fontSize;
			}

			.u-form-item__body {
				margin: 0 20rpx;
			}
		}

		/deep/ .uni-input-input {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.image-photo-list {
			.el-item {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				box-sizing: border-box;
				margin: 10px;
				.left {
					position: relative;
					width: 60px;
					height: 60px;
					.delete-icon {
						position: absolute;
						top: 0;
						right: 0;
					}
					.extra-info {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}

				.right {
					flex: 1;
					box-sizing: border-box;
					margin-left: 10px;
					.channel-name {
						height: 24px;
						line-height: 24px;
						font-size: 14px;
					}
					/deep/ .u-radio-group {
						height: 24px;
					}
					/deep/ .u-textarea__field {
						font-size: 14px;
					}
				}
			}
		}
		.mr10 {
			margin-right: 10px;
		}
		.error-1 {
			top: 50%;
			left: 50%;
			transform: (-50%, -50%);
		}
	}
</style>