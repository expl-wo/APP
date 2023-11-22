<template>
	<view class="full-wrapper">
		<!-- 卡片列表 -->
		<u-list v-model="loading" finished-text="没有更多了" class="card-list" offset="40" :finished="finished"
			@load="getListData">
			<view class="card-item" v-for="(card, index) in cardList" :key="index" @tap="handleShowDetail(card)">
				<Card :fieldMapText="fieldMapText" :cardInfo="card" :showBottomRadius='false'>
					<view class="progress">
						<Progress />
					</view>
				</Card>
			</view>
		</u-list>
	</view>
</template>
<script>
	import Card from "@/components/common/card.vue";
	import Progress from "@/components/common/progress.vue";
	export default {
		name: "ProcessList",
		components: {
			Card,
			Progress,
		},
		data() {
			return {
				fieldMapText: {
					title: {
						label: "标题",
						iconName: "chat"
					},
					groupPerson: {
						label: "组长",
						iconName: "chat"
					},
					subGroupPerson: {
						label: "副组长",
						iconName: "chat"
					},
					member: {
						label: "成员",
						iconName: "chat"
					},
				},
				cardList: [{
						title: "这里是大工序名",
						groupPerson: "李腾辉",
						subGroupPerson: "张辽",
						member: "程普、陆逊、李子健、张俊杰",
					},
					{
						title: "这里是大工序名",
						groupPerson: "李腾辉",
						subGroupPerson: "张辽",
						member: "程普、陆逊、李子健、张俊杰",
					},
					{
						title: "这里是大工序名",
						groupPerson: "李腾辉",
						subGroupPerson: "张辽",
						member: "程普、陆逊、李子健、张俊杰",
					},
					{
						title: "这里是大工序名",
						groupPerson: "李腾辉",
						subGroupPerson: "张辽",
						member: "程普、陆逊、李子健、张俊杰",
					},
				],
				// 列表加载状态
				loading: false,
				// 加载完成
				finished: false,
				// 刷新
				refreshing: false,
			};
		},
		methods: {
			/**
			 * @method getListData 获取列表数据
			 **/
			getListData() {
				setTimeout(() => {
					if (this.refreshing) {
						this.cardList = [];
						this.refreshing = false;
					}
					for (let i = 0; i < 4; i++) {
						this.cardList.push({
							id: 1,
							title: "这里是大工序名",
							groupPerson: "李腾辉",
							subGroupPerson: "张辽",
							member: "程普、陆逊、李子健、张俊杰",
						});
					}
					this.loading = false;
					if (this.cardList.length >= 10) {
						this.finished = true;
					}
				}, 1000);
			},
			onRefresh() {
				this.finished = false;
				this.loading = true;
				this.getListData();
			},
			handleShowDetail(card) {
				console.log(card, "card");
				const url = `/pages/orderDetail/processDetail/index?id=${card.id}`
				uni.navigateTo({
					url,
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

		.card-item {
			position: relative;
			margin: 0 32rpx 24rpx;
			cursor: pointer;

			.progress {
				margin-top: 10rpx;
			}
		}
	}
</style>