<!-- 中工序详情 -->
<template>
	<view class="page-wrapper">
		<view class="top-wrapper">
			<view class="info">
				<view class="name">{{ workProcedureName }}</view>
				<view class="extra-info">
					<!-- <text class="notice" @click="showNotice">工序要求</text> -->
					<u-icon class="icon" name="pushpin-fill" size="16" color="#3a62d7" @click="handleAddIssue" />
				</view>
			</view>
			<production-info :fieldMapText="fieldMapText" :infoObj="productionDetailInfo" />
			<u-tabs :list="tabList" line-width="20" @click="tabChange"></u-tabs>
		</view>
		<view class="list-wrapper">
			<scroll-view class="scroll-wrapper" :scroll-top="scrollTop" :show-scrollbar="true"
				:scroll-y="true" :upper-threshold="50" :lower-threshold="30" :refresher-threshold="80"
				:refresher-enabled="true" :refresher-triggered="refreshing" @refresherrefresh="getData('scrolltoupper')"
				@scrolltolower="getData('scrolltolower')">
				<view class="list-item" v-for="(item, index) in listData" :key="index"
					@click="skipSubProductDetail(item)">
					<view class="title">
						<view class="name">{{ item.workProcedureName }}</view>
						<view class="status" :style="{ color: WORK_STATUS_MAP[item.workStatus].color }">
							{{ WORK_STATUS_MAP[item.workStatus].label }}
						</view>
					</view>
					<view class="progress">
						<Progress :percentage="item.workStatus + '%'" />
					</view>
				</view>
				<u-loadmore v-if="showLoading" :status="status" :nomoreText="nomoreText" />
			</scroll-view>
		</view>
		<notice :show="noticeFlag" title="工序要求" :content="tip" @closeNotice="closeNotice" />
	</view>
</template>

<script>
	import Progress from "@/components/common/progress.vue";
	import ProductionInfo from "@/components/common/productionInfo.vue";
	import List from "@/components/common/list.vue";
	import Notice from '@/components/common/notice.vue';

	import {
		getProcessList
	
	} from "@/https/staging/index.js";
	import {
		WORK_STATUS_MAP
	} from '@/utils/constants-custom.js'
	export default {
		name: "SubProductionDetail",
		components: {
			Progress,
			ProductionInfo,
			List,
			Notice
		},
		data() {
			return {
				WORK_STATUS_MAP: Object.freeze(WORK_STATUS_MAP),
				// 标准工序编码
				workProcedureCode: '',
				// 标准工序名称
				workProcedureName: '',
				scrollTop: 0,
				// 字段与文本映射
				fieldMapText: {
					groupPerson: {
						label: "组长",
						iconName: "account-fill"
					},
					subGroupPerson: {
						label: "副组长",
						iconName: "account-fill"
					},
					member: {
						label: "成员",
						iconName: "account-fill"
					}
				},
				// 工序详情信息
				productionDetailInfo: {
					groupPerson: "",
					subGroupPerson: "",
					member: "",
				},
				// 工序列表数据
				listData: [],
				// 当前选中的tab
				activeTab: "",
				tabList: [{
						name: "全部",
						value: -1,
					},
					{
						name: "未派工",
						value: 0,
					},
					{
						name: "已开工",
						value: 1,
					},
					{
						name: "未开工",
						value: 2,
					},
					{
						name: "已完工",
						value: 3,
					},
				],
				// 工序标准
				tip: "",
				showLoading: false,
				noticeFlag: false,
				pageNum: 1,
				pageSize: 20,
				refreshing: false,
				hasNextPage: false,
				status: 'nomore',
				// 工单场景
				workOrderSceneType: ''
			};
		},
		computed: {
			nomoreText() {
				return this.listData.length ? '没有更多了' : '暂无数据';
			}
		},
		onLoad() {
			let {
				workProcedureCode,
				workProcedureName,
				deputyLeaderName,
				leaderName,
				memberName,
				workOrderSceneType
			} = uni.getStorageSync('ims_intermediateProcess');
			this.workProcedureCode = workProcedureCode;
			this.workProcedureName = workProcedureName;
			this.productionDetailInfo.groupPerson = deputyLeaderName;
			this.productionDetailInfo.subGroupPerson = leaderName;
			this.productionDetailInfo.member = memberName;
			this.workOrderSceneType = workOrderSceneType;
			this.getData();
		},
		methods: {
			tabChange(item) {
				this.activeTab = item.value;
				this.pageNum = 1;
				this.listData = [];
				this.getData();
			},
			showNotice() {
				this.noticeFlag = true;
			},
			closeNotice() {
				this.noticeFlag = false;
			},
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
				let temp = this.workProcedureCode.split('_');
				let params = {
					pageNum,
					pageSize,
					workProcedureCode: temp[temp.length - 1],
					workProcedureType: 2, // 0-根节点, 1-标准工序,2-中工序,3-工步,4-内容工序
					workOrderSceneType: this.workOrderSceneType
				};
				// 状态为全部特殊处理
				if (this.activeTab !== -1) {
					params.workStatus = this.activeTab;
				} else {
					delete params.workStatus;
				}
				let extraParams = {};
				let workOrder = uni.getStorageSync('ims_workOrder');
				let { id, workOrderType, procedureTemplateCode } = workOrder;
				extraParams.workCode = id;
				// 勘察工单
				if (workOrderType === 1) {
					extraParams.templateCode = procedureTemplateCode;
				} else {
					// TODO
				}
				if (type !== 'scrolltoupper') {
					this.status = 'loading';
				}
				getProcessList({...params, ...extraParams})
					.then(res => {
						if (res.data) {
							let {
								pageList,
								hasNextPage
							} = res.data;
							let revData = pageList || [];
							this.listData = [...this.listData, ...revData];
							this.hasNextPage = hasNextPage;
						}
					})
					.finally(() => {
						this.refreshing = false;
						this.showLoading = true;
						this.status = this.hasNextPage ? 'loadmore' : 'nomore';
					})
			},
			 // 根据字段key获取图标
			getIconByKey(key) {
				return this.fieldMapText[key].iconName || "";
			},
			// 根据字段获取label
			getLabelByKey(key) {
				return this.fieldMapText[key].label || "";
			},
			handleAddIssue() {
				uni.navigateTo({
					url: `/pages/orderDetail/addIssue?workProcedureCode=${this.workProcedureCode}&workScene=${this.workOrderSceneType}&workProcedureType=${2}`
				});
			},
			skipSubProductDetail(item) {
				// 缓存工步
				uni.setStorageSync('ims_workStep', item);
				uni.navigateTo({
					url: `/pages/orderDetail/subProductionRowDetail/index`
				});
			}
		},
	};
</script>

<style lang="scss" scoped>
	.page-wrapper {
		width: 100%;
		height: 100%;
		background: linear-gradient(282deg,
				rgba(209, 225, 246, 0.1) 0%,
				rgba(209, 225, 246, 0.8) 70%);

		.top-wrapper {
			height: 186px;
			margin: 10px 16rpx 0;
			padding: 0 16rpx;
			background-color: #fff;
			border-radius: 10rpx 10rpx 0 0;

			.info {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 40px;
				line-height: 40px;

				.name {
					font-size: 20px;
				}

				.extra-info {
					display: flex;
					align-items: center;
					justify-content: center;

					.notice {
						color: #3a62d7;
						font-size: 16px;
					}

					.icon {
						margin-left: 16rpx;
						color: #3a62d7;
					}
				}
			}

			/deep/ .u-tabs {
				border-top: 1px solid rgba(101, 118, 133, 0.11);
				border-bottom: 1px solid rgba(101, 118, 133, 0.11);
			}
		}

		.list-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			// 需减去top-wrapper和margin高度
			height: calc(100% - 196px);
			width: calc(100% - 32rpx);
			margin: 0 16rpx;
			background-color: #fff;

			.scroll-wrapper {
				display: flex;
				flex-direction: row;

				width: 100%;
				height: 100%;
				overflow: auto;

				.list-item {
					display: inline-block;
					height: 100px;
					width: 50%;
					padding: 10px;
					background-color: rgba(254, 254, 254, 0.1);
					border-bottom: 1px solid rgba(230, 230, 230, 1);

					.title {
						display: flex;
						height: 30px;
						line-height: 30px;
						margin-bottom: 16px;
						font-size: 16px;
						color: #445160;
						.name {
							flex: 1;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						.status {
							margin-left: auto;
						}
					}
				}

				.list-item:nth-child(even) {
					border-right: 1px solid rgba(230, 230, 230, 1);
				}
			}
		}
	}
</style>