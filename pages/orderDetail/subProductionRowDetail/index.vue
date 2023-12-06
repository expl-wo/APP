<template>
	<view class="sub-pro-row">
		<view class="top-wrapper">
			<!-- 工序名称 -->
			<view class="info">
				<view class="name">{{ subProductionRowName }}</view>
				<view class="extra-info">
					<text class="notice" @click="isShowTip = true">工序要求</text>
					<u-icon class="icon" name="pushpin-fill" size="16" color="#3a62d7" @click="handleAddIssue" />
				</view>
			</view>
			<!-- 工单详情 -->
			<ProductionInfo :fieldMapText="fieldMapText" :infoObj="detailInfo" style="height: auto;" />
			<!-- 用户信息 -->
			<UserInfo style="padding: 16px" fontColor='#000' :userInfo="userInfo">
				<view class="sign-time">
					<text :title='signInTime' v-if='signInTime' style="margin-right: 10px;">签到：{{signInTime}}</text>
					<text v-if='signOutTime'>签退：{{signOutTime}}</text>
				</view>
			</UserInfo>
			<view class="sign-box">
				<u-button type="primary" class="sign-btn" @click="handleSign('signIn')" :disabled="!!signInTime"
					text="签到"></u-button>
				<u-button type="primary" class="sign-btn" text="签退" @click="handleSign('signOut')"></u-button>
			</view>
		</view>
		<!-- 自定义表单 -->
		<CustomForm :formList='formList' />
		<!-- 按钮 -->
		<view class="btn-box">
			<view class="left-btn">
				<view :class="['btn', havePre?'enable-btn':'disabled-btn']" @click="showPre">
					<u-icon name="arrow-left" size="30" bold></u-icon>
				</view>
				<view :class="['btn', haveNext?'enable-btn':'disabled-btn']" @click="showNext">
					<u-icon name="arrow-right" size="30" bold></u-icon>
				</view>
			</view>
			<view class="right-btn" @click="showProveSheet">{{btnText}}</view>
		</view>
		<!-- 复核面板 -->
		<u-picker title='是否合入问题库' :show="isShowProvePicker" :columns="proveColumns" :closeOnClickOverlay='true'
			@close='isShowProvePicker=false' @cancel='isShowProvePicker=false' @confirm='proveConfirm'></u-picker>
		<Notice :show="isShowTip" title="工序要求" :content="tip" @closeNotice="isShowTip = false" />
	</view>
</template>

<script>
	import ProductionInfo from "@/components/common/info.vue";
	import CustomForm from '@/components/common/form.vue';
	import UserInfo from '@/components/common/user-info.vue';
	import Notice from '@/components/common/notice.vue';
	import moment from 'moment'
	import {
		getCurrRole,
		getUserInfo
	} from '@/utils/auth.js'
	import {
		mapState
	} from 'vuex'
	import {
		getMesWorkContent,
		setMesWorkContent,
		proveConfirmApi,
		queryBatchRecord
	} from "@/https/staging/index.js";
	export default {
		name: "ProcessDetail",
		components: {
			ProductionInfo,
			CustomForm,
			UserInfo,
			Notice
		},
		computed: {
			...mapState("workOrder", ['workOrderDatialInfo']),
		},
		data() {
			return {
				// 工序内容列表
				formList: [],
				// 字段与文本映射
				fieldMapText: {
					groupPerson: {
						label: "组长",
						iconName: "account-fill"
					},
					subGroupPerson: {
						label: "副组长",
						iconName: "account-fill"
					},
					member: {
						label: "成员",
						iconName: "account-fill"
					}
				},
				// 当前选中工序名称
				subProductionRowName: "工序名称",
				// 工序行详情id
				subProductionRowId: "",
				// 工序详情信息
				detailInfo: {
					groupPerson: "司马懿",
					subGroupPerson: "干酒",
					member: "成员",
				},
				// 工序标准
				tip: "sssss",
				isShowActionSheet: false,
				// 操作面板对象
				actionSheetObj: {},
				// 按钮文字-根据用户信息显示不同操作
				btnText: '开工',
				// 是否能上一项
				havePre: false,
				// 是否有下一项
				haveNext: true,
				// 用户信息
				userInfo: {
					name: '张晓丽',
					department: '流程与信息化管理部',
					imgUrl: 'XXX',
				},
				// 签出时间
				signInTime: '',
				// 签退时间
				signOutTime: '',
				// 展示审核面板
				isShowProvePicker: false,
				// 问题审核
				proveColumns: [
					['否', '是']
				],
				isShowTip: false,
				// 工序标准
				tip: "<h4>测试</h4><br>",
				showCustomSheet: false,
			};
		},
		mounted() {
			this.initData();
		},
		methods: {
			/**
			 * @method initData 初始化数据
			 **/
			initData() {
				const userInfo = getUserInfo();
				// 按钮权限控制
				this.btnText = userInfo.id ? '复核' : '开工';
				// 工单详情
				this.detailInfo = {
					groupPerson: this.workOrderDatialInfo.projManagerName,
					subGroupPerson: this.workOrderDatialInfo.duputyManagerName,
					member: this.workOrderDatialInfo.taskTeamName,
				};
				// 工序工作内容
				setMesWorkContent({
					craftId: 20231125
				}).then(res => {
					if (res && res.data) {
						const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
						const params = []
						res.data.value.forEach(item => {
							params.push({
								workCode: this.workOrderDatialInfo.id ||
									"20220705093359824311000301954583",
								craftCode: "20231125",
								operationCode: item.operationCode,
								workScene: "SURVEY_SCENE", // 子工序对应的场景编码
								executionFrequency: item.executionFrequency,
								beginTime: currentTime
							})
						})
						queryBatchRecord([{
							"workCode": "20220705093359824311000301954583",
							"craftCode": "20231125",
							"operationCode": "5",
							"workScene": "SURVEY_SCENE",
							"executionFrequency": "0",
							"beginTime": "2023-12-05 19:30:47"
						}, {
							"workCode": "20220705093359824311000301954583",
							"craftCode": "20231125",
							"operationCode": "4",
							"workScene": "SURVEY_SCENE",
							"executionFrequency": "1",
							"beginTime": "2023-12-05 19:30:47"
						}]).then(res => {
							if (res && res.data && Array.isArray(res.data.value)) {
								res.data.value.forEach((item, index) => {
									item.fileList = item.fileList.filter(f => f.fileType === 'jpg')
								})
								this.formList = res.data.value || []
								console.log(res, 'formList', this.formList)
							}
						})
					}
				})
			},
			/**
			 * @method showPre 展示上一条
			 **/
			showPre() {

			},
			/**
			 * @method showPre 展示下一条
			 **/
			showNext() {

			},
			/**
			 * @method showProveSheet 显示复核面板
			 **/
			showProveSheet() {
				this.isShowProvePicker = true
			},
			hourConfirm() {},
			proveConfirm(value) {
				const param = {
					craftId: this.craftId || 1,
					pass: value.indexs[0], // 0：复核不通过，1：复核通过
				}
				proveConfirmApi(param).then(res => {
					debugger
					if (res) {

					}
				})
			},
			handleSign(type) {
				if (type === 'signIn') {
					this.signInTime = moment().format('YYYY-MM-DD HH:mm:ss');
				} else {
					this.signOutTime = moment().format('YYYY-MM-DD HH:mm:ss');
				}
			},
			handleAddIssue() {
				uni.navigateTo({
					url: '/pages/orderDetail/addIssue'
				});
			}
		},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/css/staging/index.scss';

	.sub-pro-row {
		width: 100%;
		height: calc(100% - 83rpx);
		background: url("@/assets/imgs/staging/staging-bg.png") no-repeat center;
		background-size: 100% 100%;
		font-size: $fontSize;

		.top-wrapper {
			// height: 140px;
			position: relative;
			margin: 10px 16rpx 20px;
			padding: 0 16rpx;
			background-color: #fff;
			border-radius: 10rpx 10rpx 0 0;

			.info {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 40px;
				line-height: 40px;

				.name {
					// font-size: $fontSize;
					font-size: 20px;
				}

				.extra-info {
					display: flex;
					align-items: center;
					justify-content: center;

					.notice {
						color: #3a62d7;
						font-size: $smallFontSize;
					}

					.icon {
						margin-left: 16rpx;
						color: #3a62d7;
					}
				}
			}

			.sign-box {
				position: absolute;
				top: 108px;
				right: 20rpx;
				display: flex;
				text-align: center;
				color: #fff;
				font-size: $smallFontSize;
				line-height: 40rpx;

				.sign-btn {
					width: 80rpx;
					height: 40rpx;
					border-radius: 16rpx;
					margin: 0 6rpx;
				}
			}

			.sign-time {
				margin-top: 10rpx;
				font-size: $minFontSize;
				color: #445160;

				&:first-child {
					margin-right: 10rpx;
				}
			}
		}


		.btn-box {
			position: absolute;
			left: 0;
			bottom: 0;
			padding: 10rpx 0;
			width: 100%;
			display: flex;
			justify-content: space-around;
			background-color: #fff;
			text-align: center;

			.left-btn {
				width: 144rpx;
				height: 60rpx;
				display: flex;
				justify-content: space-between;

				.btn {
					width: 60rpx;
					height: 60rpx;
					line-height: 60rpx;
					border-radius: 16rpx;
					border: solid 2rpx rgba(58, 98, 215, 0.5);
					text-align: center;
				}

				.disable-btn {
					border: solid 1rpx rgba(58, 98, 215, 0.5);
				}

				.enable-btn {
					background-color: #e3ebfb;
				}
			}

			.right-btn {
				width: 300rpx;
				height: 60rpx;
				line-height: 60rpx;
				background-color: #3a62d7;
				border-radius: 16rpx;
				font-size: $fontSize;
				color: #fff;
			}

			view {
				display: inline-block;
				border-radius: 8rpx;
			}

		}
	}
</style>