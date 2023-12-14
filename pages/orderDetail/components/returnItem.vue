<template>
	<view class="return-item">
		<view class="item-top">
			<text>{{ dataInfo.materialTypeName || '--' }}</text>
			<text class="status fs-12"
				:class="[+dataInfo.examineStatus ? 'check' : 'uncheck']">{{ +dataInfo.examineStatus ? '已复核' : '待复核' }}</text>
<!-- 			<u-icon v-if="!(+dataInfo.examineStatus)" class="icon" name="scan" color="#3a62d7" size="40rpx" @click="checkBom" /> -->
		</view>
		<view class="item-bottom">
			<view class="text-box">
				<view class="text">生产号：{{ dataInfo.prodNumber || '--' }}</view>
				<view class="text">父节点流水码：{{ dataInfo.parentSerialCode || '--' }}</view>
			</view>
			<view class="text-box">
				<view class="text">流水码：{{ dataInfo.serialCode || '--' }}</view>
				<view class="text">父节点分类名：{{ dataInfo.parentMaterialTypeName || '--' }}</view>
			</view>
			<view class="text">全路径: {{ (dataInfo.bomLevelName.split(',') || []).reverse().join('->') || '--' }}</view>
		</view>
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
			}
		},
		methods: {
			// 复核BOM
			checkBom() {
				this.$emit('checkBom', this.dataInfo);
			},
		}
	}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/staging/index.scss';

	.return-item {
		// height: 200rpx;
		padding: 16rpx 20rpx;
		border-bottom: 2rpx solid #7175752c;

		.item-top {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			height: 40px;
			font-size: 20px;

			.status {
				margin-left: 16rpx;
				font-size: 14px;
			}

			.icon {
				margin-left: auto;
			}
		}

		.item-bottom {
			// height: 60rpx;
			line-height: 30px;
			font-size: 16px;
			color: #657685;

			.text-box {
				display: flex;
				justify-content: space-between;

				.text {
					display: inline-block;
					width: 50%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
	.status {
		padding: 2px 8px;
		border-radius: 2px;
	}
	.uncheck {
		background-color: #fbefe9;
		color: #ff6b00;
	}
	.check {
		background-color: #d2fbd1;
		color: #007e04;
	}

	.fs-12 {
		font-size: 24px;
	}
</style>