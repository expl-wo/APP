<template>
	<view class="info-root">
		<view class="info-item" :key="item" v-for="(item, key) in infoObj">
			<van-icon :name="getIconByKey(key)" v-if="getIconByKey(key)" />
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

<style lang="less" scoped>
	.info-root {
		margin: 0px 16px;
		padding-bottom: 12px;
		border-bottom: solid 1px rgba(101, 118, 133, 0.11);

		.info-item {
			.label {
				margin: 0 16px 0 8px;
			}

			&:not(:last-child) {
				margin-bottom: 5px;
			}
		}
	}
</style>