<!-- 标准工序详情 -->
<template>
	<view class="page-wrapper">
		<view class="top-wrapper">
			<view class="info">
				<view class="name">{{ processName }}</view>
				<view class="extra-info">
					<text class="notice" @click="showNotice">工序要求</text>
					<u-icon class="icon" name="pushpin-fill" size="16" color="#3a62d7" @click="handleAddIssue" />
				</view>
			</view>
			<production-info :fieldMapText="fieldMapText" :infoObj="processDetailInfo" />
			<u-tabs :list="tabList" line-width="20" @click="tabChange"></u-tabs>
		</view>
		<view class="list-wrapper">
			<scroll-view class="scroll-wrapper" scroll-top="0" :show-scrollbar="true" :scroll-y="true"
				:refresher-triggered="refreshing" :refresher-enabled="true" :refresher-threshold="80"
				:upper-threshold="50" :lower-threshold="30" @refresherrefresh="getData('scrolltoupper')"
				@scrolltolower="getData('scrolltolower')">
					<view class="list-item" v-for="(item, index) in listData" :key="index"
						@click="skipProductionDetail(item)">
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
	</view>
</template>

<script>
	import ProductionInfo from "@/components/common/productionInfo.vue";
	import Progress from "@/components/common/progress.vue";
	import {
		getProcessList
	} from "@/https/staging/index.js";
	import {
		WORK_ORDER_FIELD_MAP,
		WORK_STATUS_MAP
	} from '@/utils/constants-custom.js'
	import {
		mapState
	} from 'vuex'
	export default {
		name: "ProcessDetail",
		components: {
			ProductionInfo,
			Progress,
		},
		computed: {
			...mapState("workOrder", [
				// 工单详情信息
				'workOrderDatialInfo'
			]),
			nomoreText() {
				return this.listData.length ? '没有更多了' : '暂无数据';
			}
		},
		data() {
			return {
				WORK_STATUS_MAP: Object.freeze(WORK_STATUS_MAP),
				// 大工序详情id
				workProcedureCode: "",
				// 字段与文本映射
				fieldMapText: WORK_ORDER_FIELD_MAP,
				processName: "",
				// 大工序详情信息
				processDetailInfo: {
					code: "",
					groupPerson: "",
					subGroupPerson: "",
					member: ""
				},
				// 工序列表数据
				listData: [],
				pageNum: 1,
				pageSize: 20,
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
				activeTab: '',
				scrollTop: 0,
				refreshing: false,
				showLoading: false,
				status: 'nomore',
				hasNextPage: false,
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
				deputyLeaderName,
				leaderName,
				memberName,
				workProcedureType,
				title,
				workProcedureCode,
				workOrderSceneType
			} = uni.getStorageSync('ims_standardProcess');
			this.workProcedureType = workProcedureType;
			this.workProcedureCode = workProcedureCode;
			this.processName = title;
			this.processDetailInfo.groupPerson = deputyLeaderName;
			this.processDetailInfo.subGroupPerson = leaderName;
			this.processDetailInfo.member = memberName;
			this.processDetailInfo.code = workProcedureCode;
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
				// 暂时先用测试数据
				let temp = this.workProcedureCode.split('_');
				let params = {
					pageNum,
					pageSize,
					workProcedureCode: temp[temp.length - 1],
					workProcedureType: 1, // 0-根节点, 1-标准工序,2-中工序,3-工步,4-内容工序
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
			/**
			 * @method getIconByKey 根据字段key获取图标
			 * @param {String} 字段key
			 **/
			getIconByKey(key) {
				return this.fieldMapText[key] && this.fieldMapText[key].iconName || "";
			},
			/**
			 * @method getLabelByKey 根据字段获取label
			 * @param {String} 字段key
			 **/
			getLabelByKey(key) {
				return this.fieldMapText[key] && this.fieldMapText[key].label || "";
			},
			// 跳转到工序详情界面
			skipProductionDetail(process) {
				// 缓存中工序
				uni.setStorageSync('ims_intermediateProcess', process);
				// 跳转到中工序详情页面
				uni.navigateTo({
					url: '/pages/orderDetail/productionDetail/index'
				})
			},
			handleAddIssue() {
				uni.navigateTo({
					url: `/pages/orderDetail/addIssue?workProcedureCode=${this.workProcedureCode}&workScene=${this.workOrderSceneType}&workProcedureType=${1}`
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/css/staging/index.scss';

	.page-wrapper {
		width: 100%;
		height: 100%;
		background: linear-gradient(282deg,
				rgba(209, 225, 246, 0.1) 0%,
				rgba(209, 225, 246, 0.8) 70%);

		.top-wrapper {
			height: 216px;
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
			// 需减去top-wrapper和margin高度
			height: calc(100% - 226px);
			width: calc(100% - 32rpx);
			overflow-y: auto;
			margin: 0 16rpx;
			background-color: #fff;

			.scroll-wrapper {
				width: 100%;
				height: 100%;
				overflow-y: auto;
				box-sizing: border-box;

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