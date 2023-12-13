<template>
	<view class="card-root">
		<view class="card-head">
			<span class="title ellipse">{{ cardInfo[title] || '--' }}</span>
			<span class="status" v-if="cardInfo['status']"
				:style="{color:getColor(cardInfo['status']),backgroundColor:getBackgroundColor(cardInfo['status'])}">
				{{getStatusStr(cardInfo["status"])}}
			</span>
		</view>
		<view :class="['card-body', isShowMore ? 'show-more' : 'show-less']">
			<template v-for="(item, key) in cardInfo">
				<view v-if="Object.keys(fieldMapText).includes(key)" class="info-item" :key="item"
					:style="{ width: itemWidth }">
					<view class="info">
						<u-icon :name="getIconByKey(key)" v-if="getIconByKey(key)" color="#2979ff" size="24"
							class="icon"></u-icon>
						<span class="label">{{ getLabelByKey(key)}}:</span>
						<span class="value">{{ item || '--'}}</span>
					</view>
				</view>
			</template>
			<view class="extra">
				<!-- 图片列表 -->
				<view class="img-box" v-if="cardInfo['imgList']">
					<view class="img-item" v-for="img in cardInfo['imgList']" :key="img">
						<u--image :showLoading="true" :src="getUrl(img)" width="80px" height="80px"
							@click="showModal(img,'img')"></u--image>
					</view>
				</view>
				<!-- 视频列表 -->
				<view class="img-box" v-if="isShowMore && cardInfo['videoList']">
					<view class="img-item" v-for="(video,index) in cardInfo['videoList']" :key="video"
						@click="showModal(video,'video')">
						<video :src="getUrl(video)" controls style="widht:80px;height: 80px;"></video>
					</view>
				</view>
			</view>
			<view v-if="Object.keys(fieldMapText).length > 4" class="show-more-icon" :title="isShowMore ? '收起' : '展开'"
				@click.stop="handleShowMore">
				<u-icon :name="isShowMore ? 'arrow-up' : 'arrow-down'" />
			</view>
		</view>
		<slot></slot>
		<!-- 展示视频图片模态框 -->
		<u-modal v-model="isShowModal" width="300px">
			<view class="slot-content">
				<u--image :showLoading="true" :src="currentUrl"></u--image>
				<video :src="currentUrl" controls></video>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		ORDER_STATUS_MAP
	} from '@/utils/constants-custom.js'
	export default {
		props: {
			// 卡片展示字段信息
			cardInfo: {
				type: Object,
				default: () => ({}),
			},
			// 字段对应文本映射
			fieldMapText: {
				type: Object,
				default: () => ({}),
			},
			// 标题展示字段
			title: {
				type: String,
				default: "title",
			},
			// 每个字段展示的宽度
			itemWidth: {
				type: String,
				default: "90%",
			},
		},
		data() {
			return {
				isShowMore: false,
				currentUrl: '',
				currentUrl: '',
				isShowModal: true,
			};
		},
		methods: {
			/**
			 * @method getIconByKey 根据字段key获取图标
			 * @param {String} 字段key
			 **/
			getIconByKey(key) {
				return (this.fieldMapText[key] && this.fieldMapText[key].iconName) || "";
			},
			/**
			 * @method getLabelByKey 根据字段获取label
			 * @param {String} 字段key
			 **/
			getLabelByKey(key) {
				return (this.fieldMapText[key] && this.fieldMapText[key].label) || "";
			},
			/**
			 * @method handleShowMore 处理展开和收起
			 **/
			handleShowMore() {
				this.isShowMore = !this.isShowMore;
			},
			/**
			 * @method getStatusStr 获取状态字符串
			 **/
			getStatusStr(status) {
				return ORDER_STATUS_MAP[status - 1].text
			},
			/**
			 * @method getColor 获取文字颜色
			 **/
			getColor(status) {
				return ORDER_STATUS_MAP[status - 1].color
			},
			/**
			 * @method getBackgroundColor 获取背景色
			 **/
			getBackgroundColor(status) {
				return ORDER_STATUS_MAP[status - 1].backgroundColor
			},
			getUrl(img) {
				return 'http://10.16.9.128:9000/' + img;
			},
			showModal(item, type) {
				const url = this.getUrl(item);
				this.currentUrl = url;
				this.isShowModal = true;
			}
		},
	};
</script>

<style scoped lang="scss">
	@import '@/assets/css/staging/index.scss';

	.card-root {
		padding: 20rpx;
		border-radius: 16rpx;
		background: url("@/assets/imgs/staging/list-bg.png") no-repeat center;
		background-size: 125% 150%;

		.card-head {
			display: flex;
			margin-bottom: 12rpx;

			.title {
				display: inline-block;
				margin-right: 10rpx;
				font-size: $fontSize;
				color: #445160;
			}

			.type {
				min-width: 60rpx;
				margin: 0 4rpx;
				height: 24rpx;
				line-height: 24rpx;
				background-color: rgba(101, 118, 133, 0.1);
				border-radius: 12rpx;
				border: solid 1rpx rgba(101, 118, 133, 0.2);
				text-align: center;
			}

			.status {
				margin: 0 8rpx;
				padding: 0 16rpx;
				border-radius: 24rpx;
				/* 默认背景色 */
				background-color: #e0f8f1;
				font-size: $minFontSize;
				text-align: center;
				/* 默认颜色 */
				color: #17aa81;
			}
		}

		.card-body {
			display: flex;
			flex-wrap: wrap;
			position: relative;
			overflow: hidden;
			transition: all 0.5s linear;
			font-size: $minFontSize;

			.info-item {
				&:not(:last-child) {
					margin-bottom: 10rpx;
				}

				.info {
					.label {
						margin: 0 10rpx;
					}

					.icon {
						display: inline-block;
					}
				}
			}

			.show-more-icon {
				position: absolute;
				padding: 20rpx;
				right: 0;
				bottom: 0;
				font-size: $bigFontSize;
			}

			.extra {
				display: flex;
				max-height: 80px;
				margin-bottom: 10rpx;

				.img-box {
					.img-item {
						margin-right: 10px;
					}

					/deep/ .uni-video-container {
						width: 80px;
						height: 80px;
					}
				}
			}
		}

		.show-more {
			// 用max-height可以高度使自适应，设置高度要大于实际元素高度
			max-height: 320px;
		}

		.show-less {
			// 展示四个字段的高度
			max-height: 134px;
		}
	}
</style>