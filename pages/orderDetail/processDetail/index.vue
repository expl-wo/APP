<template>
	<view class="process-detail-root">
		<!-- <u-navbar title="大工序详情" left-arrow @tap-left="handleBack" class="nav-bar" /> -->
		<view class="process-content">
			<view class="process-info">
				<view class="process-name title">{{ processName }}</view>
				<view class="info">
					<view class="info-item" :key="item" v-for="(item, key) in processDetailInfo">
						<u-icon :name="getIconByKey(key)" v-if="getIconByKey(key)" class="icon" size='30' />
						<text class="label">{{ getLabelByKey(key) }}:</text>
						<text class="value" :title="item">{{ item || "--" }}</text>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="list-item" v-for="(item, index) in listData" :key="index"
					@tap="skipProductionDetail(item)">
					<view class="process-title">
						<text class="name">{{ item.subProcessName }}</text>
						<text class="prove-status" :style="{ color: ['#f64930', '#17aa81'][item.proveStatus] }">
							{{ ["未审核", "已审核"][item.proveStatus] }}
						</text>
					</view>
					<!-- <view class="name">{{ item.subProcessName }}</view> -->
					<view class="progress">
						<Progress />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Progress from "@/components/common/progress.vue";
	export default {
		name: "ProcessDetail",
		components: {
			Progress,
		},
		data() {
			return {
				// 大工序详情id
				processId: "",
				// 字段与文本映射
				fieldMapText: {
					code: {
						label: "工序编码",
						iconName: "photo"
					},
					groupPerson: {
						label: "组长",
						iconName: "photo"
					},
					subGroupPerson: {
						label: "副组长",
						iconName: "photo"
					},
					member: {
						label: "成员",
						iconName: "photo"
					},
					planTime: {
						label: "计划开工/完工时间",
						iconName: "photo"
					},
					realTime: {
						label: "实际开工/完工时间",
						iconName: "photo"
					},
				},
				processName: "大工序名称",
				// 大工序详情信息
				processDetailInfo: {
					code: "XXXXX",
					groupPerson: "司马懿",
					subGroupPerson: "干酒",
					member: "成员",
					planTime: "2023/02/13~2023/02/14",
					realTime: "2023/02/13~2023/02/14",
				},
				// 工序列表数据
				listData: [{
						subProcessName: "子工序名称",
						proveStatus: 0,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 0,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
					{
						subProcessName: "子工序名称",
						proveStatus: 1,
						percentage: 50,
					},
				],
			};
		},
		mounted() {
			this.getProcessId();
		},
		activated() {
			this.getProcessId();
		},
		methods: {
			/**
			 * @method getProcessId 获取大工序详情id
			 **/
			getProcessId() {
				const {
					id
				} = this.$route.params;
				if (id || this.processId) {
					this.processId = id;
				} else {
					// 返回上一级路由
					// window.history.go(-1);
				}
			},
			/**
			 * @method getDetailInfoById 获取详情信息
			 **/
			getDetailInfoById() {},
			/**
			 * @method handleBack 处理导航返回
			 **/
			handleBack() {
				window.history.go(-1);
			},
			/**
			 * @method getIconByKey 根据字段key获取图标
			 * @param {String} 字段key
			 **/
			getIconByKey(key) {
				return this.fieldMapText[key].iconName || "";
			},
			/**
			 * @method getLabelByKey 根据字段获取label
			 * @param {String} 字段key
			 **/
			getLabelByKey(key) {
				return this.fieldMapText[key].label || "";
			},
			skipProductionDetail(process) {
				const url = `/pages/orderDetail/productionDetail/index?id=${process.id}`
				uni.navigateTo({
					url
				})
			},
		},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/css/staging/index.scss';

	.process-detail-root {
		// height: calc(100% - 83rpx);
		background: linear-gradient(282deg,
				rgba(209, 225, 246, 0.1) 0%,
				rgba(209, 225, 246, 0.8) 70%);

		.nav-bar {
			background: unset;
		}

		.process-content {
			height: calc(100% - 83rpx);
			margin: 20rpx 16rpx 0rpx;
			background-color: #fff;
			border-radius: 10rpx;
			overflow: hidden;

			.process-info {
				margin: 16rpx 16rpx 20rpx;
				font-size: $fontSize;

				.process-name {
					display: flex;
					margin-bottom: 12rpx;
					font-size: $titleFontSize;
				}

				.info {
					color: $color;

					.info-item {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;

						.label {
							margin: 0 16rpx 0 8rpx;
						}

						.icon {
							display: inline-block;
						}

						&:not(:last-child) {
							margin-bottom: 5rpx;
						}
					}
				}
			}

			.list {
				overflow-y: auto;
				background: #f7f5f5;

				.list-item {
					width: 49%;
					height: 120rpx;
					padding: 16rpx;
					box-sizing: border-box;
					float: left;
					background: url("@/assets/imgs/staging/list-bg.png") no-repeat center;
					background-size: 125% 150%;

					.process-title {
						display: flex;
						justify-content: space-between;
						margin-bottom: 28rpx;
						font-size: $smallFontSize;
						color: #445160;

						.name {
							font-size: $fontSize;
						}

						.prove-status {
							font-size: $smallFontSize;
						}
					}

					&:nth-of-type(odd) {
						margin-right: 2%;
					}
				}
			}
		}
	}
</style>