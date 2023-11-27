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
			<view class="btn-wrapper">
				<span class="btn-item" @click="isShowFilePanel = true">附件</span>
				<span class="btn-item" @click="handleSkipToIssue">查看问题</span>
			</view>
		</view>
		<!-- 附件下载面板 -->
		<u-action-sheet :show="isShowFilePanel" title="附件" :closeOnClickOverlay="true" :closeOnClickAction="true"
			@close='isShowFilePanel= false'>
			<u-cell-group class="file-list">
				<u-cell v-for="file in fileList" :title="file.name" :key="file.id" size="large"
					@click="handleDownFile(file)">
					<text slot="value"><u-icon name="download" title="下载" class="download-icon" size="28"
							color="#3a62d7" /></text>
				</u-cell>
			</u-cell-group>
		</u-action-sheet>
	</view>
</template>
<script>
	import {
		getWorkOrderDetailById
	} from "@/https/staging/index.js";
	export default {
		data() {
			return {
				ke: value
			}
		},
		onLoad(options) {
			debugger
			console.log(options)
			const params = this.$route.params
			this.type = params.type
			this.handleTouchAnimation();
			options.id && this.getDetailInfoById(options.id);
		},
		methods: {
			/**
			 * @method getDetailInfoById 根据id获取详情
			 **/
			getDetailInfoById(id) {
				getWorkOrderDetailById(id).then(res => {
					debugger
					if (res.data) {
						this.projectInfo = {
							name: res.data.projName,
							productNo: res.data.productNo,
							projManagerName: res.data.projManagerName,
							prodCategory: res.data.prodCategory,
							voltageLevel: res.data.voltageLevel,
							orderStatus: res.data.orderStatus,
							planTime: `${res.data.planStartTime || ''} - ${res.data.planEndTime || ''}`,
							actualTime: `${res.data.createTime || ''} - ${res.data.planEndTime || ''}`,
						}
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
				return (this.fieldMapText[key] && this.fieldMapText[key].icon) || "";
			},
			// 返回
			back() {
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
	@import '@/assets/css/staging/index.scss';

	.sub-pro-row {
		width: 100%;
		height: 1624rpx;
		overflow: hidden;
		background: linear-gradient(rgba(209, 225, 246, 0.8) 0%,
				rgba(209, 225, 246, 0) 70%);

		.nav-bar {
			background-color: unset;
		}

		.uni-page-head {}

		.order-info {
			margin-bottom: 28rpx;
		}

		.name {
			padding: 0 32rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: $titleFontSize;
		}

		.info {
			padding: 0 32rpx;
			pointer-events: none;

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