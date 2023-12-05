<template>
	<view class="full-wrapper">
		<!-- 卡片列表 -->
		<u-list v-model="loading" finished-text="没有更多了" class="card-list" offset="40" :finished="finished"
			@load="getListData">
			<view class="card-item" v-for="(card, index) in cardList" :key="index" @tap="handleShowDetail(card)">
				<Card :fieldMapText="fieldMapText" :cardInfo="card" :showBottomRadius='false'>
					<view class="progress">
						<Progress :progress='card.progress' />
					</view>
				</Card>
			</view>
		</u-list>
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
						iconName: "chat"
					},
					leaderName: {
						label: "组长",
						iconName: "chat"
					},
					deputyLeaderName: {
						label: "副组长",
						iconName: "chat"
					},
					memberName: {
						label: "成员",
						iconName: "chat"
					},
				},
				// 数据列表
				cardList: [],
				// 列表加载状态
				loading: false,
				// 加载完成
				finished: false,
				// 刷新
				refreshing: false,
				// 页面参数
				page: {
					pageSize: 20,
					pageNum: 1
				}
			};
		},
		mounted() {
			this.getListData()
		},
		methods: {
			/**
			 * @method getListData 获取列表数据
			 **/
			getListData() {
				const param = {
					...this.page,
					// workCode: this.orderInfo.id ,
					workCode: 1001,
					workProcedureType: 0, // 0-根节点, 1-标准工序,2-中工序,3-工步,4-内容工序,
				};
				getProcessList(param).then(res => {
					if (res.data && res.data.pageList) {
						this.cardList = res.data.pageList.map(item => ({
							title: item.workProcedureName,
							...item
						}))
					}
				})
			},
			handleShowDetail(card) {
				console.log(card, "card");
				const url =
					`/pages/orderDetail/processDetail/index?workProcedureType=${card.id}`
				uni.navigateTo({
					url,
				})
			},
		},
	};
</script>
<style lang="scss" scoped>
	.full-wrapper {
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
</style>