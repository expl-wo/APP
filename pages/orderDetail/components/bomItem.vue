<template>
	<view class="bom-item">
		<view class="wrapper">
			<!-- 由于u-checkbox组件不支持slot右侧内容，故用单选框代替 -->
			<u-radio-group v-model="value" @change="groupChange">
				<u-radio shape="square" size="32rpx" iconSize="32rpx" :name="dataInfo.id" @change="radioChange">
					<view class="right"  @click="goToNext">
						<view class="top">
							<text class="name">{{ dataInfo.name || '--' }}</text>
							<view class="icon">
								<!-- 				<next-bubble-menu :d-width="200" :dataList="actions" bingEleId="test1">
									<u-icon id="test1" name="photo-fill" color="#3a62d7" size="20px" @tap.stop="takePhoto($event)" />
								</next-bubble-menu> -->
								<u-icon name="scan" class="mr10" color="#3a62d7" size="36rpx"
									@click.native.stop="scanQrCode($event)" />
								<u-icon name="photo-fill" color="#3a62d7" size="36rpx"
									@click.native.stop="takePhoto($event)" />
							</view>
						</view>
						<view class="bottom">生产号：{{ dataInfo.productNo || '--' }}</view>
						<view class="bottom">流水码：{{ dataInfo.srialCode || '--' }}</view>
					</view>
				</u-radio>
			</u-radio-group>
		</view>
	</view>
</template>
<script>
	const actions = [{
			text: '拆解照片',
			id: 1
		},
		{
			text: '厂内生产照片',
			id: 2
		}
	]
	export default {
		props: {
			dataInfo: {
				type: Object,
				default: () => {}
			},
			checked: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				actions: Object.freeze(actions),
				showPopover: false,
				value: '',
				num: 0
			}
		},
		methods: {
			takePhoto() {
				// 	this.showPopover = true;
				this.$emit('takePhoto', this.dataInfo, 1);
			},
			onSelect(action) {
				this.$emit('takePhoto', this.dataInfo, action.id);
			},
			// 进入下一层级
			goToNext() {
				this.$emit('goToNext', this.dataInfo);
			},
			// 单选框
			radioChange(value) {
				this.value = value;
				this.num = 0;
			},
			// 单选框组
			groupChange(value) {
				if (!this.num) {
					this.num++;
					this.$emit('selectChange', value, 'select');
				} else {
					this.value = '';
					this.num = 0;
					this.$emit('selectChange', value, 'deselect');
				}
			},
			// 扫码
			scanQrCode() {

			},
		}
	}
</script>
<style lang="scss" scoped>
	.bom-item {
		height: 160rpx;
		width: calc(100% - 48rpx);
		margin: 20rpx;
		margin-bottom: 0;
		border-bottom: 2rpx solid #7175752c;
		box-sizing: border-box;

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.right {
				margin-left: 20rpx;
				flex: 1;

				.top {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					height: 60rpx;

					.name {
						font-size: 32rpx;
						font-weight: 400;
					}

					.icon {
						display: flex;
						margin-left: auto;
					}
				}

				.bottom {
					height: 40rpx;
					line-height: 40rpx;
					font-size: 24rpx;
					color: #657685;
				}
			}

			/deep/ .u-radio-group {
				width: 100%;

				.u-radio {
					width: 100%;
				}
			}
		}


	}

	.bom-item:last-child {
		border-bottom: none;
	}

	.mr10 {
		margin-right: 10rpx;
	}
</style>