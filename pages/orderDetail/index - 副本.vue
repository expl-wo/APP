<template>
	<div class="full-content" id="order-detail-root">
		<!-- <u-navbar class="nav-bar" title="工单详情" @leftClick="back"></u-navbar> -->
		<div class="order-info">
			<div class="name">{{ projectInfo.name }}</div>
			<div :class="['info', showMore ? 'show-more' : 'show-less']">
				<div class="item">
					<u-icon name="photo" color="#2979ff" size="28"></u-icon>
					生产号：{{projectInfo.productNo}}
				</div>
				<div class="item">
					<u-icon name="photo" color="#2979ff" size="28"></u-icon>
					项目经理：{{projectInfo.manager}}
				</div>
				<div class="item">
					<u-icon name="photo" color="#2979ff" size="28"></u-icon>
					产品大类：{{projectInfo.category}}
				</div>
				<div class="item">
					<u-icon name="photo" color="#2979ff" size="28"></u-icon>
					电压等级：{{projectInfo.voltageLevel}}
				</div>
				<div class="item">
					<u-icon name="photo" color="#2979ff" size="28"></u-icon>
					工作状态：{{projectInfo.status}}
				</div>
				<div class="item">
					<u-icon name="photo" color="#2979ff" size="28"></u-icon>
					计划开始/结束时间：{{projectInfo.planTime}}
				</div>
				<div class="item">
					<u-icon name="photo" color="#2979ff" size="28"></u-icon>
					实际开始/结束时间：{{projectInfo.actualTime}}
				</div>
			</div>
			<div class="btn-wrapper">
				<span class="btn-item" @click="isShowFilePanel = true">附件</span>
				<span class="btn-item" @click="handleSkipToIssue">查看问题</span>
			</div>
		</div>
		<div class="bottom-content">
			<u-tabs :list="activeTab">
				<u-tab v-for="item in tabData" :key="item.index" :title="item.title">
					<!-- <component :is="item.cName" v-if="activeTab == item.index" /> -->
				</u-tab>
			</u-tabs>
		</div>
		<!-- 附件下载面板 -->
		<u-action-sheet :show="isShowFilePanel" title="附件" :actions="fileList" :closeOnClickOverlay="true"
			:closeOnClickAction="true" @close='isShowFilePanel= false'>
			<!-- <u-cell-group class="file-list">
				<u-cell class="file-item" v-for="file in fileList" :title="file.name" :key="file.id"
					@click="handleDownFile(file)">
					<u-icon name="smile-o" title="下载" class="download-icon" />
				</u-cell>
			</u-cell-group> -->
		</u-action-sheet>
	</div>
</template>
<script>
	import ProcessList from "./components/processList.vue";
	import Bom from "./components/bom.vue";
	import ReturnList from "./components/returnList.vue";
	export default {
		components: {
			ProcessList,
			Bom,
			ReturnList,
		},
		data() {
			return {
				projectInfo: {
					name: "广东大亚湾核电站变压器项目",
					productNo: "Z0001",
					manager: "张三",
					category: "变压器",
					voltageLevel: "110kv",
					status: 0,
					planTime: "2023-11-09 - 2023-12-30",
					actualTime: "2023-11-10 - 2023-12-30",
				},
				tabData: [{
						index: 0,
						title: "工序列表",
						cName: "ProcessList"
					},
					{
						index: 1,
						title: "BOM",
						cName: "Bom"
					},
					{
						index: 2,
						title: "返厂清单",
						cName: "ReturnList"
					},
				],
				activeTab: 0,
				// 显示附件下载面板
				isShowFilePanel: false,
				// 附件列表
				fileList: [{
						name: "技术协议.excel",
						id: 1,
					},
					{
						name: "技术协议.excel",
						id: 2,
					},
					{
						name: "技术协议.excel",
						id: 2,
					},
					{
						name: "技术协议.excel",
						id: 2,
					},
					{
						name: "技术协议.excel",
						id: 2,
					},
					{
						name: "技术协议.excel",
						id: 2,
					},
					{
						name: "技术协议.excel",
						id: 2,
					},
					{
						name: "技术协议.excel",
						id: 2,
					},
				],
				showMore: true,
			};
		},
		onShow() {
			this.handleTouchAnimation();
		},
		methods: {
			// 返回
			back() {
				debugger
				window.history.go(-1);
			},
			/**
			 * @method handleSkipToIssue 跳转到问题页面
			 **/
			handleSkipToIssue() {
				// this.$router.push({
				// 	name: "staging",
				// 	params: {
				// 		id: 1,
				// 		type: "issue"
				// 	},
				// });
				const url = `/pages/staging/index?type=issue&id=${1}`
				uni.navigateTo({
					url
				})
			},
			/**
			 * @method handleDownFile 下载文件
			 * @param {Object} 文件对象
			 **/
			handleDownFile(file) {
				console.log(file, "file");
			},
			/**
			 * @method handleTouchAnimation 处理滑动事件
			 **/
			handleTouchAnimation() {
				let element = document.getElementById("order-detail-root");
				let startY = 0;
				let endY = 0;
				const _this = this;
				if (element) {
					element.addEventListener("touchstart", function(e) {
						startY = e.changedTouches[0].pageY;
					});
					element.addEventListener("touchend", function(e) {
						// e.preventDefault();
						endY = e.changedTouches[0].pageY;
						const y = endY - startY;
						if (y > 0 && Math.abs(y) > 50) {
							_this.showMore = true;
						} else if (y < 0 && Math.abs(y) > 50) {
							_this.showMore = false;
						}
					});
				}
			},
		},
		beforeDestroy() {
			this.removeTouchEvent();
		},
	};
</script>
<style lang="scss" scoped>
	.full-content {
		width: 100%;
		height: 1624rpx;
		overflow: hidden;
		background: linear-gradient(rgba(209, 225, 246, 0.8) 0%,
				rgba(209, 225, 246, 0) 70%);

		.nav-bar {
			background-color: unset;
		}

		.order-info {
			margin-bottom: 38rpx;
		}

		.name {
			padding: 0 32rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 36rpx;
		}

		.info {
			padding: 0 32rpx;
			pointer-events: none;

			.item {
				height: 40rpx;
				line-height: 40rpx;
				font-size: 24rpx;
				color: #657685;
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
				font-size: 24rpx;
				cursor: pointer;
			}

			:last-child {
				border-right: none;
			}
		}

		.bottom-content {
			height: calc(100% - 556rpx);

			/deep/ .u-tabs__nav {
				padding-left: 20rpx;
				background-color: transparent;
			}

			/deep/ .van-tab {
				flex: unset;
				padding-right: 24rpx;
			}

			/deep/ .u-tabs__line {
				display: none;
			}

			/deep/ .van-tab--active {
				font-size: 36rpx;
				font-weight: 600;
			}

			/deep/ .u-tabs {
				height: 100%;
				width: 100%;
			}

			/deep/ .u-tabs__content {
				// height: calc(100% - 44rpx);
				height: 1200rpx;
				padding: 0 32rpx;

				.van-tab__pane {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.pr8 {
		padding-right: 16rpx;
	}

	.file-list {
		max-height: 600rpx;
		overflow-y: auto;

		.download-icon {
			font-size: 40rpx;
			color: #1b5ae7;
			cursor: pointer;
		}
	}
</style>