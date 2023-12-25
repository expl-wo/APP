<template>
	<u-modal class="cust-modal" title="预览" :show="show" confirmText="关闭" @confirm="confirm" >
		<view class="slot-content">
			<video id="previewVideo" class="video" :src="src" controls autoplay />
		</view>
	</u-modal>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			src: {
				type: String,
				default: ''
			}
		},
		methods: {
			// 关闭
			confirm() {
				this.$emit('closeModal');
			},
		}
	}
</script>

<style lang="scss" scoped>
	.cust-modal /deep/ .u-modal__title {
		margin-bottom: 0;
	}
	.slot-content {
		width: 100%;

		.video {
			width: 100%;
			height: 200px;
		}
	}
</style>