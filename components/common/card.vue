<template>
	<view class="card-root">
		<view class="card-head">
			<span class="title ellipse">{{ cardInfo[title] }}</span>
			<span class="status" v-if="cardInfo['status']">
				{{ cardInfo["status"] }}
			</span>
		</view>
		<view :class="['card-body', isShowMore ? 'show-more' : 'show-less']">
			<template v-for="(item, key) in cardInfo">
				<view v-if="!['status', 'title', 'id'].includes(key)" class="info-item" :key="item"
					:style="{ width: itemWidth }">
					<view class="info">
						<u-icon :name="getIconByKey(key)" v-if="getIconByKey(key)" color="#2979ff" size="28"
							class="icon"></u-icon>
						<span class="label">{{ getLabelByKey(key) }}:</span>
						<span class="value">{{ item }}</span>
					</view>
				</view>
			</template>
			<view v-if="Object.keys(fieldMapText).length > 4" class="show-more-icon" :title="isShowMore ? '收起' : '展开'"
				@click.stop="handleShowMore">
				<u-icon :name="isShowMore ? 'arrow-up' : 'arrow-down'" />
			</view>
		</view>
		<slot></slot>
	</view>
</template>

<script>
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
			// 圆角样式
			showBottomRadius: {
				type: Boolean,
				default: true,
			},
		},
		mounted() {
			console.log(this.cardInfo, this.fieldMapText, "card");
		},
		data() {
			return {
				isShowMore: false,
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
		},
	};
</script>

<style scoped lang="less">
	.card-root {
		padding: 32rpx;
		border-radius: 16rpx;
		background: url("@/assets/imgs/staging/list-bg.png") no-repeat center;
		background-size: 125% 150%;

		.card-head {
			display: flex;
			margin-bottom: 24rpx;

			.title {
				display: inline-block;
				margin-right: 10rpx;
				font-size: 32rpx;
				color: #445160;
				// font-weight: bold;
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
				min-width: 80rpx;
				margin: 0 8rpx;
				height: 48rpx;
				padding: 0 10rpx;
				line-height: 48rpx;
				border-radius: 24rpx;
				background-color: #e0f8f1;
				font-size: 28rpx;
				text-align: center;
				color: #17aa81;
			}
		}

		.card-body {
			display: flex;
			flex-wrap: wrap;
			position: relative;
			overflow: hidden;
			transition: all 0.5s linear;

			.info-item {
				&:not(:last-child) {
					margin-bottom: 10rpx;
				}

				.info {
					font-size: 24rpx;

					.label {
						margin: 0 10rpx;
					}

					.icon {
						display: inline-block;
						vertical-align: text-bottom;
					}
				}
			}

			.show-more-icon {
				position: absolute;
				padding: 20rpx;
				right: 0;
				bottom: -10rpx;
				font-size: 40rpx;
			}
		}

		.show-more {
			// 用max-height可以高度使自适应，设置高度要大于实际元素高度
			max-height: 600rpx;
		}

		.show-less {
			// 展示四个字段的高度
			max-height: 210rpx;
		}
	}
</style>