<template>
	<view class="sub-pro-row">
		<view class="top-wrapper">
			<view class="info">
				<view class="name">{{ subProductionRowName }}</view>
				<view class="extra-info">
					<text class="notice" @click="showNotice">工序要求</text>
					<u-icon class="icon" name="pushpin-fill" size="16" color="#3a62d7" @click="handleAddIssue" />
				</view>
			</view>
			<ProductionInfo :fieldMapText="fieldMapText" :infoObj="detailInfo" style="height: auto;" />
			<UserInfo style="padding: 16px" fontColor='#000' :userInfo="userInfo">
				<view class="sign-time">
					<text>签到：{{signInTime}}</text>
					<text>签出：{{signOutTime}}</text>
				</view>
			</UserInfo>
			<view class="sign-box">
				<view class="sign-in sign-btn" @click="handleSign('signIn')">签到</view>
				<view class="sign-out sign-btn" @click="handleSign('signIn')">签出</view>
			</view>
		</view>
		<CustomForm :haveActionSheet='haveActionSheet' :formList='formList' @showActionSheet='showActionSheet'>
		</CustomForm>
		<view class="btn-box">
			<view class="left-btn">
				<view :class="['btn', havePre?'enable-btn':'disabled-btn']" @click="showPre">
					<u-icon name="arrow-left" size="30" bold></u-icon>
				</view>
				<view :class="['btn', haveNext?'enable-btn':'disabled-btn']" @click="showNext">
					<u-icon name="arrow-right" size="30" bold></u-icon>
				</view>
			</view>
			<view class="right-btn" @click="submit">{{btnText}}</view>
		</view>
		<u-action-sheet :show="isShowActionSheet" :actions="actionSheetObj.actions" :title="actionSheetObj.title"
			:description="isShowActionSheet.description" @close="close" @select="select">
		</u-action-sheet>
		<u-datetime-picker :show="isShowTimePicker" v-model="time" mode="datetime" :closeOnClickOverlay='true'
			@close='close'></u-datetime-picker>
		<u-picker :show="isShowHourPicker" :columns="hourColumns" :defaultIndex='hourDefaultIndex'
			:closeOnClickOverlay='true' title='时间选择' @close='close' @cancel='close'></u-picker>
	</view>
</template>

<script>
	import ProductionInfo from "@/components/common/info.vue";
	import CustomForm from '@/components/common/form.vue';
	import UserInfo from '@/components/common/user-info.vue';
	import {
		getCurrRole,
		getUserInfo
	} from '@/utils/auth.js'
	export default {
		name: "ProcessDetail",
		components: {
			ProductionInfo,
			CustomForm,
			UserInfo
		},
		data() {
			return {
				formList: [{
						title: '记录2',
						formType: 'multSelect',
						time: 'hour',
						type: 'hour',
						showLink: true,
						value: '选项一、选项二',
						actions: [{
								name: '男',
								selected: true
							},
							{
								name: '女',
							}
						]
					},
					{
						title: '记录3',
						formType: 'textArea',
						time: 'day',
						type: 'day',
						showLink: false,
						textArea: '22222',
						value: '内容2',
						textArea: true
					},
					{
						title: '记录4',
						formType: 'textArea',
						time: 'hour',
						type: 'select',
						value: '内容2',
						defaultValue: '14时',
						actions: [{
								name: '男',
							},
							{
								name: '女',
							},
							{
								name: '保密',
							},
						]
					},
				],
				// 工序行详情id
				subProductionRowId: "",
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
				subProductionRowName: "工序名称",
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
				// 当前操作项下标
				currentOperateIndex: null,
				haveActionSheet: false,
				time: Number(new Date()),
				// 展示日期选择器
				isShowTimePicker: false,
				// 展示小时选择器 
				isShowHourPicker: false,
				// 小时列表
				hourColumns: [
					['11时', '12时', '13时', '14时', '15时', '16时']
				],
				// 默认选中项
				hourDefaultIndex: [2],
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
				signInTime: '2023/11/27 10:23:12',
				signOutTime: '2023/11/27 10:23:13',
			};
		},
		onReady() {
			this.getProcessId();
			this.initData()
		},
		methods: {
			/**
			 * @method initData 初始化数据
			 **/
			initData() {
				const userInfo = getUserInfo();
				// 按钮权限控制
				this.btnText = userInfo.id ? '复核' : '开工'
			},
			/**
			 * @method getProcessId 获取工序详情id
			 **/
			getProcessId() {
				const {
					id
				} = this.$route.params;
				if (id || this.subProductionRowId) {
					this.subProductionRowId = id;
					this.getDetailInfoById();
				} else {
					// 返回上一级路由
					// window.history.go(-1);
				}
			},
			/**
			 * @method getDetailInfoById 获取详情信息
			 **/
			getDetailInfoById() {
				// 调用接口获取详情及列表数据
			},
			/**
			 * @method handleBack 处理导航返回
			 **/
			// handleBack() {
			// 	window.history.go(-1);
			// },
			handleChangeTab(name, title) {
				console.log(name, title, "nam");
				this.getListDataByType();
			},
			showTipModal() {
				// Dialog.alert({
				//   message: this.tip || "暂无内容",
				//   theme: "round-button",
				//   confirmButtonColor: "#3a62d7",
				//   width: "80%",
				// }).then(() => {
				//   console.log("确认");
				// });
			},

			showActionSheet({
				currentItem,
				currentOperateIndex,
				actionType
			}) {
				this.haveActionSheet = true
				console.log(currentItem, 'form-item')
				this.actionSheetObj = currentItem;
				this.currentOperateIndex = currentOperateIndex

				if (actionType === 'time') {
					if (currentItem.time === 'hour') {
						this.isShowHourPicker = true
						const defaultValue = currentItem.defaultValue
						const idx = this.hourColumns[0].indexOf(defaultValue)
						this.hourDefaultIndex = [idx]
					} else {
						this.isShowTimePicker = true
					}
				} else {
					this.isShowActionSheet = true
				}
			},
			select(value) {
				console.log(value, 'value')
				this.formList[this.currentOperateIndex].value = value.name
			},
			/**
			 * @method close 关闭弹窗
			 **/
			close() {
				this.haveActionSheet = this.isShowActionSheet = this.isShowTimePicker = this.isShowHourPicker = false;
			},
			/**
			 * @method showPre 展示上一条
			 **/
			showPre() {},
			/**
			 * @method showPre 展示下一条
			 **/
			showNext() {},
			/**
			 * @method submit 表单提交
			 **/
			submit() {},
			handleSign(type) {

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
					font-size: $fontSize;
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
				bottom: 70px;
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

				.sign-in {
					background-color: #3a62d7;
				}

				.sign-out {
					background-color: #3ad7d7;
				}
			}

			.sign-time {
				font-size: $minFontSize;
				color: #445160;
			}
		}



		.btn-box {
			position: absolute;
			left: 0;
			bottom: 0;
			padding: 20rpx 0;
			width: 100%;
			display: flex;
			justify-content: space-around;
			background-color: #fff;
			text-align: center;

			.left-btn {
				width: 184rpx;
				height: 80rpx;
				display: flex;
				justify-content: space-between;

				.btn {
					width: 80rpx;
					height: 80rpx;
					line-height: 80rpx;
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
				width: 328rpx;
				height: 80rpx;
				line-height: 80rpx;
				background-color: #3a62d7;
				border-radius: 16rpx;
				font-size: $fontSize;
				color: #fff;
			}

			view {
				display: inline-block;
				width: 40rpx;
				height: 40rpx;
				border-radius: 8rpx;
			}

		}
	}
</style>