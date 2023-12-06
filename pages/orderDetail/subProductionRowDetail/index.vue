<template>
	<view class="sub-pro-row">
		<view class="top-wrapper">
			<view class="info">
				<view class="name">{{ subProductionRowName }}</view>
				<view class="extra-info">
					<text class="notice" @click="isShowTip = true">工序要求</text>
					<u-icon class="icon" name="pushpin-fill" size="16" color="#3a62d7" @click="handleAddIssue" />
				</view>
			</view>
			<ProductionInfo :fieldMapText="fieldMapText" :infoObj="detailInfo" style="height: auto;" />
			<UserInfo style="padding: 16px" fontColor='#000' :userInfo="userInfo">
				<view class="sign-time">
					<text :title='signInTime' v-if='signInTime'>签到：{{signInTime}}</text>
					<text v-if='signOutTime'>签退：{{signOutTime}}</text>
				</view>
			</UserInfo>
			<view class="sign-box">
				<view class="sign-in sign-btn" @click="handleSign('signIn')">签到</view>
				<view class="sign-out sign-btn" @click="handleSign('signOut')">签退</view>
			</view>
		</view>
		<CustomForm :haveActionSheet='haveActionSheet' :formList='showFormList' @showActionSheet='showActionSheet'>
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
			<view class="right-btn" @click="showProveSheet">{{btnText}}</view>
		</view>
		<!-- 操作面板 -->
		<u-action-sheet round :show="isShowActionSheet" :actions="actionSheetObj.actions" :title="actionSheetObj.title"
			:description="isShowActionSheet.description" @close="close" @select="select">
		</u-action-sheet>
		<u-picker title='是否合入问题库' :show="isShowProvePicker" :columns="proveColumns" :closeOnClickOverlay='true'
			@close='isShowProvePicker=false' @cancel='isShowProvePicker=false' @confirm='proveConfirm'></u-picker>
		<Notice :show="isShowTip" title="工序要求" :content="tip" @closeNotice="isShowTip = false" />
		<CustomSheet :show='showCustomSheet' title="测试" :selects='selects' @close='closeCustomSheet'
			@handleCheck='handleCheck' @reset='reset'>
		</CustomSheet>
		<u-calendar startText="住店" endText="离店" confirmDisabledText="请选择日期" :formatter="formatter"
			:show="isShowCalendar" :maxDate="maxDate" @confirm="confirmCalendar" ref="calendar"
			@close='isShowCalendar = false'>
		</u-calendar>
	</view>
</template>

<script>
	import ProductionInfo from "@/components/common/info.vue";
	import CustomForm from '@/components/common/form.vue';
	import UserInfo from '@/components/common/user-info.vue';
	import Notice from '@/components/common/notice.vue';
	import CustomSheet from '@/components/common/customSheet.vue'
	import moment from 'moment'
	import {
		getCurrRole,
		getUserInfo
	} from '@/utils/auth.js'
	import {
		getMesWorkContent,
		setMesWorkContent,
		proveConfirmApi
	} from "@/https/staging/index.js";
	export default {
		name: "ProcessDetail",
		components: {
			ProductionInfo,
			CustomForm,
			UserInfo,
			Notice,
			CustomSheet
		},
		computed: {
			showFormList() {
				return this.formList.sort((a, b) => {
					return a.type === b.type
				})
			}
		},
		data() {
			const d = new Date()
			const year = d.getFullYear()
			let month = d.getMonth() + 1
			month = month < 10 ? `0${month}` : month
			const date = d.getDate()
			return {
				// 工序内容列表
				formList: [],
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
				// time: Number(new Date()),
				// 展示日历选择
				isShowCalendar: false,
				mode: 'range',
				maxDate: `${year}-${month}-${date + 10}`,
				// 展示日期选择器
				isShowTimePicker: false,
				// 展示小时选择器 
				isShowHourPicker: false,
				// 小时列表
				hourColumns: [
					[{
						label: '11时',
						selected: true
					}, {
						label: '12时',
						selected: false
					}, {
						label: '13时',
						selected: true
					}, {
						label: '14时',
						selected: true
					}, {
						label: '15时',
						selected: true
					}, ]
				],
				// 默认选中项
				// hourDefaultIndex: [2],
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
				isShowProvePicker: false,
				proveColumns: [
					['是', '否']
				],
				isShowTip: false,
				// 工序标准
				tip: "<h4>测试</h4><br>",
				showCustomSheet: false,
				selects: [{
					value: 1,
					label: '哈哈哈哈',
					isCheck: false
				}, {
					value: 2,
					label: 'hihihihi',
					isCheck: false
				}, {
					value: 3,
					label: '哈喽哈喽哈喽',
					isCheck: false
				}, {
					value: 4,
					label: '你好',
					isCheck: false
				}],

			};
		},
		mounted() {
			this.getProcessId();
			this.initData();
			// 如果需要兼容微信小程序的话，需要用此写法
			this.$refs.calendar.setFormatter(this.formatter)
		},
		methods: {
			/**
			 * @method initData 初始化数据
			 **/
			initData() {
				const userInfo = getUserInfo();
				// 按钮权限控制
				this.btnText = userInfo.id ? '复核' : '开工'
				setMesWorkContent({
					craftId: 6
				}).then(res => {
					if (res && res.data) {
						// res.data.value.forEach(item => {
						// 	const temObj = {
						// 		title: item.operationName,
						// 		formType: item.operationType,
						// 		time: 'hour',
						// 		value: 9,
						// 		type: 'hour',
						// 		defaultValue: '14时',
						// 		showLink: true,
						// 		actions: [{
						// 				name: 1,
						// 			},
						// 			{
						// 				name: 2,
						// 			},
						// 			{
						// 				name: 3,
						// 			},
						// 		]
						// 	}
						// })
						this.formList = res.data.value || []
						console.log(res, 'formList', this.formList)
					}
				})
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
						// this.hourDefaultIndex = [idx]
					} else {
						// this.isShowTimePicker = true
						this.isShowCalendar = true
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
				this.haveActionSheet = this.isShowActionSheet = this.isShowCalendar = this
					.isShowHourPicker = false;
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
			 * @method showProveSheet 显示复核面板
			 **/
			showProveSheet() {
				this.isShowProvePicker = true
			},
			hourConfirm() {},
			proveConfirm() {
				const param = {
					craftId: 1,
					pass: 0, // 0：复核不通过，1：复核通过
				}
				proveConfirmApi(param).then(res => {
					if (res) {

					}
				})
			},
			handleSign(type) {

			},
			handleSign(type) {
				debugger
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
			},
			handleCheck(index) {
				this.selects[index].isCheck = !this.selects[index].isCheck
			},
			closeCustomSheet(selectedList) {
				console.log(selectedList, 'selectedList')
				this.showCustomSheet = false
			},
			reset() {
				this.selects.forEach(item => {
					item.isCheck = false
				})
			},
			confirmCalendar(date) {
				console.log(date, 'confirmCalendar')
			},
			// 日历显示已选择的日期
			formatter(day) {
				const d = new Date()
				let month = d.getMonth() + 1
				const date = d.getDate()
				if (day.month == month && day.day == date + 3) {
					day.bottomInfo = '已操作'
					day.dot = true
				}
				return day
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
				bottom: 80px;
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