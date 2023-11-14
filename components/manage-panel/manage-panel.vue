<template>
	<view>
		<view class="title-wrapper">
			<view class="before-block" :style="{ backgroundColor: params.color }"></view>
			<view class="title-label">{{ params.name }}</view>
		</view>
		<view class="title-underLine"></view>
		<view class="content-wrapper">
			<view class="item-wrapper" v-for="(item, index) in params.list" :key="index" @tap="handleClick(item)">
				<view class="item-icon" :class="item.icon"></view>
				<view class="item-label">{{ item.name }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import batchIdMixins from '@/mixins/batch-id-mixins';
import publicHttp from '@/https/_public/_public.js';
export default {
	props: {
		params: Object
	},
	mixins: [batchIdMixins],
	data() {
		return {
			needNewBatchNameMenu: ['油箱贴码','装配贴码','包装封箱','包装质检','售后收货'] //需要在进入页面时，创建批处理ID的菜单ID
		};
	},
	onShow() {},
	methods: {
		async handleClick(item) {
			//初始化业务类型
			let bizType = '';
			let path = item.path;
			let indexOfBizType = path.indexOf('bizType=');
			if (indexOfBizType > 0) {
				bizType = path.substr(indexOfBizType + 'bizType='.length);
				this.$utilFunction.saveBizType(bizType);
			} else {
				uni.showToast({
					icon: 'none',
					title: item.name + '菜单没配置业务类型字段',
					duration: this.$constants.duration
				});
				return;
			}
			if (this.needNewBatchNameMenu.indexOf(String(item.name)) >= 0) {
				await this.initBatchIdAlways();
			}
			uni.navigateTo({
				url: item.path
			});
		}
	}
};
</script>

<style lang="scss">
.title-wrapper {
	padding: 5px;
	display: flex;
	align-items: center;
	justify-content: flex-start;

	.before-block {
		width: 6px;
		height: 19px;
	}

	.title-label {
		margin-left: 8px;
		font-size: 16px;
	}
}

.title-underLine {
	margin-left: 10px;
	margin-right: 10px;
	height: 1px;
	background-color: #ccc;
	// margin-top: 3px;
	height: 1px;
	// margin-bottom: 5px;
}

.content-wrapper {
	padding: 0 5px;
	display: flex;
	flex-wrap: wrap;
	align-content: space-between;

	.item-wrapper {
		width: 79px;
		padding: 8px 2px 2px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;

		&.disabledMenu {
			cursor: default;

			.item-icon {
				filter: grayscale(1);
			}
		}

		.item-icon {
			width: 47px;
			height: 47px;
			background-size: contain;
		}

		.item-label {
			margin-top: 5px;
			font-size: 13px;
		}
	}
}
</style>
