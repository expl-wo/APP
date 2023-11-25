<template>
	<u-popup :show="show" :closeOnClickOverlay="false" round="8" mode="center">
		<view class="popup-wrapper">
			<view class="title">{{ title }}</view>
			<view class="content" v-html="content" />
			<view class="btn-wrapper">
				<u-button class="btn" type="primary" text="确定" @click="close"></u-button>
			</view>
		</view>
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
				default: '标题'
			},
			content: {
				type: String,
				default: ''
			}
		},
		methods: {
			close() {
				this.$emit('closeNotice');
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-popup__content {
		width: 80%;
	}
	.title {
		height: 60px;
		line-height: 60px;
		font-size: 20px;
		text-align: center;
	}
	.content {
		max-height: 400px;
		overflow-y: auto;
		padding: 20rpx;
	}
	.btn-wrapper {
		padding: 20px 0;
		.btn {
			    width: 50%;
				height: 40px;
			    margin: 0 auto;
		}
	}
</style>