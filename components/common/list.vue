<template>
	<view class="list-root">
		<view class="list-item" v-for="(item, index) in listData" :key="index" @click="skipSubProcessDetail(item)">
			<view class="production-title">
				<text>{{ item.subProcessName }}</text>
				<text class="prove-status" :style="{ color: ['#f64930', '#17aa81'][item.proveStatus] }">
					{{ ["未审核", "已审核"][item.proveStatus] }}
				</text>
			</view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "List",
		props: {
			listData: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {
				list: [],
				loading: false,
				finished: false,
				refreshing: false,
			};
		},
		methods: {
			skipSubProcessDetail(item) {
				this.$emit("skip", item.id);
			},
		},
	};
</script>

<style lang="less" scoped>
	.list-root {
		height: 700px;
		margin-bottom: 10px;
		overflow-y: auto;
		background-color: #f7f5f5;

		.list-item {
			height: 77px;
			padding: 16px;
			box-sizing: border-box;
			background: url("@/assets/imgs/staging/list-bg.png") no-repeat center;
			background-size: 125% 150%;

			.production-title {
				display: flex;
				justify-content: space-between;
				margin-bottom: 8px;
				font-size: 14px;
				color: #445160;

				.prove-status {
					margin-right: 23px;
					font-size: 12px;
				}
			}

			.name {
				margin-bottom: 8px;
			}
		}

		&:nth-of-type(odd) {
			border-right: solid 1px rgba(101, 118, 133, 0.11);
		}
	}
</style>