<template>
	<view class="return-item">
		<view class="item-top">
			<text>{{ dataInfo.name || '--' }}</text>
			<text class="status fs-12"
				:class="[dataInfo.status ? '' : 'uncheck']">{{ dataInfo.status ? '已复核' : '待审核' }}</text>
			<text class="icon">
				<u-icon name="server-man" color="#3a62d7" size="40rpx" @tap="isShowProveModal = true" />
			</text>
		</view>
		<view class="item-bottom">
			<view class="text-box">
				<text class="text">生产号：{{ dataInfo.productNo || '--' }}</text>
				<text class="text">父节点流水码：{{ dataInfo.parentSrialCode || '--' }}</text>
			</view>
			<view class="text-box">
				<text class="text">流水码：{{ dataInfo.srialCode || '--' }}</text>
				<text class="text">父节点分类名：{{ dataInfo.parentCategory || '--' }}</text>
			</view>
		</view>
		<u-modal :show="isShowProveModal" title="复核确认" content='确认复核吗？' :closeOnClickOverlay="true"
			@confirm='handleProveConfirm' @close='isShowProveModal = false'></u-modal>
	</view>
</template>
<script>
	export default {
		props: {
			dataInfo: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				isLoading: false,
				isShowProveModal: false
			}
		},
		methods: {
			onRefresh() {
				debugger;
			},
			handleProveConfirm() {
				console.log(this.dataInfo, 'handleProveConfirm')
			},
			cancel() {
				debugger;
			},
			beforeClose(action, done) {
				if (action === 'cancel') {
					done()
				} else {
					// done();
					this.$emit('check', this.dataInfo);
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/staging/index.scss';

	.return-item {
		height: 200rpx;
		padding: 16rpx 20rpx;
		border-bottom: 2rpx solid #7175752c;

		.item-top {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			height: 80rpx;
			font-size: $titleFontSize;

			.status {
				margin-left: 16rpx;
				font-size: $fontSize;
			}

			.icon {
				margin-left: auto;
			}
		}

		.item-bottom {
			height: 40rpx;
			line-height: 40rpx;
			font-size: 24rpx;
			color: #657685;

			.text-box {
				width: 90%;
				display: flex;
				justify-content: space-between;

				.text {}
			}
		}
	}

	.uncheck {
		background-color: #fbefe9;
		color: #ff6b00;
	}

	.fs-12 {
		font-size: 24px;
	}
</style>