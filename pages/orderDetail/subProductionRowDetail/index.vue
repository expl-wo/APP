<template>
	<view class="sub-pro-row">
		<view class="top-wrapper">
			<!-- 工序名称 -->
			<view class="info">
				<view class="name">{{ subProductionRowName }}</view>
				<view class="extra-info">
					<text class="notice" @click="showTip">安全须知</text>
					<u-icon class="icon" name="pushpin-fill" size="24" color="#3a62d7" @click="handleAddIssue" />
				</view>
			</view>
			<!-- 工单详情 -->
			<ProductionInfo :fieldMapText="fieldMapText" :infoObj="detailInfo" style="height: auto;" />
			<!-- 用户信息 -->
			<UserInfo style="padding: 16px" fontColor='#000'>
			</UserInfo>
			<view class="sign-box">
				<u-button type="primary" class="sign-btn" @click="handleSign('signIn')" :disabled="signBtnEnable"
					text="签到" color="#3a62d7"></u-button>
				<u-button type="primary" class="sign-btn" text="签退" :disabled="!signBtnEnable" color="#3a62d7"
					@click="handleSign('signOut')"></u-button>
			</view>
		</view>
		<!-- 自定义表单 -->
		<CustomForm ref="custForm" :formList='formList' :saveBtnDisabled='disableReportBtn' :isStart='isStart'
			:commonParam='commonParam' @getBatchRecord='getBatchRecord' @reload='initData'
			@takePhotoAndVideo="takePhotoAndVideo" v-if="formList.length" />
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
			<view class="right-btn" v-if="formList.length">
				<u-button class="btn" @click="handleShowProgress" text="报工" :disabled="!isStart || disableReportBtn"
					color="#3a62d7"></u-button>
				<u-button class="btn" @click="beforeStartWork" :disabled="!isStart || disableStartWorkBtn"
					:text="btnText"></u-button>
				<u-button class="btn" @click="isShowProvePicker = true" :disabled="disabledProveBtn"
					text='复核'></u-button>
			</view>
		</view>
		<!-- 复核面板 -->
		<u-picker title='是否合入问题库' :show="isShowProvePicker" :columns="proveColumns" :closeOnClickOverlay='true'
			@close='isShowProvePicker=false' @cancel='isShowProvePicker=false' @confirm='proveConfirm'></u-picker>
		<Notice :show="isShowTip" title="工序要求" :content="tip" @closeNotice="closeNotice" />
		<u-modal :show="showReportProgress" title="选择进度" width='360px' @cancel='showReportProgress=false'
			:closeOnClickOverlay='true' @confirm='handleReport' @close='showReportProgress=false'>
			<view class="slot-content">
				<DragProgress ref="progressBar" @change="handleProgress" :min='0' :max='100' :slideBarWidth="300">
				</DragProgress>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import ProductionInfo from "@/components/common/info.vue";
	import CustomForm from '@/components/common/form.vue';
	import UserInfo from '@/components/common/user-info.vue';
	import Notice from '@/components/common/notice.vue';
	import DragProgress from '@/components/bestjhh-movable-area/bestjhh-movable-area.vue';
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
		reportWork,
		isFirstTimeStart
	} from "@/https/staging/index.js";
	import {
		SUB_PRODUCTION_MAP
	} from '@/utils/constants-custom.js'
	import {
		getFileServerUrl
	} from "@/utils/config";
	export default {
		name: "ProcessDetail",
		components: {
			ProductionInfo,
			CustomForm,
			UserInfo,
			Notice,
			DragProgress // 可拖动进度条
		},
		computed: {
			...mapState("workOrder", ['workOrderDetailInfo']),
		},
		data() {
			return {
				// 展示无内容表单列表
				showList: [],
				// 填充内容后的工步工作内容列表
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
				disableReportBtn: false,
				// 开工完工按钮是否可用
				disableStartWorkBtn: false,
				// 是否是开工时出发的安全须知
				isStartWorkFlag: false
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
				// 报工进度初始值
				this.percentage = workStep.progress;
				// 工步名称
				this.subProductionRowName = workStep.workProcedureName;
				// 0, “未派工”-不显示按钮;1, “已开工”-显示已完工按钮;2, “未开工”-显示开工按钮;3, “已完工”;
				this.isStart = workStep.workStatus !== 0;
				this.btnText = ["未派工", '完工', '开工', '已完工'][workStep.workStatus] || '开工';
				this.disableStartWorkBtn = workStep.workStatus === 3
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
							const whiteList = ['jpg', 'png', 'jepg', 'jpeg', 'img', 'gif']
							item.aiAppendixDTOList = item.aiAppendixDTOList ? item.aiAppendixDTOList.filter(f => whiteList.includes(f
								.fileType)) : [];
							item.upperLimit = item.upperLimit || undefined;
						})
						this.showList = res.data.value || [];
						// 初始化回显，用当前时间批量查询工作内容记录
						this.showList.length && this.getBatchRecord(params);
					} else {
						uni.$u.toast(res.errMsg || '暂无数据');
					}
				})
			},
			// 批量获取工作内容记录
			getBatchRecord(params) {
				queryBatchRecord(params).then(res => {
					if (res.success && res.data && Array.isArray(res.data.value)) {
						const list = this.showList;
						if (res.data.value.length) {
							res.data.value.forEach((f, index) => {
								list.forEach(item => {
									if (item.operationCode === f.operationCode) {
										// 筛选图片，暂不支持文件
										// const whiteList = ['jpg', 'png', 'jepg', 'jpeg', 'img',
										// 	'gif', 'mp4'
										// ]
										item.aiAppendixDTOList = f.aiAppendixDTOList ? f.aiAppendixDTOList.filter(file => file.appendixType === 1 || file.appendixType === 2) : [];
										item.aiAppendixDTOList.forEach(img => {
											img.url =
												`${getFileServerUrl()}${img.appendixUrl}`;
											let temp = img.appendixUrl.split('.');
											img.type = (temp[temp.length - 1]).toLowerCase();
											img.name = img.appendixName || '';
											img.filePath = img.appendixUrl;
											img.flag = img.flag === 0 ? 0 : 1;
										})
										// item.aiAppendixDTOList = f.aiAppendixDTOList;
										item.contentInfo = f.contentInfo;
										item.id = f.id;
									}
								})
							})
						} else {
							// 更新时没值把对应内容置空
							list.forEach(item => {
								if (item.operationCode === operationCode) {
									item.contentInfo = "";
								}
							})
						}
						this.formList = list;
						console.log(this.showList, 'formList', list)
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
			beforeStartWork() {
				// 开工前弹出安全须知提示
				if (this.btnText === '开工') {
					let params = {
						workCode: this.commonParam.workCode,
						userId: getUserInfo().username
					}
					isFirstTimeStart(params)
					.then(res => {
						if (res.success && res.data && !res.data.isStart) {
							this.isStartWorkFlag = true;
							this.showTip();
						} else {
							this.handleStarWork();
						}
					})
				} else {
					this.handleStarWork();
				}

			},
			// 处理开工
			handleStarWork() {
				const userInfo = JSON.parse(uni.getStorageSync('hb_dq_mes_user_info'))
				// 按钮权限控制 /0, “未派工”-不显示按钮;1, “已开工”-显示已完工按钮;2, “未开工”-显示开工按钮;3, “已完工”;
				// this.btnText = ["未派工", '完工', '开工', '已完工'][workStep.workStatus] || '开工';
				const param = {
					workProcedureCode: this.commonParam.craftId,
					workCode: this.commonParam.workCode,
					workScene: this.commonParam.workScene,
					operator: userInfo.username
				}
				const idx = ["未派工", '完工', '开工', '已完工'].indexOf(this.btnText);
				if (idx === 2) {
					param.isStart = 1
				} else if (idx === 1) {
					param.isFinished = 1
				}
				reportWorKOrderStatus(param).then(res => {
					if (res.success) {
						const workStep = uni.getStorageSync('ims_workStep') || {}
						workStep.workStatus = idx === 2 ? 1 :
							3 // 按钮权限控制 /0, “未派工”-不显示按钮;1, “已开工”-显示已完工按钮;2, “未开工”-显示开工按钮;3, “已完工”;
						uni.setStorageSync('ims_workStep', workStep)
						this.initData();
						uni.$u.toast('操作成功')
						// uni.redirectTo({
						// 	url: "/pages/orderDetail/productionDetail/index"
						// })
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
				const userInfo = JSON.parse(uni.getStorageSync('hb_dq_mes_user_info'))
				const param = {
					progress: this.percentage,
					workCode: this.commonParam.workCode,
					workScene: this.commonParam.workScene,
					workProcedureCode: this.commonParam.craftId,
					operator: userInfo.username
				}
				reportWork(param).then(res => {
					if (res.code === '0') {
						uni.$u.toast('报工成功')
					} else if (res.code === '10070') {
						uni.$u.toast('该工步已完工');
						const workStep = uni.getStorageSync('ims_workStep') || {}
						workStep.workStatus = 3;
						uni.setStorageSync('ims_workStep', workStep)
						this.initData();
					} else {
						uni.$u.toast('报工失败')
					}
				}).finally(() => {
					this.showReportProgress = false;
				})
			},
			handleProgress(num) {
				this.percentage = num;
			},
			handleShowProgress() {
				this.showReportProgress = true;
			},
			// 拍照和录像
			takePhotoAndVideo() {
				this.showFlag = true;
			},
			closeModal(type) {
				this.showFlag = false;
			},
			closeNotice() {
				this.isShowTip = false;
				if (this.isStartWorkFlag) {
					this.isStartWorkFlag = false;
					this.handleStarWork();
				}
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
			margin: 0 20px;
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
				display: flex;
				justify-content: space-between;

				.btn {
					width: 160rpx;
					height: 60rpx;
					margin: 0 5px;
					line-height: 60rpx;
					background-color: #3a62d7;
					border-radius: 16rpx;
					font-size: $fontSize;
					color: #fff;
				}
			}

			view {
				display: inline-block;
				border-radius: 8rpx;
			}

		}
	}

	/deep/ .u-modal__title {
		margin-bottom: 40px;
	}

	/deep/ .u-calendar-month__days__day__select__dot {
		background-color: #19be6b;
	}
</style>