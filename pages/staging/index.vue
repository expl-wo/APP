<template>
	<view class="staging-root">
		<!-- 头部tab -->
		<view class="head-tab">
			<view></view>
			<view v-for="(tab, index) in tabList" :class="['tab-item', activeIndex === index ? 'active' : undefined]"
				:key="tab.label" @click="handleTabChange(tab, index)">
				<span>{{ tab.label }}</span>
			</view>
			<view class="search-box">
				<u-icon name="search" size="30" style="margin: 0 10rpx" @click="handleShowSearch"></u-icon>
				<u-icon v-if="showType !== 'issue'" name="map-fill" size="30" style="margin: 0 10rpx"
					@click="handleShowFilter">
				</u-icon>
			</view>
		</view>
		<!-- 卡片列表 -->
		<u-list @scrolltolower="getListData" class="card-list" :owerThreshold='50' :upperThreshold='50'>
			<u-list-item v-for="(item, index) in cardList" :key="index" class="card-item"
				@click.native="handleShowDetail(item)">
				<Card title="title" :cardInfo="item" :fieldMapText="fieldMapText" />
			</u-list-item>
		</u-list>
		<!-- 动作面板 -->
		<u-action-sheet :show="showFilterPanel" :actions="filterList" cancelText="取消" :closeOnClickAction="true"
			:closeOnClickOverlay="true" title="状态筛选" :round="16" class="action-sheet" @select="handleConfirmFilter"
			@close='showFilterPanel = false' />
		<!--搜索面板  -->
		<u-popup :show="showSearchPanel" mode="top" :round="10" :closeOnClickOverlay="true"
			@close="showSearchPanel = false">
			<view class="search-pop">
				<u-search v-model="searchKey" inputAlign="center" height="70" shape="round" :clearabled="true"
					placeholder="请输入搜索关键词" actionText='搜索' :showAction="true" @search="getListData"
					@clear="handleClearSearchKey">
				</u-search>
			</view>
		</u-popup>
	</view>
</template>

<script>
	/* 工作台页面 */
	import Card from "@/components/common/card";
	import {
		getWorkOrderPageData,
		getOverhaulPageData,
		getIssuePageList
	} from "@/https/staging/index.js";
	export default {
		name: "Staging",
		components: {
			Card,
		},
		data() {
			return {
				// 列表数据
				cardList: [],
				// 勘查工单tab列表
				workOrderTabs: [{
						label: "勘查工单",
						value: 1,
						code: "workOrder",
					},
					{
						label: "检修工单",
						value: 2,
						code: "overhaul",
					},
				],
				issueTabs: [{
					label: "问题",
					value: 1,
				}, ],
				// 工单字段对应文本映射
				workOrderFieldMapText: {
					productNumber: {
						label: "生产号",
						iconName: "photo"
					},
					PM: {
						label: "项目经理",
						iconName: "photo"
					},
					startTime: {
						label: "计划开始时间",
						iconName: "photo"
					},
					endTime: {
						label: "计划结束时间",
						iconName: "photo"
					},
				},
				// 检修工单字段对应文本映射
				overhaulFiledMapText: {
					productNumber: {
						label: "生产号",
						iconName: "photo"
					},
					PM: {
						label: "项目经理",
						iconName: "photo"
					},
					startTime: {
						label: "计划开始时间",
						iconName: "photo"
					},
					endTime: {
						label: "计划结束时间",
						iconName: "photo"
					},
				},
				// 问题字段对应文本映射
				issueFiledMapText: {
					issue: {
						label: "异常项",
						iconName: "photo"
					},
					issueType: {
						label: "问题分类",
						iconName: "photo"
					},
					notifyPerson: {
						label: "通知人",
						iconName: "photo"
					},
					handlePerson: {
						label: "问题处理人",
						iconName: "photo"
					},
					createTime: {
						label: "问题提交时间",
						iconName: "photo"
					},
					memo: {
						label: "问题描述",
						iconName: "photo"
					},
				},
				// 当前选中项下标
				activeIndex: 0,
				// 展示筛选面板
				showFilterPanel: false,
				// 展示搜索面板
				showSearchPanel: false,
				// 搜索关键词
				searchKey: "",
				// 筛选面板选项
				filterList: [{
					name: "待办",
					value: '1'
				}, {
					name: "已办",
					value: '2'
				}, {
					name: "未办",
					value: '3'
				}],
				// 颜色值与状态映射
				statusMapColor: [],
				// 展示返回按钮
				showBack: false,
				// 展示页面类型 workOrder-勘查工单 overhaul-检修页面、issue-问题页面
				showType: "workOrder",
				// 列表加载状态
				loading: false,
				// 加载完成
				finished: false,
				// 刷新
				refreshing: false,
			};
		},
		computed: {
			fieldMapText() {
				return this.showType === "issue" ?
					this.issueFiledMapText :
					this.workOrderFieldMapText;
			},
			tabList() {
				return this.showType === "issue" ? this.issueTabs : this.workOrderTabs;
			},
		},
		onLoad(params) {
			console.log(params, '11111111111111111111')
			this.getListData();
			// 路由激活时，重新获取数据
			this.showType = params.type || 'workOrder'
			params.id && this.handleRouterChange(params.id);
		},
		methods: {
			/**
			 * @method getListData 获取列表数据
			 **/
			async getListData() {
				const param = {
					type: this.showType,
					orderStatusList: [],
					pageNum: 1,
					pageSize: 20,
					prodNumber: "",
					projName: "",
					workOrderType: 1
				};
				let data = {};
				debugger
				if (this.showType === "workOrder") {
					data = await getWorkOrderPageData(param);
				} else if (this.showType === "overhaul") {
					data = await getOverhaulPageData(param);
				} else if (this.showType === "issue") {
					data = await getIssuePageList(param);
				}
				if (data) {
					if (this.refreshing) {
						this.cardList = [];
						this.refreshing = false;
					}
					cardList = data.results || [];
					this.loading = false;
					if (this.cardList.length >= data.totalRow) {
						this.finished = true;
					}
				}
				// setTimeout(() => {
				// 	if (this.refreshing) {
				// 		this.cardList = [];
				// 		this.refreshing = false;
				// 	}
				// 	if (this.showType === "workOrder") {
				// 		for (let i = 0; i < 4; i++) {
				// 			this.cardList.push({
				// 				status: "待审核",
				// 				title: "子工序行/年检有效期",
				// 				productNumber: "123456",
				// 				PM: "测试人员",
				// 				startTime: "2023",
				// 				endTime: "2023",
				// 				id: +new Date(),
				// 			});
				// 		}
				// 	} else if (this.showType === "overhaul") {
				// 		for (let i = 0; i < 4; i++) {
				// 			this.cardList.push({
				// 				status: "待审核",
				// 				title: "子工序行/年检有效期",
				// 				productNumber: "检修工单",
				// 				PM: "检修工单",
				// 				startTime: "2023",
				// 				endTime: "2023",
				// 				id: +new Date(),
				// 			});
				// 		}
				// 	} else if (this.showType === "issue") {
				// 		for (let i = 0; i < 4; i++) {
				// 			this.cardList.push({
				// 				title: "子工序行/年检有效期",
				// 				issue: "xxxxx异常提示",
				// 				issueType: "xxx",
				// 				notifyPerson: "极乐鸟",
				// 				handlePerson: "董子鸥",
				// 				createTime: "2023",
				// 				memo: "这里是描述这里是描述这里是描这里是描述这里是描述这里是描",
				// 				id: 1,
				// 			});
				// 		}
				// 	}
				// 	this.loading = false;
				// 	if (this.cardList.length >= 10) {
				// 		this.finished = true;
				// 	}
				// }, 1000);
			},
			/**
			 * @method handleRouterChange 处理路由改变-问题页面
			 **/
			handleRouterChange(issueId) {
				console.log(issueId, 'handleRouterChange')
				if (this.type === "issue") {
					this.showBack = true;
					this.showType = "issue";
					this.cardList = [];
					this.getListData();
				}
			},
			/**
			 * @method handleTabChange 处理tab改变
			 **/
			handleTabChange(tab, index) {
				if (this.activeIndex === index) return;
				this.activeIndex = index;
				this.showType = tab.code; // 展示数据变化
				console.log(this.showType, "showType");
				// 列表数据先置空
				this.cardList = [];
				// 切换列表数据
				this.onRefresh();
			},
			/**
			 * @method handleShowDetail 点击卡片展示详情
			 **/
			handleShowDetail(card) {
				// 问题暂无详情
				if (this.showType === "issue") return;
				console.log(card, "card", this.showType);
				uni.navigateTo({
					url: '/pages/orderDetail/index',
					params: {
						id: card.id,
						type: this.showType, // 传不同类型，显示不同类型的详情
					},
				});
			},
			/**
			 * @method handleShowFilter 点击显示筛选面板
			 **/
			handleShowFilter() {
				this.showFilterPanel = true;
			},
			/**
			 * @method handleShowSearch 点击显示搜索面板
			 **/
			handleShowSearch() {
				this.showSearchPanel = true;
			},
			/**
			 * @method handleClearSearchKey 点击清楚搜索框
			 **/
			handleClearSearchKey() {
				this.searchKey = "";
				// 刷新数据
				this.getListData();
			},
			/**
			 * @method handleConfirmFilter 筛选面板选择时
			 **/
			handleConfirmFilter(action) {
				console.log(action, "handleConfirmFilter");
				this.selectStatu = action.value
			},
			/**
			 * @method handleBack 处理导航返回
			 **/
			handleBack() {
				window.history.go(-1);
			},
			onRefresh() {
				this.finished = false;
				// 重新加载数据
				// 将 loading 设置为 true，表示处于加载状态
				this.loading = true;
				this.getListData();
			},
		},
	};
</script>

<style scoped lang="scss">
	@import '@/assets/css/staging/index.scss';

	.staging-root {
		width: 100%;
		// height: calc(100% - 83rpx);
		background: url("@/assets/imgs/staging/staging-bg.png") no-repeat center;
		background-size: 100% 100%;
		font-size: $fontSize;

		.head-tab {
			padding: 16rpx 16rpx 0rpx;
			margin-bottom: 16rpx;
			display: flex;
			justify-content: space-between;
			text-align: center;

			.search-box {
				display: flex;
			}

			.tab-item {
				display: inline-block;
				margin: 0 10rpx;
				color: #445160;
				cursor: pointer;
			}

			.active {
				font-size: $bigFontSize;
				color: #333;
			}
		}

		.card-list {
			height: calc(100% - 80rpx);
			overflow-y: auto;

			.card-item {
				margin: 0 20rpx 12rpx;

				&:not(:last-child) {
					margin-bottom: 12rpx;
				}
			}
		}

		.search-action-sheet {
			position: absolute;
			left: 0;
			top: 0;
			height: 120rpx;
			cursor: pointer;
		}

		.search-pop {
			height: 120rpx;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
		}


	}
</style>