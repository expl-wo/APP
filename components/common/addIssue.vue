<template>
	<u-popup round="8" mode="bottom" :show="show" :closeOnClickOverlay="false">
		<view class="popup-top">
			<text>取消</text>
			<text class="title">{{ title }}</text>
			<text class="confirm">确定</text>
			
		</view>
		<u-form
			labelPosition="left"
			:model="issueForm"
			:rules="rules"
			ref="issueForm"
		>
		
		</u-form>
	</u-popup>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: '请选择'
			}
		},
		data() {
			return {
				issueForm: {
					
				}
			}
		},
		methods: {
			close() {
				this.$emit('closeAddPopup');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-top {
		display: flex;
		justify-content: space-between;
		height: 40px;
		line-height: 40px;
		padding: 0 16rpx;
		border: 1px solid red;
		font-size: 16px;
		.title {
			font-weight: bold;
		}
		.confirm {
			color: #2979ff;
		}
	}
</style>