<template>
	<view class="process-detail-root">
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
					<view class="progress">
						<Progress :progressObj="{value:item.percentage,percentage:' 50%',total:100}" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Progress from "@/components/common/progress.vue";
	import {
		getProcessList
	} from "@/https/staging/index.js";
	import {
		WORK_ORDER_FIELD_MAP
	} from '@/utils/constants-custom.js'
	import {
		mapState
	} from 'vuex'
	export default {
		name: "ProcessDetail",
		components: {
			Progress,
		},
		computed: {
			...mapState("workOrder", [
				// 工单详情信息
				'workOrderDatialInfo'
			])
		},
		data() {
			return {
				// 大工序详情id
				processId: "",
				// 字段与文本映射
				fieldMapText: WORK_ORDER_FIELD_MAP,
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
				pageNum: 1
			};
		},
		onLoad(options) {
			debugger
			console.log(options, 'options')
			this.getDetailInfoById(options);
		},
		methods: {
			/**
			 * @method getDetailInfoById 获取详情信息
			 **/
			getDetailInfoById(options) {
				// this.processDetailInfo = {
				// 	...this.workOrderDatialInfo
				// };
				const param = {
					pageNum: this.pageNum,
					pageSize: 10,
					workCode: 1001,
					workProcedureType: 1, // 0-根节点, 1-标准工序,2-中工序,3-工步,4-内容工序,
					// workProcedureType: options.workProcedureType
				};
				getProcessList(param).then(res => {
					debugger
					if (res.data && res.data.pageList) {
						this.listData = res.data.pageList.map(item => ({
							title: item.workProcedureName,
							...item
						}))
					}
				})
			},
			/**
			 * @method getIconByKey 根据字段key获取图标
			 * @param {String} 字段key
			 **/
			getIconByKey(key) {
				return this.fieldMapText[key] && this.fieldMapText[key].iconName || "";
			},
			/**
			 * @method getLabelByKey 根据字段获取label
			 * @param {String} 字段key
			 **/
			getLabelByKey(key) {
				return this.fieldMapText[key] && this.fieldMapText[key].label || "";
			},
			// 跳转到工序详情界面
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
			// background-color: #fff;
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
				height: 740px;
				overflow-y: auto;
				// background: #f7f5f5;

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