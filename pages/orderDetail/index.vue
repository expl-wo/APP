<template>
	<view class="sub-pro-row" id="order-detail-root">
		<view class="order-info">
			<view class="name">{{ projectInfo.name }}</view>
			<view :class="['info', showMore ? 'show-more' : 'show-less']">
				<template v-for="(item,key) in projectInfo">
					<view class="item" :key="item" v-if="!['id','name'].includes(key)">
						<u-icon :name="getIconByKey(key)" size="28" class="icon"></u-icon>
						<view class="info-box">
							<text class="label">{{getLabelByKey(key)}}：</text>
							<text>{{item || '--'}}</text>
						</view>
					</view>
				</template>
			</view>
			<!-- 展开收起按钮 -->
			<view class="more-icon" @click="showMore = !showMore">
				<u-icon :name="showMore ? 'arrow-up':'arrow-down'" size="30"></u-icon>
			</view>
			<view class="btn-wrapper">
				<span class="btn-item" @click="isShowFilePanel = true">附件</span>
				<span class="btn-item" @click="handleSkipToIssue">查看问题</span>
			</view>
			<view :class="['bottom-content',showMore ? 'less-content' : 'more-content']">
				<u-tabs :list="tabData" @change='handleTabChange' :activeStyle="{
			            color: '#323233',
			            fontWeight: 'bold',
			            transform: 'scale(1.05)'
			        }" :inactiveStyle="{ color: '#657685'}" lineWidth='0'></u-tabs>
				<component :is="componentName" :class="[showMore ? 'less-content' : 'more-content']"
					:orderInfo='routeParam' />
			</view>
		</view>
		<!-- 附件下载面板 -->
		<u-action-sheet :show="isShowFilePanel" title="附件" :closeOnClickOverlay="true" :closeOnClickAction="true"
			@close='isShowFilePanel= false'>
			<u-cell-group class="file-list">
				<u-cell v-for="file in fileList" :title="file.name" :key="file.url" size="large">
					<text slot="value">
						<u-icon name="download" title="下载" class="download-icon" size="28" color="#3a62d7"
							@click="handleDownFile(file)" />
					</text>
				</u-cell>
			</u-cell-group>
		</u-action-sheet>
	</view>
</template>
<script>
	import ProcessList from "./components/processList.vue";
	import Bom from "./components/bom.vue";
	import ReturnList from "./components/returnList.vue";
	import {
		ORDER_DETAIL_FIELD_MAP
	} from '@/utils/constants-custom.js'
	import {
		getWorkOrderDetailById
	} from "@/https/staging/index.js";
	export default {
		name: 'OrderDetail',
		components: {
			ProcessList,
			Bom,
			ReturnList,
		},
		data() {
			return {
				// 详情信息
				projectInfo: {},
				tabData: [{
						index: 0,
						name: "工序列表",
						cName: "ProcessList"
					},
					{
						index: 1,
						name: "BOM",
						cName: "Bom"
					},
					{
						index: 2,
						name: "返厂清单",
						cName: "ReturnList"
					},
				],
				// 显示附件下载面板
				isShowFilePanel: false,
				// 附件列表
				fileList: [],
				// 显示更多信息
				showMore: true,
				// 展示的字段-图标
				fieldMapText: ORDER_DETAIL_FIELD_MAP,
				// 当前展示的列表组件
				componentName: 'ProcessList',
				// 路由传参
				routeParam: {}
			}
		},
		onLoad(options) {
			console.log(options, '111111111')
			options.id && this.getDetailInfoById(options.id);
			this.routeParam = {
				...options
			};
		},
		methods: {
			/**
			 * @method getDetailInfoById 根据id获取详情
			 **/
			getDetailInfoById(id) {
				getWorkOrderDetailById(id).then(res => {
					if (res.data) {
						this.projectInfo = {
							name: res.data.projName || '--',
							productNo: res.data.productNo || '--',
							projManagerName: res.data.projManagerName || '--',
							prodCategory: res.data.prodCategory || '--',
							voltageLevel: res.data.voltageLevel || '--',
							orderStatus: res.data.orderStatus || '--',
							planTime: `${res.data.planStartTime || ''} - ${res.data.planEndTime || ''}`,
							actualTime: `${res.data.createTime || ''} - ${res.data.planEndTime || ''}`,
						}
						// 文件列表
						const attachmentNames = res.data.attachmentName.split('|');
						const attachmentUrls = res.data.attachmentUrl.split("|")
						attachmentNames.forEach((item, index) => {
							this.fileList.push({
								name: item,
								url: attachmentUrls[index]
							})
						})
						console.log(this.projectInfo, 'projectInfo', this.fileList)
					}
				})
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
				const url = `/pages/staging/index?type=issue&id=${1}`
				uni.navigateTo({
					url
				})
			},
			/**
			 * @method handleTabChange tab切换
			 **/
			handleTabChange(item) {
				console.log(item, 'item')
				this.componentName = item.cName;
			},
			/**
			 * @method handleDownFile 下载文件
			 * @param {Object} 文件对象
			 **/
			handleDownFile(file) {
				console.log(file, "file");
				uni.showLoading({
					title: '下载中'
				})
				// 文件下载功能
				uni.downloadFile({
					url: file.url,
					success: (res) => {
						if (res.status === 200) {
							const filePath = res.temFilePath;
							console.log(res, 'downloadFile')
							// 保存文件
							uni.saveFile({
								tempFilePath: filePath,
								success: function(res) {
									console.log(res, 'saveFile')
									const savedFilePath = res.savedFilePath;
									// 预览文件
									uni.openDocument({
										filePath: savedFilePath,
										showMenu: true, // 是否可以分享
										success: (res) => {
											if (res) {
												uni.hideLoading()
												console.log(res)
											}
										}
									})
								}
							});
						}
					},
					file: (e) => {
						uni.showToast({
							title: '打开失败',
							icon: 'error'
						})
					}
				})
			},
			/**
			 * @method handleTouchAnimation 处理滑动事件
			 **/
			// handleTouchAnimation() {
			// 	let element = document.getElementById("order-detail-root");
			// 	let startY = 0;
			// 	let endY = 0;
			// 	const _this = this;
			// 	if (element) {
			// 		element.addEventListener("touchstart", function(e) {
			// 			startY = e.changedTouches[0].pageY;
			// 		});
			// 		element.addEventListener("touchend", function(e) {
			// 			endY = e.changedTouches[0].pageY;
			// 			const y = endY - startY;
			// 			if (y > 0 && Math.abs(y) > 50) {
			// 				_this.showMore = true;
			// 			} else if (y < 0 && Math.abs(y) > 50) {
			// 				_this.showMore = false;
			// 			}
			// 		});
			// 	}
			// },
		}
	};
</script>
<style lang="scss" scoped>
	@import '@/assets/css/staging/index.scss';

	.sub-pro-row {
		width: 100%;
		overflow: hidden;
		background: linear-gradient(rgba(209, 225, 246, 0.8) 0%,
				rgba(209, 225, 246, 0) 70%);


		.nav-bar {
			background-color: unset;
		}

		.order-info {
			position: relative;
			margin-bottom: 28rpx;
		}

		.name {
			padding: 0 32rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: $titleFontSize;
		}

		.more-icon {
			position: absolute;
			right: 30px;
			top: 20px;
		}

		.info {
			padding: 0 32rpx;

			.item {
				height: 40rpx;
				line-height: 40rpx;
				font-size: $fontSize;
				color: #657685;

				.icon {
					display: inline-block;
					vertical-align: text-bottom;
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
				height: 280rpx;
				opacity: 1;
			}
		}

		@keyframes showLess {
			0% {
				opacity: 1;
				height: 280rpx;
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
			height: 64rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;
			background-color: #fff;
			margin: 20rpx 40rpx 0 40rpx;
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
			max-height: 760px;
		}

		.less-content {
			max-height: 600px;
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