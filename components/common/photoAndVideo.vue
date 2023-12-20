<!-- 视频方案中的拍照和视频 -->
<template>
	<u-modal :show="show">
		<view class="content">
			<u--form labelPosition="left" labelWidth="auto" :model="form" ref="custForm">
				<u-form-item label="相机类型:" prop="type" borderBottom ref="type">
					<u-radio-group v-model="form.type" placement="row">
						<u-radio class="type" v-for="item in radioOptions" :key="item.value" :label="item.label"
							:name="item.value" />
					</u-radio-group>
				</u-form-item>
				<u-form-item v-if="form.type !== 3" label="视频通道:" prop="channelName" borderBottom ref="channelName">
					<uni-data-select
					  v-model="form.channelCode"
					  :localdata="channelOptions"
					  @change="selectChange"
					  @showSelect="showSelect">
					</uni-data-select>
				</u-form-item>
				<u-form-item v-show="form.type === 1" label="视频预览:" borderBottom>
					<video id="myVideo" class="video-el" src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4"
						@error="videoErrorCallback" controls></video>
				</u-form-item>
				<u-form-item label="操作类型:" borderBottom>
					<view class="btn-wrapper">
						<u-button type="primary" class="btn mr20" color="#243d8f" text="拍照" icon="photo" :loading="photoLoading" @click="takePhoto" />
						<u-button type="primary" class="btn" color="#243d8f" icon="camera" :text="btnText" :loading="videoLoading" @click="takeVideo" />
					</view>
				</u-form-item>
			</u--form>
		</view>
	</u-modal>
</template>

<script>
	
	import uploadHttp from '@/https/_public/upload';
	import {
		getToken,
		setToken
	} from '@/utils/auth.js';
	
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
				radioOptions: Object.freeze(radioOptions),
				channelOptions: [
					{ value: 1, text: '测试通道1' },
					{ value: 2, text: '测试通道2' },
					{ value: 3, text: '测试通道3' }
				],
				form: {
					type: 3,
					channelCode: '',

				},
				btnText: '开始录像',
				photoLoading: false,
				videoLoading: false,
				isStart: true,
				photoList: [],
				videoList: [],
				hideVideo: false
			}
		},
		computed: {
			
		},
		onReady: function(res) {
			// #ifndef MP-ALIPAY
			this.videoContext = uni.createVideoContext('myVideo');
			// #endif
		},
		methods: {
			selectChange() {},
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			takePhoto() {
				// 本地拍照
				if (this.form.type === 3) {
					uni.chooseImage({
						count: 3, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], //从相册选择
						success: res => {
							let uploadList = res.tempFiles;
							this.uploadFile(uploadList);
						}
					})
				} else if (this.form.type === 1) {
					this.photoLoading = true;
					// 固定工位相机，直接调用后端接口
					setTimeout(() => {
						// this.$emit('closeModal', false);
						this.photoLoading = false;
					// 	this.isStart  =
					}, 2000)
				}
			},
			takeVideo() {
				// 本地录制视频
				if (this.form.type === 3) {
					uni.chooseVideo({
						sourceType: ['album', 'camera'], //从相册选择
						success: res =>  {
							let uploadList = res.tempFiles;
							this.uploadFile(uploadList);
						}
					})
				} else if (this.form.type === 1) {
					// 固定工位相机，直接调用后端接口
					this.videoLoading = true;
					setTimeout(() => {
						this.$emit('closeModal', false);
						this.videoLoading = false;
					}, 2000)
				}
			},
			// 上传图片
			uploadFile(uploadList) {
				let uploadTask = [];
				for (let i = 0; i < uploadList.length; i++) {
					uploadTask.push(this.uploadFilePromise(uploadList[i].path));
				}
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
						return {
							url: `http://10.16.9.128:9000/${item.filePath}`,
							filePath: item.filePath,
							fileName: item.fileName
						}
					})
					console.log('图片上传-----', uploadedList);
					// 调用后端接口

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
			showSelect(flag) {
				this.hideVideo = !flag;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: block;

		.type {
			margin-right: 20px;
			font-size: 13px;
		}
	}
	.h200 {
		height: 200px;
	}
	.video-el {
		width: 100%;
	}
	.btn-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 10px;
		.btn {
			width: 120px;
		}
	}
	.mr20 {
		margin-right: 20px;
	}
</style>