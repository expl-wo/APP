<template>
	<view class="tool-item">
		<view class="top">
			<view class="name">{{ dataInfo.toolName || '--' }}</view>
			<view class="icon">
				<u-icon name="edit-pen" color="#3a62d7" size="36rpx" @click="editNum"></u-icon>
			</view>
		</view>
		<view>
			<view class="other-item w80 ellipsis">工序组织：{{ dataInfo.procedureLevel || '--' }}</view>
			<view class="other-item w20 ellipsis">数量：{{ dataInfo.toolNum || '--' }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataInfo: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
				
			};
		},
		methods: {
			// 编辑数量
			editNum() {
				this.$emit('editNum', 'tool', this.dataInfo);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tool-item {
		width: 100%;
		padding: 16rpx 20rpx;
		border-bottom: 2rpx solid #7175752c;
		.top {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			height: 40px;
			.name {
				flex: 1;
				font-size: 16px;
			}
			.icon {
				margin-left: auto;
			}
		}
		.other-item {
			display: inline-block;
			height: 20px;
			line-height: 20px;
			font-size: 14px;
			color: #657685;
		}
	}
	.ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.w20 {
		width: 20%;
	}

	.w80 {
		width: 80%;
	}
</style>
