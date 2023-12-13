<template>
	<view class="sub-pro-row">
		<view class="top-wrapper">
			<!-- 工序名称 -->
			<view class="info">
				<view class="name">{{ subProductionRowName }}</view>
				<view class="extra-info">
					<text class="notice" @click="showTip">工序要求</text>
					<u-icon class="icon" name="pushpin-fill" size="24" color="#3a62d7" @click="handleAddIssue" />
				</view>
			</view>
			<!-- 工单详情 -->
			<ProductionInfo :fieldMapText="fieldMapText" :infoObj="detailInfo" style="height: auto;" />
			<!-- 用户信息 -->
			<UserInfo style="padding: 16px" fontColor='#000'>
				<!-- <view class="sign-time">
					<text :title='signInTime' v-if='signInTime' style="margin-right: 10px;">签到：{{signInTime}}</text>
					<text v-if='signOutTime'>签退：{{signOutTime}}</text>
				</view> -->
			</UserInfo>
			<view class="sign-box">
				<u-button type="primary" class="sign-btn" @click="handleSign('signIn')" :disabled="signBtnEnable"
					text="签到" color="#3a62d7"></u-button>
				<u-button type="primary" class="sign-btn" text="签退" :disabled="!signBtnEnable" color="#3a62d7"
					@click="handleSign('signOut')"></u-button>
			</view>
		</view>
		<!-- 自定义表单 -->
		<CustomForm :formList='formList' :isStart='isStart' :commonParam='commonParam' @getBatchRecord='getBatchRecord'
			@reload='initData' v-if="formList.length" />
		<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" v-else>
		</u-empty>
		<!-- 按钮 -->
		<view class="btn-box">
			<view class="left-btn">
				<u-button :class="['btn', activeIndex > 0 ?'enable-btn':'disabled-btn']" :disabled="!(activeIndex > 0)"
					@click="handlePre">
					<u-icon name="arrow-left" size="30" bold></u-icon>
				</u-button>
				<u-button :class="['btn', activeIndex < (productionList.length - 1) ?'enable-btn':'disabled-btn']"
					@click="handleNext" :disabled="!(activeIndex < (productionList.length - 1))">
					<u-icon name="arrow-right" size="30" bold></u-icon>
				</u-button>
			</view>
			<u-button class="right-btn" @click="showReportProgress = true" text="报工"
				:disabled="!isStart || disableReportBtn" color="#3a62d7"></u-button>
			<u-button class="right-btn" @click="handleStarWork" :disabled="!isStart" :text="btnText"></u-button>
			<u-button class="right-btn" @click="isShowProvePicker = true" :disabled="disabledProveBtn"
				text='复核'></u-button>
			<!-- <u-button class="right-btn" @click="isShowProvePicker = true" text='复核'></u-button> -->
		</view>
		<!-- 复核面板 -->
		<u-picker title='是否合入问题库' :show="isShowProvePicker" :columns="proveColumns" :closeOnClickOverlay='true'
			@close='isShowProvePicker=false' @cancel='isShowProvePicker=false' @confirm='proveConfirm'></u-picker>
		<Notice :show="isShowTip" title="工序要求" :content="tip" @closeNotice="isShowTip = false" />
		<u-modal :show="showReportProgress" title="选择进度" @cancel='showReportProgress=false' :closeOnClickOverlay='true'
			@confirm='handleReport'>
			<view class="slot-content">
				<u-line-progress :percentage="percentage" activeColor="#3a62d7" height='20'></u-line-progress>
				<view style="display: flex;margin-top: 10px;">
					<u-button @click="computedWidth('minus')" style="margin-right:5px;">
						<u-icon name="minus"></u-icon>
					</u-button>
					<u-button @click="computedWidth('plus')">
						<u-icon name="plus"></u-icon>
					</u-button>
				</view>
			</view>
		</u-modal>
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
		queryBatchRecord,
		reportWorKOrderStatus,
		getProcessList,
		saveSignInfoApi,
		searchSignInfoApi,
		searchTemplateList,
		searchStandardById,
		reportWork
	} from "@/https/staging/index.js";
	import {
		SUB_PRODUCTION_MAP
	} from '@/utils/constants-custom.js'
	export default {
		name: "ProcessDetail",
		components: {
			ProductionInfo,
			CustomForm,
			UserInfo,
			Notice
		},
		computed: {
			...mapState("workOrder", ['workOrderDetailInfo']),
		},
		data() {
			return {
				// 工步工作内容列表
				formList: [],
				// 字段与文本映射
				fieldMapText: SUB_PRODUCTION_MAP,
				// 当前选中工序名称
				subProductionRowName: "工序名称",
				// 工序详情信息
				detailInfo: {
					groupPerson: "",
					subGroupPerson: "",
					member: "",
				},
				isShowActionSheet: false,
				// 操作面板对象
				actionSheetObj: {},
				// 按钮文字-根据用户信息显示不同操作
				btnText: '开工',
				// 签到时间
				// signInTime: '',
				// 签退时间
				// signOutTime: '',
				// 展示审核面板
				isShowProvePicker: false,
				// 问题审核
				proveColumns: [
					['否', '是'],
					['不通过', '通过']
				],
				isShowTip: false,
				// 工序标准
				tip: "",
				// 公共参数
				commonParam: {
					workCode: '', // 工单编号
					craftId: '', // 工步编号
					workScene: '', // 工单场景
				},
				// 复核按钮是否可用
				disabledProveBtn: false,
				// 是否开工-不开工按钮都不显示-不允许操作
				isStart: false,
				// 工步列表
				productionList: [],
				// 当前选中的工步下标
				activeIndex: 0,
				// 签到按钮是否可用
				signBtnEnable: false,
				// 显示弹窗
				showReportProgress: false,
				// 报工进度
				percentage: 0,
				// 报工按钮是否可用
				disableReportBtn: false
			};
		},
		watch: {
			activeIndex(nVal, oVal) {
				if (nVal !== oVal) {
					const currentProductionItem = this.productionList[this.activeIndex];
					// 缓存工步
					uni.setStorageSync('ims_workStep', currentProductionItem);
					this.initData()
				}
			}
		},
		created() {
			this.initData();
			// 查询签到签退信息
			this.searchSignInfo()
		},
		methods: {
			/**
			 * @method initData 初始化数据
			 **/
			initData() {
				// 工序详情信息
				const workOrder = uni.getStorageSync('ims_workOrder') || {}
				const workStep = uni.getStorageSync('ims_workStep') || {}
				const intermediateProcess = uni.getStorageSync('ims_intermediateProcess') || {}
				this.commonParam = {
					workCode: workOrder.id,
					craftId: workStep.workProcedureCode && workStep.workProcedureCode.split('_')[1],
					workScene: workStep.workOrderSceneType,
				}
				this.detailInfo = {
					groupPerson: workStep.leaderName,
					subGroupPerson: workStep.deputyLeaderName,
					member: workStep.memberName,
				};
				// 工步名称
				this.subProductionRowName = workStep.workProcedureName;
				// 0, “未派工”-不显示按钮;1, “已开工”-显示已完工按钮;2, “未开工”-显示开工按钮;3, “已完工”;
				this.isStart = workStep.workStatus !== 0;
				this.btnText = ["未派工", '完工', '开工', '已完工'][workStep.workStatus] || '开工';
				//状态不为已开工禁用
				this.disableReportBtn = workStep.workStatus !== 1;
				// 状态为已复核、工单不为完工禁用（reviewStatus-0 未复核，1-已复核）
				this.disabledProveBtn = workStep.reviewStatus === 1 || workStep.workStatus !== 3;
				// 获取工步工作内容
				this.getWorkStepContent()
				// 获取工步列表数据用于上下页
				this.getProcessListData(workOrder, intermediateProcess, workStep)
			},

			// 获取工步内容
			getWorkStepContent() {
				setMesWorkContent({
					craftId: this.commonParam.craftId
				}).then(res => {
					if (res.success && res.data) {
						const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
						const params = []
						res.data.value.forEach(item => {
							params.push({
								...this.commonParam,
								operationCode: item.operationCode,
								executionFrequency: item.executionFrequency,
								beginTime: currentTime,
								craftCode: this.commonParam.craftId
							})
						})
						res.data.value.forEach((item, index) => {
							// 筛选图片，暂不支持文件
							item.fileList = item.fileList ? item.fileList.filter(f => f.fileType ===
								'jpg') : [];
							item.upperLimit = item.upperLimit || undefined;
						})
						this.formList = res.data.value || [];
						// 初始化回显，用当前时间批量查询工作内容记录
						this.formList.length && this.getBatchRecord(params);
					} else {
						uni.$u.toast(res.errMsg || '暂无数据');
					}
				})
			},
			// 批量获取工作内容记录
			getBatchRecord(params) {
				queryBatchRecord(params).then(res => {
					if (res.success && res.data && Array.isArray(res.data.value)) {
						res.data.value.forEach((item, index) => {
							// 筛选图片，暂不支持文件
							item.fileList = item.fileList ? item.fileList.filter(f => f.fileType ===
								'jpg') : []
							this.formList[index].fileList = item.fileList;
							this.formList[index].contentInfo = item.contentInfo;
						})
						console.log(this.formList, 'formList')
					} else {
						uni.$u.toast(res.errMsg || '暂无数据')
					}
				})
			},
			// 获取工步列表用于上下切换
			getProcessListData(workOrder, intermediateProcess, workStep) {
				let temp = intermediateProcess.workProcedureCode && intermediateProcess.workProcedureCode.split('_');
				const param = {
					pageNum: 1,
					pageSize: 100,
					workCode: workOrder.id,
					workProcedureCode: temp[1],
					workProcedureType: intermediateProcess.workProcedureType, // 0-根节点, 1-标准工序,2-中工序,3-工步,4-内容工序
					workOrderSceneType: intermediateProcess.workOrderSceneType,
					templateCode: workOrder.procedureTemplateCode
				}
				getProcessList(param)
					.then(res => {
						if (res.success && res.data && Array.isArray(res.data.pageList)) {
							res.data.pageList.forEach((item, index) => {
								if (item.workProcedureCode === workStep.workProcedureCode) {
									// 当前选中项的下标
									this.activeIndex = index;
								}
							})
							this.productionList = res.data.pageList || [];
						} else {
							uni.$u.toast(res.errMsg || '暂无数据')
						}
					})
			},
			handlePre() {
				if (this.activeIndex === 0) return;
				this.activeIndex--;
			},
			handleNext() {
				if (this.productionList.length === 0) return;
				this.activeIndex++;
			},
			// 复核面板确认
			proveConfirm(value) {
				const param = {
					...this.commonParam,
					craftId: this.commonParam.craftId || "",
					pass: value.indexs[1], // 0：复核不通过，1：复核通过
					isProblem: value.indexs[0] // 0:不加入 1:加入
				}
				proveConfirmApi(param).then((res) => {
					if (res.success) {
						uni.$u.toast('复核成功');
						// 返回中工序页面
						uni.redirectTo({
							url: '/pages/orderDetail/productionDetail/index'
						})
					} else {
						uni.$u.toast(res.errMsg || '暂无数据')
					}
				}).finally(() => {
					this.isShowProvePicker = false
				})
			},
			// 搜索签到信息
			searchSignInfo() {
				const userInfo = getUserInfo();
				const param = {
					userId: userInfo.username,
					workId: this.commonParam.workCode || '',
					sceneType: this.commonParam.workScene || '',
					workProcedureId: this.commonParam.craftId || '',
				}
				searchSignInfoApi(param).then(res => {
					if (res.success && res.data && Array.isArray(res.data.value)) {
						const length = res.data.value.length;
						this.signBtnEnable = length % 2 === 1;
					} else {
						uni.$u.toast(res.errMsg || '查询失败')
					}
				})
			},
			// 处理签到签退
			handleSign(type) {
				let date = ''
				date = moment().format('YYYY-MM-DD HH:mm:ss');
				const param = {
					workId: this.commonParam.workCode,
					sceneType: this.commonParam.workScene,
					workProcedureId: this.commonParam.craftId,
					executeType: type === 'signIn' ? 1 : 2,
					userId: getUserInfo().username
				}
				saveSignInfoApi(param).then(res => {
					if (res.success) {
						const str = type === 'signIn' ? "签到成功" : '签退成功';
						uni.$u.toast(str)
						this.searchSignInfo();
					} else {
						uni.$u.toast(res.errMsg || '暂无数据')
					}
				})
			},
			// 跳转增加问题页面
			handleAddIssue() {
				uni.navigateTo({
					url: `/pages/orderDetail/addIssue?workProcedureCode=${this.commonParam.craftId}&workScene=${this.commonParam.workScene}&workProcedureType=${3}`
				});
			},
			// 处理开工
			handleStarWork() {
				// 按钮权限控制 /0, “未派工”-不显示按钮;1, “已开工”-显示已完工按钮;2, “未开工”-显示开工按钮;3, “已完工”;
				// this.btnText = ["未派工", '完工', '开工', '已完工'][workStep.workStatus] || '开工';
				const param = {
					workProcedureCode: this.commonParam.craftId,
					workCode: this.commonParam.workCode,
					workScene: this.commonParam.workScene,
					operator: uni.getStorageSync('hb_dq_mes_user_info').username
				}
				const idx = ["未派工", '完工', '开工', '已完工'].indexOf(this.btnText);
				if (idx === 2) {
					param.isStart = 1
				} else if (idx === 1) {
					param.isFinished = 1
				}
				reportWorKOrderStatus(param).then(res => {
					if (res.success) {
						uni.$u.toast('操作成功')
						uni.redirectTo({
							delta: 1
						})
					} else {
						uni.$u.toast(res.errMsg || '操作失败')
					}
				})
			},
			// 展示工序要求
			showTip() {
				searchTemplateList({
					type: 0
				}).then(res => {
					if (res.success && res.data && Array.isArray(res.data.value)) {
						const id = res.data.value[0].docId;
						searchStandardById({
							docId: id
						}).then(res => {
							if (res.success) {
								this.tip = res.data.content;
								this.isShowTip = true;
							} else {
								uni.$u.toast(res.errMsg || '暂无数据')
							}
						})
					} else {
						uni.$u.toast(res.errMsg || '暂无数据')
					}
				})
			},
			// 处理报工事件
			handleReport() {
				const userInfo = uni.getStorageSync('hb_dq_mes_user_info')
				const param = {
					progress: this.percentage,
					workCode: this.commonParam.workCode,
					workScene: this.commonParam.workScene,
					workProcedureCode: this.commonParam.craftId,
					operator: userInfo.username
				}
				reportWork(param).then(res => {
					if (res.success) {
						uni.$u.toast('报工成功')
					} else {
						uni.$u.toast('报工失败')
					}
				}).finally(() => {
					this.showReportProgress = false;
				})
			},
			// 进度条增减操作
			computedWidth(type) {
				if (type === 'plus') {
					this.percentage = uni.$u.range(0, 100, this.percentage + 10)
				} else {
					this.percentage = uni.$u.range(0, 100, this.percentage - 10)
				}
			},
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
					flex: 1;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: $titleFontSize;
				}

				.extra-info {
					display: flex;
					align-items: center;
					justify-content: center;

					.notice {
						margin-right: 10rpx;
						color: #3a62d7;
						font-size: $smallFontSize;
					}

					.icon {
						padding: 0 10rpx;
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

		.slot-content {
			width: 100%;
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
				height: 80rpx;
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
				width: 160rpx;
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