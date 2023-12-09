<template>
	<view class="bom-item">
		<view class="wrapper">
			<!-- 由于u-checkbox组件不支持slot右侧内容，故用单选框代替 -->
			<u-radio-group v-model="value" @change="groupChange">
				<u-radio shape="square" size="32rpx" iconSize="32rpx" :name="dataInfo.id" @change="radioChange">
					<view class="right" @click="goToNext">
						<view class="top">
							<text class="name">{{ dataInfo.bomName || '--' }}</text>
							<view class="icon">
								<u-icon name="tags" class="mr10" color="#3a62d7" size="36rpx"
									@click.native.stop="scanQrCode('stationCode')" />
								<u-icon name="scan" class="mr10" color="#3a62d7" size="36rpx"
									@click.native.stop="scanQrCode('serialCode')" />
								<u-icon name="photo-fill" color="#3a62d7" size="36rpx"
									@click.native.stop="takePhoto($event)" />
							</view>
						</view>
						<view class="bottom">
							<view class="bottom-item">生产号：{{ productNo || '--' }}</view>
							<view class="bottom-item">流水码：{{ dataInfo.serialCode || '--' }}</view>
						</view>
						<view class="bottom">
							<view class="bottom-item">库位码：{{ dataInfo.stationCode || '--' }}</view>
							<view class="bottom-item">
								待入库状态：{{ dataInfo.bomStatus === null ? '--' : BOM_STATUS[dataInfo.bomStatus] }}</view>
						</view>
					</view>
				</u-radio>
			</u-radio-group>
		</view>
	</view>
</template>
<script>
	import {
		BOM_STATUS
	} from '@/utils/constants-custom';
	export default {
		props: {
			dataInfo: {
				type: Object,
				default: () => {}
			},
			checked: {
				type: Boolean,
				default: false
			},
			productNo: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				BOM_STATUS: Object.freeze(BOM_STATUS),
				showPopover: false,
				value: '',
				num: 0
			}
		},
		methods: {
			takePhoto() {
				this.$emit('showPopover', this.dataInfo);
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
			scanQrCode(type) {
				this.$emit('scanQrCode', this.dataInfo, type);
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
					display: flex;
					width: 100%;
					height: 40rpx;
					line-height: 40rpx;
					font-size: 24rpx;
					color: #657685;

					.bottom-item {
						width: 50%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
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