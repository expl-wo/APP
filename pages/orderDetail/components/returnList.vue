<template>
	<view class="full-wrapper">
		<van-pull-refresh v-model="isLoading" class="pull-wrapper" @refresh="onRefresh">
			<return-item v-for="item in dataList" :key="item.id" :dataInfo="item" @check="check" />
		</van-pull-refresh>
	</view>
</template>
<script>
	import ReturnItem from './returnItem.vue';

	export default {
		name: 'ReturnList',
		components: {
			ReturnItem
		},
		data() {
			return {
				dataList: [{
						id: 1,
						name: '物流分类名称1',
						status: 0,
						productNo: '生产号1',
						parentSrialCode: '父节点流水码1',
						srialCode: '流水码1',
						parentCategory: '父节点分类名1'
					},
					{
						id: 2,
						name: '物流分类名称2',
						status: 0,
						productNo: '生产号2',
						parentSrialCode: '父节点流水码2',
						srialCode: '流水码2',
						parentCategory: '父节点分类名2'
					},
					{
						id: 3,
						name: '物流分类名称3',
						status: 1,
						productNo: '生产号3',
						parentSrialCode: '父节点流水码3',
						srialCode: '流水码3',
						parentCategory: '父节点分类名3'
					},
					{
						id: 4,
						name: '物流分类名称4',
						status: 1,
						productNo: '生产号4',
						parentSrialCode: '父节点流水码4',
						srialCode: '流水码4',
						parentCategory: '父节点分类名4'
					}
				],
				isLoading: false,

			}
		},
		methods: {
			// 复核
			check() {
				//
			},
			// 下拉刷新
			onRefresh() {

			}
		}
	}
</script>
<style lang="scss" scoped>
	.full-wrapper {
		width: 100%;
		height: 100%;
		border: 2rpx solid #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.1);
		overflow: auto;
	}
</style>