<!-- 视频方案中的拍照和视频 -->
<template>
	<!-- 	<u-modal ref="custModal" :show="show" :confirmText="confirmText" :asyncClose="true" @confirm="confirm">
		<view class="content">
			<u--form labelPosition="left" labelWidth="auto" :model="form" ref="custForm">
				<u-form-item label="相机类型:" prop="type" borderBottom ref="type">
					<u-radio-group v-model="form.type" placement="row">
						<u-radio class="type" v-for="item in radioOptions" :key="item.value" :label="item.label"
							:name="item.value" />
					</u-radio-group>
				</u-form-item>
				<u-form-item v-if="form.type !== 3" label="视频通道:" prop="channelName" borderBottom ref="channelName">
					<uni-data-select v-model="form.channelCode" :localdata="channelOptions" @change="selectChange"
						@selectorShowChange="selectorShowChange">
					</uni-data-select>
				</u-form-item>
				<u-form-item v-show="form.type === 1 && !hideVideo" label="视频预览:" borderBottom>
					<view v-show="form.type === 1 && !hideVideo" class="realtime-video">
						<web-view class="full-content" src="https://www.baidu.com" :webview-styles="webviewStyles" :fullscreen="false"></web-view>
					</view>
				</u-form-item>
				<u-form-item label="操作类型:" borderBottom>
					<view class="btn-wrapper">
						<u-button type="primary" class="btn mr20" color="#243d8f" :text="getImageBtnText" :loading="photoLoading"
							@click="takePhoto" />
						<u-button type="primary" class="btn" color="#243d8f" :loading="videoLoading" :text="getBtnText"
							@click="takeVideo" />
					</view>
				</u-form-item>
			</u--form>
		</view>
	</u-modal> -->
	<u-popup class="cust-popup" mode="top" :show="show" :closeOnClickOverlay="false" @close="confirm">
		<view v-if="showWebview" class="web-view-wrapper">
			<web-view class="full-content" :src="src" :webview-styles="webviewStyles" :fullscreen="false"></web-view>
		</view>
		<view v-else class="web-view-wrapper">
			暂无实时视频可预览
		</view>
		<view class="title">
			实时视频预览
		</view>
		<view class="tip">
			实时视频预览仅在相机类型为固定相机时可用，相机设备与当前时间可能存在一定的偏差
		</view>
		<view class="cust-form">
			<u--form labelPosition="left" labelWidth="auto" :model="form" ref="custForm">
				<u-form-item label="来源:" prop="type" borderBottom ref="type">
					<u-radio-group v-model="form.type" placement="row">
						<u-radio class="type" v-for="item in radioOptions" :key="item.value" :label="item.label"
							:name="item.value" />
					</u-radio-group>
				</u-form-item>
				<u-form-item v-if="form.type !== 3" label="视频通道:" prop="channelName" borderBottom ref="channelName">
					<uni-data-select v-model="form.channelCode" :localdata="channelOptions" @change="selectChange"
						@selectorShowChange="selectorShowChange">
					</uni-data-select>
				</u-form-item>
				<u-form-item label="操作:" borderBottom>
					<view class="btn-wrapper">
						<u-button type="primary" class="btn mr20" color="#243d8f" :text="getImageBtnText"
							:loading="photoLoading" :disabled="btnDisabled" @click="takePhoto" />
						<u-button type="primary" class="btn" color="#243d8f" :disabled="btnDisabled" :loading="videoLoading" :text="getBtnText"
							@click="takeVideo" />
					</view>
				</u-form-item>
			</u--form>
			<view class="close-btn">
				<u-button type="primary" color="#243d8f" :text="confirmText" :disabled="photoLoading || videoLoading" @click="confirm"></u-button>
			</view>

		</view>
	</u-popup>

	</view>
</template>

<script>
	let userInfo = JSON.parse(uni.getStorageSync('hb_dq_mes_user_info'));
	import moment from 'moment';
	import {
		uploadLocalFile,
		uploadRemoteFile,
		getBindDevice
	} from "@/https/staging/index";
	import uploadHttp from '@/https/_public/upload';
	import {
		getToken,
		setToken
	} from '@/utils/auth.js';
	import {
		getFileServerUrl
	} from "@/utils/config";

	const radioOptions = [{
			label: '固定工位',
			value: 1
		},
		// {
		// 	label: '便携相机',
		// 	value: 2
		// },
		{
			label: '本地相机',
			value: 3
		}
	]
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				channelOptions: [],
				form: {
					type: 3,
					channelCode: '',
					channelName: '',
					deviceCode: ''
				},
				photoLoading: false,
				videoLoading: false,
				hideVideo: false,
				// 开始录制
				isStart: true,
				webviewStyles: {
					progress: {
						color: '#FF3333'
					},
					width: '100%',
					height: '300px'
				},
				startTime: null,
				endTime: null,
				showFlag: true
			}
		},
		computed: {
			getBtnText() {
				if (this.videoLoading) {
					return ''
				} else {
					return this.form.type === 3 ? '上传本地视频' : this.isStart ? '开始录制' : '结束录制';
				}
			},
			getImageBtnText() {
				return this.form.type === 3 ? '上传本地图片' : '抓图';
			},
			confirmText() {
				return this.isStart ? '关闭' : '结束录制并关闭';
			},
			showWebview() {
				return this.form.type !== 3 && this.form.channelCode !== '' && this.showFlag;
			},
			src() {
				return `https://ims.cloud-hb.com/#/thirdOAuth?username=${userInfo.username}&password=${userInfo.password}&redirect=${encodeURIComponent(`https://ims.cloud-hb.com/Evo-web-logis/#/videoMonitor?channelSeq=${this.form.channelCode}&deviceCode=${this.form.deviceCode}&isOnline=true`)}`
			},
			// 勘察工单只允许使用本地相机
			radioOptions() {
				let { workOrderType } = uni.getStorageSync('ims_workOrder');
				let temp = radioOptions.filter(item => item.value === 3);
				return workOrderType === 1 ? temp : radioOptions;
			},
			btnDisabled() {
				return this.form.type === 1 && !this.form.channelCode
			}
		},
		watch: {
			show(newVal) {
				if (newVal) {
					this.form = {
						type: 3,
						channelCode: '',
						channelName: '',
						deviceCode: ''
					}
					this.isStart = true;
					// 获取视频通道列表
					let {
						id
					} = uni.getStorageSync('ims_workOrder');
					let {
						workProcedureCode,
						workProcedureType,
						workOrderSceneType
					} = uni.getStorageSync('ims_workStep');
					let temp = workProcedureCode.split('_');
					let params = {
						workCode: id,
						procedureCode: temp[temp.length - 1],
						procedureType: workProcedureType,
						workOrderSceneType
					}
					getBindDevice(params)
						.then(res => {
							if (res.success && res.data) {
								this.channelOptions = (res.data.channelInfoList || []).map(item => {
									return {
										value: item.channelCode,
										text: item.channelName,
										deviceCode: item.deviceCode
									}
								})
							} else {
								this.channelOptions = [];
							}
						})
				}
			}
		},
		methods: {
			// 选择的内容变化
			selectChange(value, item) {
				if (value) {
					this.form.channelCode = item.value;
					this.form.channelName = item.text;
					this.form.deviceCode = item.deviceCode
				}
				this.showFlag = false;
				setTimeout(() => {
					this.showFlag = true;
					console.log(this.src);
				}, 100)
			},
			takePhoto() {
				// 本地拍照
				if (this.form.type === 3) {
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], //从相册选择
						success: res => {
							let uploadList = res.tempFiles;
							this.uploadFile(uploadList, 'image');
						}
					})
				} else if (this.form.type === 1) {
					this.photoLoading = true;
					this.uploadRemoteFile('image', () => {
						this.photoLoading = false;
					})
				}
			},
			takeVideo() {
				// 本地录制视频
				if (this.form.type === 3) {
					uni.chooseVideo({
						sourceType: ['album', 'camera'], //从相册选择
						success: res => {
							let uploadList = [{
								path: res.tempFilePath
							}];
							this.uploadFile(uploadList, 'video');
						}
					})
				} else if (this.form.type === 1) {
					// 固定工位相机
					this.videoLoading = true;
					if (this.isStart) {
						this.startTime = moment().format('YYYY-MM-DD HH:mm:ss');
						this.videoLoading = false;
						this.isStart = false;
					} else {
						this.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
						this.uploadRemoteFile('video', () => {
							this.videoLoading = false;
							this.isStart = true;
						})
					}
				}
			},
			// 上传图片和视频
			uploadFile(uploadList, fileType) {
				let uploadTask = [];
				for (let i = 0; i < uploadList.length; i++) {
					uploadTask.push(this.uploadFilePromise(uploadList[i].path));
				}
				this[fileType === 'image' ? 'photoLoading' : 'videoLoading'] = true;
				Promise.all(uploadTask)
					.then(res => {
						let successList = res.filter(item => item.status === 0);
						if (successList.length < uploadList.length) {
							uni.showToast({
								title: '存在上传失败的文件',
								duration: 2000
							});
						}
						let uploadedList = successList.map(item => {
							let temp = item.fileName.split('.');
							let fileExt = temp[temp.length - 1];
							return {
								url: `${getFileServerUrl()}${item.filePath}`,
								filePath: item.filePath,
								fileName: item.fileName,
								type: fileExt.toLocaleLowerCase()
							}
						})
						if (uploadedList.length) {
							let {
								projName,
								prodNumber,
								id: workCode
							} = uni.getStorageSync('ims_workOrder');
							let {
								id,
								operationCode,
								workPlanTime
							} = uni.getStorageSync('ims_currentWorkProcedure');
							let { workOrderSceneType } = uni.getStorageSync('ims_workStep');
							let params = {
								workCode,
								workScene: workOrderSceneType,
								projName,
								prodNumber,
								operationId: id,
								operationCode,
								workPlanTime,
								appendixType: fileType === 'image' ? 2 : 1,
								appendixUrl: uploadedList[0].filePath
							}
							uploadLocalFile(params)
								.then(res => {
									if (res.success) {
										uni.showToast({
											icon: 'success',
											title: '上传成功'
										})
										let { operationCode, operationId } = res.data;
										uni.setStorageSync('ims_uploadOperation', JSON.stringify({ operationCode: operationCode, operationId: operationId }));
									} else {
										uni.showToast({
											icon: 'error',
											title: res.errMsg || '上传失败'
										})
									}
								})
								.finally(() => {
									this[fileType === 'image' ? 'photoLoading' : 'videoLoading'] = false;
								})
						}
					})
			},
			// 上传文件到服务器
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
			selectorShowChange(flag) {
				this.hideVideo = flag;
			},
			confirm() {
				if (!this.isStart) {
					this.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
					this.uploadRemoteFile('video', () => {
						this.videoLoading = false;
						this.isStart = true;
					}, () => {
						this.$emit('closeModal', true);
					})
				} else {
					this.$emit('closeModal', true);
				}
			},
			// 固定工位、便携相机上传视频和图片
			uploadRemoteFile(fileType, doneFunc, successFunc) {
				let {
					projName,
					prodNumber,
					id: workCode
				} = uni.getStorageSync('ims_workOrder');
				let {
					id,
					operationCode,
					workPlanTime
				} = uni.getStorageSync('ims_currentWorkProcedure');
				let {
					channelCode,
					channelName
				} = this.form;
				let { workOrderSceneType } = uni.getStorageSync('ims_workStep');
				let params = {
					workCode,
					workScene: workOrderSceneType,
					projName,
					prodNumber,
					operationId: id,
					operationCode,
					appendixType: fileType === 'image' ? 2 : 1,
					channelCode,
					channelName,
					workPlanTime
				}
				if (fileType === 'video') {
					params.videoStartTime = this.startTime;
					params.videoEndTime = this.endTime;
				}
				uploadRemoteFile(params)
					.then(res => {
						if (res.success) {
							uni.showToast({
								icon: 'success',
								title: '上传成功'
							})
							let { operationCode, operationId } = res.data;
							uni.setStorageSync('ims_uploadOperation', JSON.stringify({ operationCode: operationCode, operationId: operationId }));
							successFunc && successFunc();
						} else {
							uni.showToast({
								icon: 'error',
								title: res.errMsg || '上传失败'
							})
							this.$refs.custModal.loading = false;
						}
					})
					.finally(() => {
						doneFunc();
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 10px;

		.btn {
			width: 120px;
		}

		.mr20 {
			margin-right: 20px;
		}
	}

	.cust-popup {
		position: relative;

		.web-view-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 300px;
			color: #909399;
		}

		.title {
			position: absolute;
			top: 300px;
			height: 40px;
			line-height: 40px;
			text-align: center;
			width: 100%;
			background-color: #fff;
			border-top: 1px solid #ccc;
		}

		.tip {
			position: absolute;
			top: 340px;
			height: 30px;
			line-height: 30px;
			padding-left: 20px;
			font-size: 14px;
			color: #909399;
			width: 100%;
			background-color: #fff;
			border-top: 1px solid #ccc;
			border-bottom: 1px solid #ccc;
		}

		.cust-form {
			position: absolute;
			top: 370px;
			height: 260px;
			width: 100%;
			background-color: #fff;
			border-bottom-right-radius: 10px;
			border-bottom-left-radius: 10px;
		}

		.type {
			margin-right: 20px;
			font-size: 13px;
		}

		.close-btn {
			padding: 20px;
		}
	}
</style>