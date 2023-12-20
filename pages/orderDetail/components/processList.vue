<!-- 标准工序列表 -->
<template>
	<view class="full-wrapper">
		<!-- 卡片列表 -->
		<view class="workOrder-list" v-if="orderInfo.type === 'workOrder'">
			<scroll-view v-if="cardList.length" class="card-list" :show-scrollbar="true" scroll-y="true"
				ref="scrollView" :refresher-enabled='true' :refresher-threshold='80' :upper-threshold='50'
				:lower-threshold='30' :refresher-triggered='refreshing' @refresherrefresh="getListData('scrolltoupper')"
				@scrolltolower="getListData('scrolltolower')">
				<view class="card-item" v-for="(item, index) in cardList" :key="index" @click="handleShowDetail(item)">
					<Card title="title" :cardInfo="item" :fieldMapText="fieldMapText">
						<view class="progress">
							<Progress :percentage="item.progress + '%'" />
						</view>
					</Card>
				</view>
				<u-loadmore :status="status" v-if="cardList.length" />
			</scroll-view>
			<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" v-else></u-empty>
		</view>
		<view class="card-list" v-if="orderInfo.retFactory === 0">
			<view class="card-item bg" v-for="(item, index) in cardList" :key="index">
				<Card title="title" :cardInfo="item" @click.native="handleShowDetail(item)" />
				<view class="btn-box">
					<u-button text="视频绑定" class="btn" :disabled="true" @click="handleBindVideo"></u-button>
					<u-button text="复核人员" class="btn" :disabled="true"></u-button>
					<u-button text="派工" class="btn" :disabled="true"></u-button>
					<u-button text="设备" class="btn" :disabled="true"></u-button>
				</view>
			</view>
		</view>
		<view class="card-list" v-if="orderInfo.retFactory === 1">
			<view class="card-item bg" v-for="(item, index) in cardList" :key="index">
				<Card title="title" :cardInfo="item" @click.native="handleShowDetail(item)" />
				<view class="btn-box">
					<u-button text="视频绑定" class="btn" :disabled="true" @click="handleBindVideo"></u-button>
					<u-button text="复核人员" class="btn" :disabled="true"></u-button>
					<u-button text="派工" class="btn" :disabled="true"></u-button>
					<u-button text="设备" class="btn" :disabled="true"></u-button>
				</view>
			</view>
		</view>
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
					reviewStatusStr: {
						label: "复核状态",
						iconName: "server-man"
					}
				},
				// 数据列表
				cardList: [],
				// 刷新
				refreshing: false,
				// 页面参数
				pageNum: 1,
				// 列表刷新状态
				status: "nomore"
			};
		},
		created() {
			if (this.orderInfo.type === 'workOrder') {
				this.getListData()
			} else if (this.orderInfo.type === 'overhaul') {
				let list = []
				if (this.orderInfo.retFactory === 0) {
					list = [{
						title: '现场检修',
						code: "OVER_HAUL_ON_THE_SPOT_SCENE"
					}]
				} else if (this.orderInfo.retFactory === 1) {
					list = [{
						title: '返厂检修-现场拆解',
						code: "OVER_HAUL_BACK_CHAI_JIE_SCENE"
					}, {
						title: '返厂检修-场内拆解',
						code: "OVER_HAUL_BACK_INNER_CHAI_JIE_SCENE"
					}, {
						title: '返厂检修-厂内生产',
						code: "OVER_HAUL_BACK_INNER_PRODUCTION_SCENE"
					}, {
						title: '返厂检修-试验',
						code: "OVER_HAUL_BACK_EXPERIMENT_SCENE"
					}]
				}
				this.cardList = list;
			}
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
					if (res.success && res.data && res.data.pageList) {
						const listData = res.data.pageList.map(item => ({
							...item,
							title: item.workProcedureName,
							reviewStatusStr: item.reviewStatus === 0 ? "未复核" : "已复核",
						}))
						const total = res.data.total || 0;
						if (this.cardList.length < total) {
							this.cardList.push(...listData);
							this.status = 'loadmore';
						} else {
							this.status = 'nomore';
						}
					} else {
						uni.$u.toast(res.errMsg || '暂无数据');
					}
				}).finally(() => {
					this.refreshing = false;
				})
			},
			handleShowDetail(card) {
				uni.setStorageSync('ims_standardProcess', card);
				if (this.orderInfo.type === 'workOrder') {
					uni.navigateTo({
						url: '/pages/orderDetail/processDetail/index',
					})
				} else if (this.orderInfo.type === 'overhaul') {
					uni.navigateTo({
						url: `/pages/orderDetail/overhaulProcess/index?workOrderSceneType=${card.code}`,
					})
				}
			},
			handleBindVideo() {},
		},
	};
</script>
<style lang="scss" scoped>
	.full-wrapper {
		height: 100%;
		overflow-y: auto;
		font-size: 12rpx;
		color: #657685;

		.workOrder-list {
			height: 100%;
			overflow-y: auto;
		}

		.card-list {
			height: 100%;

			.bg {
				background: #fff;

				.btn-box {
					padding-bottom: 10rpx;
				}
			}

			.card-item {
				position: relative;
				margin: 0 16rpx 16rpx;
				cursor: pointer;

				.progress {
					margin-top: 10rpx;
				}

				.name {
					font-size: 20px;
				}

				.btn-box {
					display: flex;

					.btn {
						margin: 0 5px;
					}
				}
			}
		}
	}

	/deep/ .uni-scroll-view-refresher {
		background: url("@/assets/imgs/staging/staging-bg.png") no-repeat center;
		background-size: 100% 100%;
	}
</style>