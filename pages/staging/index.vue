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
				<u-icon name="search" size="30" style="margin: 0 10rpx" @click="showSearchPanel = true"></u-icon>
				<u-icon v-if="showType !== 'issue'" name="list-dot" size="30" style="margin: 0 10rpx"
					@click="showFilterPanel= true">
				</u-icon>
			</view>
		</view>
		<!-- 卡片列表 -->
		<view class="card-box">
			<scroll-view v-if="cardList.length" class="card-list" :show-scrollbar="true" scroll-y="true"
				:refresher-enabled='true' :refresher-threshold='80' :upper-threshold='50' :lower-threshold='30'
				:refresher-triggered='refreshing' @refresherrefresh="getListData('scrolltoupper')"
				@scrolltolower="getListData('scrolltolower')" @refresherrestore="onRestore">
				<view class="card-item" v-for="item in cardList" :key="item.id" @click="handleShowDetail(item)">
					<Card title="title" :cardInfo="item" :fieldMapText="fieldMapText" />
				</view>
				<u-loadmore :status="status" v-if="cardList.length > 4" />
			</scroll-view>
			<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" v-else>
			</u-empty>
		</view>
		<!-- 动作面板 -->
		<u-action-sheet :show="showFilterPanel" :actions="filterList" cancelText="取消" :closeOnClickAction="true"
			:closeOnClickOverlay="true" title="状态筛选" :round="16" class="action-sheet" @select="handleConfirmFilter"
			@close='showFilterPanel = false' />
		<!--搜索面板  -->
		<u-popup :show="showSearchPanel" mode="top" :round="10" :closeOnClickOverlay="true"
			@close="showSearchPanel = false">
			<view class="search-pop">
				<u-search v-model="searchKey" inputAlign="center" height="70" shape="round" :clearabled="true"
					placeholder="请输入关键字" actionText='搜索' :showAction="true" @custom="getListData('search')"
					@search="getListData('search')" @clear="handleClearSearchKey">
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
		queryProcedureProblem
	} from "@/https/staging/index.js";
	import {
		CARD_FIELD_MAP,
		ISSUE_FILED_MAP,
		ORDER_STATUS_MAP
	} from '@/utils/constants-custom.js'
	export default {
		name: "Staging",
		components: {
			Card
		},
		data() {
			return {
				// 展示列表数据
				cardList: [],
				// 工单字段对应文本映射
				workOrderFieldMapText: CARD_FIELD_MAP,
				// 检修工单字段对应文本映射
				overhaulFiledMapText: CARD_FIELD_MAP,
				// 问题字段对应文本映射
				issueFiledMapText: ISSUE_FILED_MAP,
				// 当前选中项下标
				activeIndex: 0,
				// 展示筛选面板
				showFilterPanel: false,
				// 展示搜索面板
				showSearchPanel: false,
				// 搜索关键词
				searchKey: "",
				// 展示页面类型 workOrder-勘查工单 overhaul-检修页面、issue-问题页面
				showType: "",
				// 刷新
				refreshing: false,
				// 列表数据总数
				total: 0,
				// 当前页
				pageNum: 1,
				// 列表刷新状态
				status: "nomore",
				// 选中的工单状态
				selectOrderStatus: ''
			};
		},
		computed: {
			fieldMapText() {
				return this.showType === "issue" ?
					this.issueFiledMapText :
					this.workOrderFieldMapText;
			},
			tabList() {
				const issueTabs = [{
					label: "问题",
					value: 1,
				}];
				const workOrderTabs = [{
						label: "勘查工单",
						value: 1,
						code: "workOrder",
					},
					{
						label: "检修工单",
						value: 2,
						code: "overhaul",
					},
				]
				return this.showType === "issue" ? issueTabs : workOrderTabs;
			},
			// 筛选面板选项
			filterList() {
				const workOrderFilters = ['创建工单', '审批完成', '现场勘查', '勘查报告', '报告审批', '指派项目经理', '指派组员', '结束', '暂停'];
				const overhaulFilters = ['创建工单', '工序执行', '竣工报告', '竣工报告审批', '返厂检修现场拆解', '返厂检修厂内拆解', '厂内生产', '试验', '检修报告',
					'指派项目经理', '指派组员', '结束', '暂停'
				]
				const workOrder = [{
					value: '',
					name: '全部'
				}];
				const overhaul = [{
					value: '',
					name: '全部'
				}];
				ORDER_STATUS_MAP.forEach((item, index) => {
					const tempObj = {
						name: item.text,
						value: index + 1
					};
					workOrderFilters.includes(item.text) && workOrder.push(tempObj)
					overhaulFilters.includes(item.text) && overhaul.push(tempObj)
				})
				const obj = {
					workOrder,
					overhaul
				}
				return obj[this.showType]
			}
		},
		watch: {
			showType(newVal, oldVal) {
				this.reGetData();
			}
		},
		onLoad(params) {
			// 路由激活时，重新获取数据
			this.showType = params.type || 'workOrder'
			params.id && this.handleRouterChange(params.id);
		},
		methods: {
			/**
			 * @method getListData 获取列表数据
			 **/
			getListData(type) {
				const param = {
					pageNum: this.pageNum,
					pageSize: 10,
				};
				if (this.selectOrderStatus) {
					param.orderStatusList = [this.selectOrderStatus]
				}
				let listData = [];
				if (type === 'scrolltoupper') {
					this.searchKey = param.projName = '';
					this.refreshing = true;
					this.pageNum = 1;
				} else if (type === 'scrolltolower') {
					this.pageNum++;
				}
				param.pageNum = this.pageNum;
				if (this.showType === "issue") {
					param.pageNum = type === 'search' ? 1 : this.pageNum;
					const ims_workOrder = uni.getStorageSync("ims_workOrder");
					param.workCode = ims_workOrder.id;
					param.searchKey = this.searchKey;
					queryProcedureProblem(param)
						.then(res => {
							if (res.success && res.data && Array.isArray(res.data.pageList)) {
								this.total = res.data.total;
								listData = res.data.pageList.map(item => ({
									...item,
									title: item.problemProcedureOwn,
									imgList: item.pictureUrl && item.pictureUrl.split('|'),
									videoList: item.videoUrl && item.videoUrl.split("|"),
								}))
								this.handleDataByType(listData, type)
							} else {
								this.cardList = []
								uni.$u.toast(res.errMsg || '暂无数据')
							}
						})
						.finally(() => {
							this.refreshing = false;
						})
				} else {
					param.projName = this.searchKey;
					param.workOrderType = this.showType === "workOrder" ? 1 : 2;
					getWorkOrderPageData(param)
						.then(res => {
							if (res.success && res.data && Array.isArray(res.data.pageList)) {
								this.total = res.data.total;
								listData = res.data.pageList.map(item => ({
									status: item.orderStatus,
									title: item.projName,
									...item
								}))
								this.handleDataByType(listData, type)

							} else {
								uni.$u.toast(res.errMsg || '暂无数据')
							}
						})
						.finally(() => {
							this.refreshing = false;
						})
				}

			},
			// 下拉刷新复位
			onRestore() {
				this.refreshing = false;
			},
			// 重置并获取数据
			reGetData() {
				this.cardList = [];
				this.total = 0;
				this.pageNum = 1;
				this.getListData();
			},
			/**
			 * @method handleDataByType 处理接口返回数据
			 **/
			handleDataByType(listData, type) {
				if (type === 'search') {
					this.cardList = JSON.parse(JSON.stringify(listData))
				}
				if (this.cardList.length < this.total) {
					this.cardList.push(...listData)
					this.status = 'loadmore'
				} else {
					this.status = 'nomore'
				}
			},
			/**
			 * @method handleRouterChange 处理路由改变-问题页面
			 **/
			handleRouterChange() {
				this.showType = "issue";
				this.cardList = [];
				this.total = 0;
				this.pageNum = 1;
				this.getListData();
			},
			/**
			 * @method handleTabChange 处理tab改变
			 **/
			handleTabChange(tab, index) {
				this.searchKey = '';
				this.activeIndex = index;
				this.showType = tab.code;
				this.refreshing = false;
			},
			/**
			 * @method handleShowDetail 点击卡片展示详情
			 **/
			handleShowDetail(item) {
				// 问题暂无详情
				if (this.showType === "issue") return;
				item.id && this.$store.dispatch('workOrder/getWorkOrderDetailInfo', {
					id: item.id
				});
				setTimeout(() => {
					uni.navigateTo({
						url: `/pages/orderDetail/index?id=${item.id}&type=${this.showType}`,
					});
				}, 200)
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
				this.selectOrderStatus = action.value;
				this.cardList = [];
				this.pageNum = 1;
				this.total = 0;
				this.getListData();
			},
		},
	};
</script>

<style scoped lang="scss">
	@import '@/assets/css/staging/index.scss';

	.staging-root {
		width: 100%;
		background: url("@/assets/imgs/staging/staging-bg.png") no-repeat center;
		background-size: 100% 100%;
		overflow: hidden;
		font-size: $fontSize;

		.head-tab {
			height: 68rpx;
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

		.card-box {
			height: calc(100% - 68rpx);
			padding-bottom: 60rpx;
			overflow-y: auto;

			.card-list {
				height: 100%;

				.card-item {
					margin: 0 20rpx;
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

	/deep/ .uni-scroll-view-refresher {
		background: url("@/assets/imgs/staging/staging-bg.png") no-repeat center;
		background-size: 100% 100%;
	}

	/deep/.u-action-sheet__item-wrap {
		max-height: 420px;
		overflow-y: auto;
	}
</style>