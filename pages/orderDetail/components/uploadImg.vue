<template>
	<u-popup class="cust-popup" :show="visible" :round="20" :closeOnClickOverlay="false">
		<view class="popup-top">
			<text class="btn-wrapper" @tap="cancel">取消</text>
			<text class="title">{{ title }}</text>
			<text class="btn-wrapper confirm" @tap="confirm">确定</text>
		</view>
		<view class="popup-content">
			<view class="upload-tip">仅支持png、jpg、jpeg格式图片，最多3张，单张20M以内</view>
			<u-upload name="imgUpload" multiple accept="image" :useBeforeRead="true" :fileList="imageList" :maxCount="3"
				@beforeRead="beforeRead($event, 'image')" @afterRead="afterRead($event, 'image')"
				@delete="deleteFile($event, 'image')" />
		</view>
	</u-popup>
</template>
<script>
	import {
		UPLOAD_LIMIT
	} from '@/utils/constants-custom';
	import {
		uploadFile,
		bindPic
	} from '@/https/overhaul/bom';
	import uploadHttp from '@/https/_public/upload';
	import {
		getFileServerUrl
	} from "@/utils/config";
	import {
		getToken,
		setToken
	} from '@/utils/auth.js';
	const titleMap = {
		1: '拆解照片',
		2: '厂内生产照片'
	}
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			// 
			imgType: {
				type: Number,
				default: 1
			},
			bomInfo: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				imageList: []
			}
		},
		computed: {
			title() {
				return titleMap[this.imgType];
			}
		},
		watch: {
			visible(newVal) {
				if (newVal && this.bomInfo) {
					this.imageList = this.bomInfo.imgList.filter(item => item.imgType === this.imgType).map(item => {
						return {
							url: `${getFileServerUrl()}${item.imgPath}`,
							filePath: item.imgPath,
							fileName: item.imgName
						}
					})
				}
			}
		},
		methods: {
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
			afterRead(file, type) {
				let uploadList = file.file;
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
							url: `${getFileServerUrl()}${item.filePath}`,
							filePath: item.filePath,
							fileName: item.fileName
						}
					})
					this[`${type}List`].push(...uploadedList);
				})
			},
			deleteFile(event, type) {
				let index = event.index;
				this[`${type}List`].splice(index, 1);
			},
			// 判断是否图片是否超出限制
			isOverSize(size, type) {
				return size > UPLOAD_LIMIT[type].maxSize;
			},
			cancel() {
				this.imageList = [];
				this.$emit('closePopup', false);
			},
			// 添加图片
			confirm() {
				if (!this.imageList.length) {
					this.$emit('closePopup', false);
					return;
				}
				let { id, workId } = this.bomInfo;
				let params = {
					bomId: id,
					workId,
					imgList: this.imageList.map(item => {
						return {
							imgPath: item.filePath,
							imgName: item.fileName,
							imgType: this.imgType
						}
					})
				}
				bindPic(params)
				.then(res => {
					if (res.success) {
						uni.showToast({
							title: '操作成功',
							duration: 2000
						});	
						this.$emit('closePopup', true);
					} else {
						uni.showToast({
							title: res.errMsg,
							duration: 2000
						});	
					}
				})
			},
			// 上传图片到服务器
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
		}
	}
</script>
<style lang="scss" scoped>
	.cust-popup {
		box-sizing: border-box;
	}

	.popup-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		height: 80rpx;

		.btn-wrapper {
			font-size: 28rpx;
			color: #657685;
		}

		.confirm {
			color: #3a62d7;
		}

		.title {
			font-size: 32rpx;
			font-weight: 700;
		}
	}

	.popup-content {
		height: 200px;
		padding: 0 20rpx;
		overflow: auto;

		.upload-tip {
			line-height: 80rpx;
			font-size: 24rpx;
			color: #ccc;
		}
	}

	.preview-cover {
		position: absolute;
		bottom: 0;
		box-sizing: border-box;
		width: 100%;
		padding: 8rpx;
		color: #fff;
		font-size: 24rpx;
		text-align: center;
		background: rgba(0, 0, 0, 0.3);
	}
</style>