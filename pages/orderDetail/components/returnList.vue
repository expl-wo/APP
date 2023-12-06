<template>
	<view class="full-wrapper">
		<scroll-view :scroll-top="scrollTop" :show-scrollbar="true" :scroll-y="true" class="list-wrapper"
			:refresher-enabled="true" :refresher-threshold="80" :upper-threshold="50" :lower-threshold="30"
			:refresher-triggered="refreshing" @refresherrefresh="getData('scrolltoupper')"
			@scrolltolower="getData('scrolltolower')">
			<return-item v-for="item in listData" :key="item.id" :dataInfo="item" @check="check" />
			<u-loadmore v-if="showLoading" :status="status" :nomoreText="nomoreText" />
		</scroll-view>
	</view>
</template>
<script>
	import ReturnItem from './returnItem.vue';
	import {
		getReturnList
	} from '@/https/overhaul/bom';
	export default {
		name: 'ReturnList',
		components: {
			ReturnItem
		},
		data() {
			return {
				scrollTop: 0,
				refreshing: false,
				listData: [],
				fakeData: [{
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
					},
					{
						id: 5,
						name: '物流分类名称4',
						status: 1,
						productNo: '生产号4',
						parentSrialCode: '父节点流水码4',
						srialCode: '流水码4',
						parentCategory: '父节点分类名4'
					},
					{
						id: 6,
						name: '物流分类名称4',
						status: 1,
						productNo: '生产号4',
						parentSrialCode: '父节点流水码4',
						srialCode: '流水码4',
						parentCategory: '父节点分类名4'
					}
				],
				pageNum: 1,
				pageSize: 20,
				status: 'nomore',
				showLoading: true,
				hasNextPage: false
			}
		},
		computed: {
			nomoreText() {
				return this.listData.length ? '没有更多了' : '暂无数据';
			}
		},
		mounted() {
			this.getData();
		},
		methods: {
			// 获取数据
			getData(type) {
				debugger;
				if (type === 'scrolltoupper') {
					this.refreshing = true;
					this.pageNum = 1;
					this.listData = [];
					this.showLoading = false;
				} else if (type === 'scrolltolower') {
					if (!this.hasNextPage) return;
					this.pageNum++;
				}
				let {
					pageNum,
					pageSize
				} = this;
				let params = {
					pageNum,
					pageSize
				};
				if (type !== 'scrolltoupper') {
					this.status = 'loading';
					this.showLoading = true;
				}
				setTimeout(() => {
					this.listData = [...this.listData, ...this.fakeData];
					this.hasNextPage = true;
					this.refreshing = false;
					this.status = 'loadmore';


				}, 2000)
			},
			// 复核
			check() {
				//
			},
		}
	}
</script>
<style lang="scss" scoped>
	.full-wrapper {
		width: calc(100% - 40rpx);
		height: 100%;
		overflow-y: auto;
		margin: 0 20rpx;
		background-color: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;

		.list-wrapper {
			width: 100%;
			height: 100%;
		}

		/deep/ .u-loadmore__content__text {
			line-height: 16px !important;
		}

		/deep/ .u-loading-icon__spinner--spinner {
			width: 15px !important;
			height: 15px !important;
		}
	}
</style>