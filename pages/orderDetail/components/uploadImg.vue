<template>
<!-- 	<van-popup position="bottom" close-on-popstate round class="cust-popup" :close-on-tap-overlay="false"
		:value="visible" :style="{ height: '50%' }">
		<view class="popup-top">
			<text class="btn-wrapper" @tap="cancel">取消</text>
			<text class="title">{{ title }}</text>
			<text class="btn-wrapper confirm" @tap="confirm">确定</text>
		</view>
		<view class="popup-content">
			<view class="upload-tip">仅支持png、jpg、jpeg格式图片，最多3张，单张20M以内</view>
			<van-uploader v-model="fileList" multiple max-count="3" :before-read="beforeRead" :after-read="afterRead">
				<template #preview-cover>
					<view class="preview-cover van-ellipsis">预览</view>
				</template>
			</van-uploader>
		</view>
	</van-popup> -->
	<u-popup :show="visible" :round="20" :closeOnClickOverlay="false">
		<view class="popup-top">
			<text class="btn-wrapper" @tap="cancel">取消</text>
			<text class="title">{{ title }}</text>
			<text class="btn-wrapper confirm" @tap="confirm">确定</text>
		</view>
		<view class="popup-content">
			<view class="upload-tip">仅支持png、jpg、jpeg格式图片，最多3张，单张20M以内</view>
			<u-upload name="imgUpload" multiple accept="image" :useBeforeRead="true" :fileList="imageList"
				:maxCount="3" @beforeRead="beforeRead($event, 'image')" @afterRead="afterRead($event, 'image')"
				@delete="deleteFile($event, 'image')" />
		</view>
	</u-popup>
</template>
<script>
	
	import { UPLOAD_LIMIT } from '@/utils/constants-custom';
	
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: '上传照片'
			}
		},
		data() {
			return {
				imageList: [],

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
				this[`${type}List`].push(...file.file);
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
			confirm() {
				// 上传图片到服务器
				this.imageList = [];
				this.$emit('closePopup', true);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.cust-popup {
		padding: 0 40rpx;
		box-sizing: border-box;
	}

	.popup-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
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
		height: calc(100% - 80rpx);
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