<template>
	<van-popup position="bottom" close-on-popstate round class="cust-popup" :close-on-tap-overlay="false"
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
	</van-popup>
</template>
<script>
	const MAX_IMG_SIZE = 10 * 1024 * 1024;
	const ACCEPT_TYPE = ['image/jpg', 'image/jpeg', 'image/png'];

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
				fileList: [],

			}
		},
		methods: {
			beforeRead(file) {
				// 单选图片
				return new Promise((resolve, reject) => {
					if (!Array.isArray(file)) {
						if (this.isOverSize(file.size)) {
							this.$toast.fail('所选图片请勿超过20M');
							reject();
						}
						if (!this.isAcceptType(file.type)) {
							this.$toast.fail('仅支持jpg、jpeg、png格式图片');
							reject();
						}
						resolve(file);
					} else {
						let eligibleFile = file.filter(item => {
							return !this.isOverSize(item.size) && this.isAcceptType(item.type)
						})
						if (!eligibleFile.length) {
							this.$toast.fail('所选图片不符合要求');
							reject();
						}
						if (eligibleFile.length && eligibleFile.length < file.length) {
							this.$toast({
								message: '已自动过滤不符合条件的图片',
								duration: 3000
							});
							resolve(eligibleFile);
						}
						resolve(file);
					}
				})
			},
			afterRead(file) {
				console.log(this.fileList);
			},
			cancel() {
				this.fileList = [];
				this.$emit('closeDialog', false);
			},
			confirm() {
				// 上传图片到服务器
				this.fileList = [];
				this.$emit('closeDialog', true);
			},
			// 判断是否图片是否超出限制
			isOverSize(size) {
				return size > MAX_IMG_SIZE;
			},
			isAcceptType(type) {
				return ACCEPT_TYPE.includes(type.toLowerCase());
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