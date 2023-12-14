<!-- 标准工序列表 -->
<template>
	<view class="full-wrapper">
		<!-- 卡片列表 -->
		<scroll-view v-if="cardList.length" class="card-list" :show-scrollbar="true" scroll-y="true"
			:refresher-enabled='true' :refresher-threshold='80' :upper-threshold='50' :lower-threshold='30'
			:refresher-triggered='refreshing' @refresherrefresh="getListData('scrolltoupper')"
			@scrolltolower="getListData('scrolltolower')">
			<view class="card-item" v-for="(item, index) in cardList" :key="index" @click="handleShowDetail(item)">
				<Card title="title" :cardInfo="item" :fieldMapText="fieldMapText" />
			</view>
			<u-loadmore :status="status" v-if="cardList.length" />
		</scroll-view>
		<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" v-else></u-empty>
	</view>
</template>
<script>
	import Card from "@/components/common/card.vue";
	import Progress from "@/components/common/progress.vue";
	import {
		getProcessList
	} from "@/https/staging/index.js";
	export default {
		name: "ProcessList",
		components: {
			Card,
			Progress,
		},
		props: {
			orderInfo: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				fieldMapText: {
					workProcedureName: {
						label: "标题",
						iconName: "account-fill"
					},
					leaderName: {
						label: "组长",
						iconName: "account-fill"
					},
					deputyLeaderName: {
						label: "副组长",
						iconName: "account-fill"
					},
					memberName: {
						label: "成员",
						iconName: "account-fill"
					},
				},
				// 数据列表
				cardList: [],
				// 刷新
				refreshing: false,
				// 页面参数
				pageNum: 1,
				// 列表刷新状态
				status: "nomore",
			};
		},
		mounted() {
			this.getListData()
		},
		methods: {
			/**
			 * @method getListData 获取列表数据
			 **/
			getListData(type) {
				// 判断是上拉还是上滑事件
				if (type === 'scrolltoupper') {
					this.refreshing = true;
				} else if (type === 'scrolltolower') {
					this.pageNum++;
				}
				const param = {
					pageSize: 10,
					pageNum: this.pageNum,
					workCode: this.orderInfo.id,
					workProcedureType: 0, // 0-根节点, 1-标准工序,2-中工序,3-工步,4-内容工序,
				};
				getProcessList(param).then(res => {
					if (res.data && res.data.pageList) {
						const listData = res.data.pageList.map(item => ({
							title: item.workProcedureName,
							...item
						}))
						const total = res.data.total || 0;
						if (this.cardList.length < total) {
							this.cardList.push(...listData);
							this.status = 'loadmore';
						} else {
							this.status = 'nomore';
						}
					}
				}).catch((error) => {
					uni.$u.toast(error.errMsg)
				}).finally(() => {
					this.refreshing = false
				})
			},
			handleShowDetail(card) {
				uni.setStorageSync('ims_standardProcess', card);
				uni.navigateTo({
					url: '/pages/orderDetail/processDetail/index',
				})
			},
		},
	};
</script>
<style lang="scss" scoped>
	.full-wrapper {
		height: 100%;
		overflow-y: auto;
		font-size: 12rpx;
		color: #657685;

		.card-list {
			height: 100%;

			.card-item {
				position: relative;
				margin: 0 16rpx 16rpx;
				cursor: pointer;

				.progress {
					margin-top: 10rpx;
				}
			}
		}
	}

	/deep/ .uni-scroll-view-refresher {
		background: url("@/assets/imgs/staging/staging-bg.png") no-repeat center;
		background-size: 100% 100%;
	}
</style>