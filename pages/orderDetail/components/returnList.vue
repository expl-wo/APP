<template>
	<view class="full-wrapper">
		<scroll-view :scroll-top="scrollTop" :show-scrollbar="true" :scroll-y="true" class="list-wrapper"
			:refresher-enabled="true" :refresher-threshold="80" :upper-threshold="50" :lower-threshold="30"
			:refresher-triggered="refreshing" @refresherrefresh="getData('scrolltoupper')"
			@scrolltolower="getData('scrolltolower')">
			<return-item v-for="item in listData" :key="item.id" :dataInfo="item" @checkBom="checkBom" />
			<u-loadmore v-if="showLoading" :status="status" :nomoreText="nomoreText" />
		</scroll-view>
	</view>
</template>
<script>
	import ReturnItem from './returnItem.vue';
	import {
		getReturnList,
		checkBom
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
				pageNum: 1,
				pageSize: 20,
				status: 'nomore',
				showLoading: true,
				hasNextPage: false,
				bomInfo: null
			}
		},
		computed: {
			nomoreText() {
				return this.listData.length ? '没有更多了' : '暂无数据';
			}
		},
		mounted() {
			this.pageNum = 1;
			this.listData = [];
			this.getData();
		},
		methods: {
			// 获取数据
			getData(type) {
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
				let { id } = uni.getStorageSync('ims_workOrder');
				let params = {
					pageNum,
					pageSize,
					workCode: id
				};
				if (type !== 'scrolltoupper') {
					this.status = 'loading';
					this.showLoading = true;
				}
				getReturnList(params)
				.then(res => {
					if (res.success && res.data) {
							let {
								pageList,
								hasNextPage
							} = res.data;
							let revData = pageList || [];
						this.listData = [...this.listData, ...revData];
						this.hasNextPage = hasNextPage;
					} else {
						uni.showToast({
							icon: 'error',
							title: res.errMsg || '数据获取失败',
							duration: 2000
						})
					}
				})
				.finally(() => {
					this.refreshing = false;
					this.showLoading = true;
					this.status = this.hasNextPage ? 'loadmore' : 'nomore';
				})
			},
			// 复核
			checkBom(info) {
				this.bomInfo = info;
				uni.scanCode({
					onlyFromCamera: true,
					success: resScanCode => {
						this.handleScanResult(resScanCode.result)
					},
					fail: err => {
						uni.showToast({
							icon: 'error',
							title: '扫码失败',
							duration: 2000
						})
					}
				})
			},
			// 复核
			handleScanResult(result) {
				let params = {
					serialCode: result,
					examineStatus: 1
				}
				checkBom(params)
				.then(res => {
					if (res.success) {
						this.pageNum = 1;
						this.listData = [];
						this.getData();
					} else {
						uni.showToast({
							icon: 'error',
							title: res.errMsg || '操作失败',
							duration: 2000
						})
					}
				})
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