<template>
	<view class="page-wrapper">
		<view class="top-wrapper">
			<view class="info">
				<view class="name">{{ productioName }}</view>
				<view class="extra-info">
					<text class="notice" @click="showNotice">工序要求</text>
					<u-icon class="icon" name="pushpin-fill" size="16" color="#3a62d7" @click="handleAddIssue" />
				</view>
			</view>
			<production-info :fieldMapText="fieldMapText" :infoObj="productionDetailInfo" />
			<u-tabs :list="tabList" line-width="20" @click="tabChange"></u-tabs>
		</view>
		<view class="list-wrapper">
			<scroll-view v-if="listData.length" class="scroll-wrapper" :scroll-top="scrollTop" :show-scrollbar="true"
				scroll-y="true" @scrolltoupper="scrolltoupper" @scrolltolower="scrolltolower" @scroll="scroll">
				<view class="list-item" v-for="(item, index) in listData" :key="index" @click="skipSubProductDetail(item)">
					<view class="title">
						<text>{{ item.subProcessName }}</text>
						<text class="prove-status" :style="{ color: ['#f64930', '#17aa81'][item.proveStatus] }">
							{{ ["未审核", "已审核"][item.proveStatus] }}
						</text>
					</view>
					<view class="progress">
						<Progress />
					</view>
				</view>
				
<!-- 				<u-loadmore :status="status" /> -->

			</scroll-view>
			<u-empty v-else mode="data" icon="http://cdn.uviewui.com/uview/empty/car.png">
			</u-empty>
		</view>
		<notice :show="noticeFlag" title="工序要求" :content="tip" @closeNotice="closeNotice" />


	</view>
</template>

<script>
	import Progress from "@/components/common/progress.vue";
	import ProductionInfo from "@/components/common/productionInfo.vue";
	import List from "@/components/common/list.vue";
	import Notice from '@/components/common/notice.vue';
	export default {
		name: "SubprocessDetail",
		components: {
			Progress,
			ProductionInfo,
			List,
			Notice
		},
		data() {
			return {
				// 工序详情id
				productionId: "",
				productioName: '测试中工序一',
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
				productionName: "工序名称",
				// 工序详情信息
				productionDetailInfo: {
					groupPerson: "司马懿",
					subGroupPerson: "干酒",
					member: "成员",
				},
				// 工序列表数据
				listData: [{
						id: 1,
						subProcessName: "子工序名称",
						proveStatus: 0,
						percentage: 30,
					}
				],
				// 当前选中的tab
				activeTab: "",
				tabList: [{
						name: "全部",
						value: 0,
					},
					{
						name: "未完工",
						value: 1,
					},
					{
						name: "未复核",
						value: 2,
					},
					{
						name: "已完成",
						value: 3,
					},
				],
				// 工序标准
				tip: "<h4>测试</h4><br>",
				showLoading: false,
				noticeFlag: false
			};
		},
		onLoad() {
			this.getProcessId();
		},
		methods: {
			tabChange(item) {
				this.activeTab = item.value;
				console.log(this.activeTab)
				this.showLoading = false;
			},
			showNotice() {
				this.noticeFlag = true;
			},
			closeNotice() {
				this.noticeFlag = false;
			},
			scroll(scrollTop) {
				debugger;
			},
			scrolltolower() {
			// 	this.loadmore()
			},
			scrolltoupper() {
				this.showLoading = true;
				console.log('---------', '划到顶部');
			},
			/**
			 * @method getProcessId 获取工序详情id
			 **/
			getProcessId() {
				// const {
				// 	id
				// } = this.$route.params;
				// if (id || this.productionId) {
				// 	this.productionId = id;
				// 	this.getDetailInfoById();
				// } else {
				// 	// 返回上一级路由
				// 	// window.history.go(-1);
				// }
			},
			/**
			 * @method getDetailInfoById 获取详情信息
			 **/
			getDetailInfoById() {
				// 调用接口获取详情及列表数据
			},
			/**
			 * @method getIconByKey 根据字段key获取图标
			 * @param {String} 字段key
			 **/
			getIconByKey(key) {
				return this.fieldMapText[key].iconName || "";
			},
			/**
			 * @method getLabelByKey 根据字段获取label
			 * @param {String} 字段key
			 **/
			getLabelByKey(key) {
				return this.fieldMapText[key].label || "";
			},
			handleChangeTab(name, title) {
				console.log(name, title, "nam");
				this.getListDataByType();
			},
			handleAddIssue() {
				uni.navigateTo({
					url: '/pages/orderDetail/addIssue'
				});
			},
			// 获取到列表数据
			getListDataByType() {},
			skipSubProductDetail(item) {
				uni.navigateTo({
					url: `/pages/orderDetail/subProductionDetail/index?productId=${item.id}`
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
			height: 178px;
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
		}

		.list-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			// 需减去top-wrapper和margin高度
			height: calc(100% - 188px);
			width: calc(100% - 32rpx);
			margin: 0 16rpx;
			background-color: #fff;

			.scroll-wrapper {
				display: flex;
				flex-direction: row;
				
				width: 100%;
				height: 100%;
				overflow: auto;
				/deep/ .uni-scroll-view-content {
					display: flex;
					flex-wrap: wrap;
				}
				.list-item {
					height: 100px;
					width: 50%;
					padding: 10px;
					background-color: rgba(254, 254, 254, 0.1);
					border-bottom: 1px solid rgba(230, 230, 230, 1);
					
					.title {
						display: flex;
						
						justify-content: space-between;
						height: 30px;
						line-height: 30px;
						margin-bottom: 16px;
						font-size: 16px;
						color: #445160;
					}
				}
				.list-item:nth-child(odd) {
					border-right: 1px solid rgba(230, 230, 230, 1);
				}
			}
		}
	}

</style>