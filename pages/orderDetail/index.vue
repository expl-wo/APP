<template>
	<view class="full-content" id="order-detail-root">
		<!-- <u-navbar class="nav-bar" title="工单详情" @leftClick="back"></u-navbar> -->
		<view class="order-info">
			<view class="name">{{ projectInfo.name }}</view>
			<view :class="['info', showMore ? 'show-more' : 'show-less']">
				<template v-for="(item,key) in projectInfo">
					<view class="item" :key="item" v-if="key !== 'name'">
						<u-icon :name="getIconByKey(key)" size="28" class="icon"></u-icon>
						<view class="info-box">
							<text class="label">{{getLabelByKey(key)}}：</text>
							<text>{{item}}</text>
						</view>
					</view>
				</template>
			</view>
			<view class="btn-wrapper">
				<span class="btn-item" @click="isShowFilePanel = true">附件</span>
				<span class="btn-item" @click="handleSkipToIssue">查看问题</span>
			</view>
		</view>
		<view class="bottom-content">
			<u-tabs :list="tabData" @change='handleTabChange' :activeStyle="{
            color: '#323233',
            fontWeight: 'bold',
            transform: 'scale(1.05)'
        }" :inactiveStyle="{ color: '#657685'}" lineWidth='30'></u-tabs>
			<component :is="componentName" />
		</view>
		<!-- 附件下载面板 -->
		<u-action-sheet :show="isShowFilePanel" title="附件" :closeOnClickOverlay="true" :closeOnClickAction="true"
			@close='isShowFilePanel= false'>
			<u-cell-group class="file-list">
				<u-cell v-for="file in fileList" :title="file.name" :key="file.id" size="large"
					@click="handleDownFile(file)">
					<text slot="value"><u-icon name="setting-fill" title="下载" class="download-icon" /></text>
				</u-cell>
			</u-cell-group>
		</u-action-sheet>
	</view>
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
					}
				],
				showMore: true,
				fieldMapText: {
					productNo: {
						label: '生产号',
						icon: 'chat'
					},
					manager: {
						label: '项目经理',
						icon: 'chat'
					},
					category: {
						label: '产品大类',
						icon: "chat"
					},
					voltageLevel: {
						label: '电压等级',
						icon: 'chat'
					},
					status: {
						label: '工作状态',
						icon: "chat"
					},
					planTime: {
						label: '计划开始/结束时间',
						icon: 'chat'
					},
					actualTime: {
						label: '实际开始/结束时间',
						icon: 'chat'
					},
				},
				// 当前展示的列表组件
				componentName: 'ProcessList'
			};
		},
		onReady() {
			this.handleTouchAnimation();
		},
		methods: {
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
				return (this.fieldMapText[key] && this.fieldMapText[key].icon) || "";
			},
			// 返回
			back() {
				debugger
				window.history.go(-1);
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
		}
	};
</script>
<style lang="scss" scoped>
	@import './index.scss';

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
			margin-bottom: 28rpx;
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
				font-size: 24rpx;
				cursor: pointer;
			}

			:last-child {
				border-right: none;
			}
		}

		.bottom-content {
			height: calc(100% - 556rpx);

			/deep/ .u-tabs {
				padding: 0 32rpx;
				margin-bottom: 10rpx;
			}
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