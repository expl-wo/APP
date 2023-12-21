<template>
	<view class="info-root">
		<view class="info-item" :key="key" v-for="(item, key) in infoObj">
			<u-icon class="icon" v-if="getIconByKey(key)" :name="getIconByKey(key)" />
			<text class="label">{{ getLabelByKey(key) }}:</text>
			<text class="value">{{ item }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 展示字段信息
			infoObj: {
				type: Object,
				default: () => ({}),
			},
			// 字段对应文本映射
			fieldMapText: {
				type: Object,
				default: () => ({}),
			},
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
		},
	};
</script>

<style lang="scss" scoped>
	.info-root {
		margin: 0px 16px;
		// padding-bottom: 24rpx;
		border-bottom: 1px solid rgba(101, 118, 133, 0.11);
		font-size: 16px;
		.info-item {
			height: 20px;
			line-height: 20px;
			.icon {
				display: inline-block;
			}
			.label {
			// 	margin: 0 16rpx;
			}

			&:not(:last-child) {
			// 	margin-bottom: 4rpx;
			}
		}
	}
</style>