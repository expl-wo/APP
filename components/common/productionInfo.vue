<template>
	<view class="info-root">
		<view class="info-item" :key="item + Math.random(9999)" v-for="(item, key) in infoObj">
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
		font-size: 16px;

		.info-item {
			height: 30px;
			line-height: 30px;

			.icon {
				display: inline-block;
			}

			.label {
				margin: 0 8px;
			}
		}

		.info-item:last-child {
			margin-bottom: 4px;
			width: 90%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
</style>