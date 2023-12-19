<template>
	<u-modal :show="show" :showCancelButton="true" title="修改数量" @confirm="confirm" @cancel="cancel" ref="uModal" :asyncClose="true">
		<view class="slot-content">
			<u--input type="number" border="surround" v-model="value" />
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
			num: {
				type: Number,
				default: null
			}
		},
		data() {
			return {
				value: ''
			}
		},
		watch: {
			show(newVal, oldVal) {
				if (newVal) {
					this.value = this.num;
				}
			}
		},
		methods: {
			confirm() {
				this.$emit('modalConfirm', this.value);
			},
			cancel() {
				this.$emit('closeModal', 'material', false);
			}
		},
	}
</script>

<style lang="scss" scoped>
</style>