<template>
	<view class="sub-pro-row" id="order-detail-root">
		<view class="order-info">
			<view class="name">{{ projectInfo.name }}</view>
			<view :class="['info', showMore ? 'show-more' : 'show-less']">
				<template v-for="(item, key) in projectInfo">
					<view class="item" :key="item" v-if="Object.keys(fieldMapText).includes(key)">
						<u-icon :name="getIconByKey(key)" size="28" class="icon"></u-icon>
						<view class="info-box">
							<text class="label">{{ getLabelByKey(key) }}：</text>
							<text v-if="key === 'orderStatus'">{{ getStatusStr(item) }}</text>
							<text v-else>{{ item || "--" }}</text>
						</view>
					</view>
				</template>
			</view>
			<!-- 展开收起按钮 -->
			<view class="more-icon" @click="showMore = !showMore">
				<u-icon :name="showMore ? 'arrow-up' : 'arrow-down'" size="30"></u-icon>
			</view>
			<view class="btn-wrapper">
				<span class="btn-item" @click="isShowFilePanel = true">附件</span>
				<span class="btn-item" @click="handleSkipToIssue">查看问题</span>
			</view>
			<view :class="['bottom-content', showMore ? 'less-content' : 'more-content']">
				<u-tabs :list="tabData" @change="handleTabChange" :activeStyle="{
            color: '#323233',
            fontWeight: 'bold',
            transform: 'scale(1.05)',
          }" :inactiveStyle="{ color: '#657685' }" lineWidth="0"></u-tabs>
				<view class="comp-wrapper">
					<component :is="componentName" :orderInfo="routeParam" />
				</view>
			</view>
		</view>
		<!-- 附件下载面板 -->
		<u-action-sheet :show="isShowFilePanel" title="附件" :closeOnClickOverlay="true" :closeOnClickAction="true"
			@close="isShowFilePanel = false">
			<u-cell-group class="file-list">
				<u-cell v-for="file in projectInfo.fileList" :title="file.name" :key="file.url" size="large"
					@click="handleDownFile(file)">
					<!-- <text slot="value">
						<u-icon name="download" title="下载" class="download-icon" size="28" color="#3a62d7"
							@click="handleDownFile(file)" />
					</text> -->
				</u-cell>
			</u-cell-group>
		</u-action-sheet>
	</view>
</template>
<script>
	import ProcessList from "./components/processList.vue";
	import Bom from "./components/bom.vue";
	import ReturnList from "./components/returnList.vue";
	import DeviceList from './components/deviceList.vue';
	import {
		ORDER_DETAIL_FIELD_MAP,
		ORDER_STATUS_MAP
	} from "@/utils/constants-custom.js";
	import {
		getWorkOrderDetailById,
		getIssuePageList,
	} from "@/https/staging/index.js";
	import {
		mapState
	} from "vuex";
	export default {
		name: "OrderDetail",
		components: {
			ProcessList,
			Bom,
			ReturnList,
			DeviceList
		},
		data() {
			return {
				// 详情信息
				projectInfo: {},
				// 显示附件下载面板
				isShowFilePanel: false,
				// 显示更多信息
				showMore: true,
				// 展示的字段-图标
				fieldMapText: ORDER_DETAIL_FIELD_MAP,
				// 当前展示的列表组件
				componentName: "ProcessList",
				// 路由传参
				routeParam: {},
			};
		},
		computed: {
			...mapState("workOrder", ["workOrderDetailInfo"]),
			tabData() {
				const list = [{
						index: 0,
						name: "工序列表",
						cName: "ProcessList",
						key: "ProcessList"
					},
					{
						index: 1,
						name: "拆解BOM",
						cName: "Bom",
						key: "BomList"
					},
					{
						index: 2,
						name: "返厂清单",
						cName: "deviceList",
						key: "ReturnList"
					},
					{
						index: 3,
						name: "设备清单",
						cName: "deviceList",
						key: "DeviceList"

					},
					{
						index: 4,
						name: "材料清单",
						cName: "deviceList",
						key: "MaterialList"
					},
					{
						index: 5,
						name: "工装工具清单",
						cName: "deviceList",
						key: "ToolList"
					}
				];
				// 勘查工单没有返厂清单列表
				if (this.routeParam.type === "workOrder") {
					return list.slice(0, 1);
				} else {
					let ims_workOrder = uni.getStorageSync("ims_workOrder");
					// 检修工单现场检修没有拆解BOM和返厂清单
					if (!ims_workOrder.retFactory) {
						return list.filter(item => item.key !== 'BomList' && item.index !== 'ReturnList');
					} else {
						return list;
					}
				}
				return this.routeParam.type === "workOrder" ? list.slice(0, 1) : list;
			},
		},
		onLoad(options) {
			this.routeParam = {
				...options,
				retFactory: this.workOrderDetailInfo.retFactory
			};
		},
		created() {
			this.getDetailInfo();
		},
		methods: {
			/**
			 * @method getDetailInfo 获取详情
			 **/
			getDetailInfo() {
				const obj = {
					...this.workOrderDetailInfo,
				};
				this.projectInfo = {
					...obj,
					name: obj.projName || "--",
					planTime: `${
          (obj.planStartTime && obj.planStartTime.split(" ")[0]) || ""
        } - ${(obj.planEndTime && obj.planEndTime.split(" ")[0]) || ""}`,
					actualTime: `${
          (obj.actualStartTime && obj.actualStartTime.split(" ")[0]) || ""
        } - ${(obj.actualEndTime && obj.actualEndTime.split(" ")[0]) || ""}`,
				};
			},
			/**
			 * @method getLabelByKey 根据字段获取label
			 * @param {String} 字段key
			 **/
			getLabelByKey(key) {
				return (this.fieldMapText[key] && this.fieldMapText[key].label) || "";
			},
			/**
			 * @method getIconByKey 根据字段key获取图标
			 * @param {String} 字段key
			 **/
			getIconByKey(key) {
				return (this.fieldMapText[key] && this.fieldMapText[key].iconName) || "";
			},
			/**
			 * @method handleSkipToIssue 跳转到问题页面
			 **/
			handleSkipToIssue() {
				const url = `/pages/staging/index?type=issue`;
				uni.navigateTo({
					url,
				});
			},
			/**
			 * @method handleTabChange tab切换
			 **/
			handleTabChange(item) {
				this.componentName = item.cName;
				this.$store.commit('workOrder/updateActiveTab', item.key);
			},
			// 获取图片地址
			getUrl(url) {
				return "http://10.16.9.128:9000/" + url;
			},
			// 获取工单状态
			getStatusStr(status) {
				return status && ORDER_STATUS_MAP[status - 1] && ORDER_STATUS_MAP[status - 1].text || "-";
			},
			/**
			 * @method handleDownFile 下载文件
			 * @param {Object} 文件对象
			 **/
			handleDownFile(file) {
				if (!this.projectInfo.fileList.length) {
					uni.$u.toast('暂无数据')
					return;
				}
				uni.showLoading({
					title: "打开中",
				});
				// 文件下载功能
				uni.downloadFile({
					url: this.getUrl(file.url),
					filePath: this.getUrl(file.url),
					timeout: 30000,
					success: (res) => {
						console.log(this.getUrl(file.url), 'file');
						if (res.statusCode === 200) {
							const filePath = res.tempFilePath;
							// 保存文件
							uni.saveFile({
								tempFilePath: filePath,
								success: function(res) {
									const savedFilePath = res.savedFilePath;
									// 预览文件
									uni.openDocument({
										filePath: savedFilePath,
										showMenu: true, // 是否可以分享
										success: (res) => {
											if (res) {

											}
											uni.hideLoading();
										},
										file: (e) => {
											uni.showToast({
												title: "打开失败",
												icon: "error",
											});
										},
									});
								},
								file: (e) => {
									uni.showToast({
										title: "保存失败",
										icon: "error",
									});
								},
							});
						}
					},
					file: (e) => {
						uni.showToast({
							title: "打开失败",
							icon: "error",
						});
					},
				});
			},
		},
	};
</script>
<style lang="scss" scoped>
	@import "@/assets/css/staging/index.scss";

	.sub-pro-row {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: linear-gradient(rgba(209, 225, 246, 0.8) 0%,
				rgba(209, 225, 246, 0) 70%);

		.nav-bar {
			background-color: unset;
		}

		.order-info {
			width: 100%;
			height: 100%;
			position: relative;
			margin-bottom: 28rpx;
		}

		.name {
			width: 90%;
			padding: 0 32rpx;
			height: 30px;
			line-height: 30px;
			font-size: $titleFontSize;
			font-weight: 400;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.more-icon {
			position: absolute;
			right: 30px;
			top: 7px;
		}

		.info {
			// height: 200px;
			padding: 0 32rpx;

			.item {
				height: 30px;
				line-height: 30px;
				font-size: $fontSize;
				color: #657685;

				.icon {
					display: inline-block;
				}

				.info-box {
					display: inline-block;

					.label {
						margin: 0 10rpx;
					}
				}
			}
		}

		.show-more {
			animation: showMore 0.5s linear forwards;
		}

		.show-less {
			animation: showLess 0.5s linear forwards;
		}

		@keyframes showMore {
			0% {
				height: 0;
				opacity: 0;
			}

			90% {
				opacity: 0;
			}

			100% {
				height: 180px;
				opacity: 1;
			}
		}

		@keyframes showLess {
			0% {
				opacity: 1;
				height: 180px;
			}

			1% {
				opacity: 0;
			}

			100% {
				height: 0;
				opacity: 0;
			}
		}

		.btn-wrapper {
			height: 32px;
			display: flex;
			align-items: center;
			justify-content: space-around;
			background-color: #fff;
			margin: 10px 40rpx 0 40rpx;
			border-radius: 8rpx;

			.btn-item {
				flex: 1;
				border-right: 2rpx solid #2165762c;
				color: #657685;
				text-align: center;
				font-size: $fontSize;
				cursor: pointer;
			}

			:last-child {
				border-right: none;
			}
		}

		.more-content {
			height: calc(100% - 72px);
		}

		.less-content {
			height: calc(100% - 252px);
		}

		.comp-wrapper {
			height: calc(100% - 50px);
		}
	}

	.pr8 {
		padding-right: 16rpx;
	}

	.file-list {
		max-height: 600rpx;
		overflow-y: auto;
	}
</style>