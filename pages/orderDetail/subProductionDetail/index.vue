<template>
	<view class="page-wrapper">
		<view class="top-wrapper">
			<view class="info">
				<view class="name">{{ productionName }}</view>
				<view class="extra-info">
					<text class="notice" @click="showNotice">工步要求</text>
					<u-icon class="icon" name="pushpin-fill" size="16" color="#3a62d7" @click="handleAddIssue" />
				</view>
			</view>
			<production-info :fieldMapText="fieldMapText" :infoObj="subProductInfo" />
			<u-tabs :list="tabList" line-width="20" @click="tabChange" />
		</view>
		<view class="list-wrapper">
			<scroll-view v-if="listData.length" class="scroll-wrapper" :scroll-top="scrollTop" :show-scrollbar="true"
				scroll-y="true" @scrolltoupper="scrolltoupper" @scrolltolower="scrolltolower" @scroll="scroll">
				<view class="list-item" v-for="(item, index) in listData" :key="index" @click="executeWork(item)">
					<view class="title">
						<text>{{ item.workName }}</text>
						<text class="prove-status" :style="{ color: statusMap[item.checkStatus].color }">
							{{ statusMap[item.checkStatus].label }}
						</text>
					</view>
					<view class="progress">
						<Progress />
					</view>
				</view>
<!-- 				<u-loadmore :status="status" /> -->

			</scroll-view>
			<u-empty v-else mode="data" icon="http://cdn.uviewui.com/uview/empty/car.png" />
		</view>
		<view class="btn-wrapper">
			<u-button icon="arrow-left" class="btn" :plain="true" :disabled="prevDisabled" :loading="prevLoading" @click="prev" />
			<u-button icon="arrow-right" type="primary" class="btn next-btn" :plain="true" :disabled="nextDisabled" :loading="nextLoading" @click="next" />
		</view>
		<notice :show="noticeFlag" title="工步要求" :content="tip" @closeNotice="closeNotice" />
	</view>
</template>

<script>
	import Notice from '@/components/common/notice.vue';
	import ProductionInfo from "@/components/common/productionInfo.vue";
	import Progress from "@/components/common/progress.vue";
	const statusMap = {
		0: {
			label: '未复核',
			color: '#f64930'
		},
		1: {
			label: '已复核',
			color: '#17aa81'
		}
	}
	export default {
		name: "ProcessDetail",
		components: {
			Progress,
			Notice,
			ProductionInfo
		},
		data() {
			return {
				noticeFlag: false,
				// 工序详情id
				productionId: "",
				// 字段与文本映射
				fieldMapText: {
					code: {
						label: "工序编码",
						iconName: "photo"
					},
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
					},
					planTime: {
						label: "计划开工/完工时间",
						iconName: "photo"
					},
					realTime: {
						label: "实际开工/完工时间",
						iconName: "photo"
					},
				},
				productionName: "测试工步一",
				// 工序详情信息
				subProductInfo: {
					groupPerson: "司马懿",
					subGroupPerson: "干酒",
					member: "成员",
				},
				statusMap: Object.freeze(statusMap),
				// 工序列表数据
				listData: [{
						workName: "工作内容一",
						checkStatus: '0',
						percentage: 50,
					},
					{
						workName: "工作内容二",
						checkStatus: '1',
						percentage: 50,
					},
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
				// 提示内容
				tip: "<h4>工步标准</h4><p>xxxxxx</p>",
				scrollTop: 0,
				prevDisabled: false,
				prevLoading: false,
				nextDisabled: false,
				nextLoading: false
			};
		},
		onLoad(option) {
			// 接收参数
			let id = JSON.parse(option.productId);
		// 	console.log(params)
		},
		methods: {
			// 显示提示
			showNotice() {
				this.noticeFlag = true;
			},
			// 关闭提示
			closeNotice() {
				this.noticeFlag = false;
			},
			// 添加问题
			handleAddIssue() {
				uni.navigateTo({
					url: '/pages/orderDetail/addIssue'
				});
			},
			// tab切换
			tabChange(item) {
				this.activeTab = item.value;
				this.showLoading = false;
			},
			// 滑到顶部
			scrolltoupper() {},
			// 滑到底部
			scrolltolower() {},
			// 滑动事件
			scroll() {},
			// 执行工步
			executeWork(item) {
				// uni.navigateTo({
				// 	url: ''
				// });
			},
			// 上一项
			prev() {},
			// 下一项
			next() {},
			// 获取数据
			getData() {},

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
			}
		},
	};
</script>

<style lang="scss" scoped>
	.page-wrapper {
		height: 100%;
		width: 100%;
		background: linear-gradient(282deg,
				rgba(209, 225, 246, 0.1) 0%,
				rgba(209, 225, 246, 0.8) 70%);
		position: relative;

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
			height: calc(100% - 248px);
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

		.btn-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 60px;
			width: calc(100% - 32rpx);
			margin: 0 16rpx;
			padding: 10px 0;
			background-color: #fff;
			.btn {
				width: 10%;
			}
			.next-btn {
				margin-left: 40px;
				background-color: #ddebfe;
				border: none;
			}
		}
	}
	.mr40 {
		
	}
</style>