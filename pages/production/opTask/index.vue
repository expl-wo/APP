<template>
	<view class="content">
		<view class="main">
			<view class="headerp" id="main-form">
				<view class="product">
					生产号:
				</view>
				<view class="input-view">
					<u-input border="surround" clearable placeholder="生产号/项目名" v-model="listQuery.keyword"
						@input="queryTaskTime()" />
				</view>
				<view style="margin-left: 10px;">
					<u-button @click="productionStatus = true" type="info">生产状态</u-button>
				</view>
				<view class="product">
					<text style="color: #aaa;margin-left: 10px;font-size: 14px;">{{productionStatusName}} </text>
					<!-- <u-badge numberType="overflow" max="9" value="+5"></u-badge> -->
				</view>
				<view class="product">
					<text style="color: #aaa;margin-left: 10px;">任务:{{total}} 条</text>
				</view>
				<view class="product">
					<button @click="onQuery" type="primary" size="mini">查询</button>
				</view>
				<view class="product">
					<text style="color: #aaa;margin-left: 10px;">当前工位:{{workSpace}} </text>
				</view>
				<view class="product" style="float: right">
					<button @click="toSwitch" type="primary" size="mini">切换工位</button>
				</view>
			</view>
			<view class="con">
				<scroll-view scroll-y="true" style="height: 1200px" @scrolltolower="pullDown">
					<view v-for="(item,index) of dataList" class="item" :id="'scrollId'+item.opPlanId">
						<view class="item-header">
							<view class="header-text">
								<view class="header-text-item">生产号：{{item.productNoMain}} </view>
								<view class="header-text-item">工单号：{{item.productNo}}</view>
								<view class="header-text-item status" v-if="item.opStatus == 0">
									生产-未开工
								</view>
								<view class="header-text-item status" v-if="item.opStatus == 1">
									生产-开工中{{item.staPerson}}
								</view>
								<view class="header-text-item status" v-if="item.opStatus == 2">
									生产-完工{{item.staPerson}}
								</view>
								<view class="header-text-item status" v-if="item.opStatus == 3">
									完工-已完工{{item.staPerson}}
								</view>
								<view class="header-text-item status" v-if="item.opStatus == 4">
									生产-暂停{{item.staPerson}}({{item.pauseReson}})
								</view>
								<view class="header-text-item status" v-if="item.opStatus == 9">
									生产-返工中{{item.staPerson}}
								</view>
								<view class="header-text-item status"
									v-if="item.checkStatus !== null && item.checkStatus !== ''">
									检验状态-<xui-dictionary dictCode="checkStatusType"
										:code="item.checkStatus"></xui-dictionary>
								</view>
							</view>
						</view>
						<view class="tag-s2 report-desc">
							<text>{{item.workContent}}</text>
						</view>
						<view class="item-main">
							<view class="item-left">
								<view class="left-texts new-texts">
									<text>{{item.opName}}</text>
									<!-- <view class="item-input-wrapper">
										<view class="item-input-label" @click="aliasIndex = index;showAlias = true">别名：
										</view>
										<input class="item-input-content" width="40px" height="40"
											v-model="item.opAlias" @input="changeAliasX(item)" style="background: #FFF;"
											type="text" placeholder="" border></input>
									</view> -->
									<u-collapse>
										<u-collapse-item :title="'前置工序状态:'+item.frontOpStatus">
											<view v-for="(details,index) in item.frontOpStatusList" :key="index">
												{{details}}
											</view>
										</u-collapse-item>
									</u-collapse>						
									<text style="height: auto;text-align: left;font-size: 10rpx;line-height: 1.6;">
										型号：{{item.productModel}}
										图号：{{item.drawingNo}}
										工位名称:{{item.workspaceName}}
										计划开始时间：{{item.planStartTime}}
									</text>
								</view>
							</view>
							<view class="item-right">
								<template v-if="opType !='SpecialCheck'">
									<button type="default" class="control-btn" @click="onStart(item)"
										v-show='item.opStatus==0'>开工</button>
									<button type="default" class="report-btn control-btn" @click="onReport(item)"
										v-show="item.opStatus==1 ">报工</button>
									<button type="default" class="control-btn" @click="stop(item)"
										v-show='item.opStatus==1||item.opStatus==9'>暂停</button>
									<button type="default" @click="restart(item)" v-show='item.opStatus==4'>恢复</button>
								</template>
								<button type="default" class="control-btn" @click="andon(item)"
									style="background-color: rgb(212,72,101);">Andon</button>
								<button type="default" class="control-btn" @click="opMaterialCheck(item)"
									style="background-color: #FE923D;">缺料检查</button>
								<button type="default" class="control-btn" @click="drawing(item)"
									style="background-color: #FE923D;">车间查图</button>
								<button type="default" class="control-btn" @click="opMaterial(item)">部件登记</button>
								<template v-if="opType !='SpecialCheck'">
									<button type="default" v-if="item.canSelfCheck" class="control-btn"
										@click="qualityCheck(item)" style="background-color: #5470c6">自检</button>
									<button type="default" v-if="item.canInitialCheck" class="control-btn"
										@click="qualityCheck(item)" style="background-color: #91cc75">兼检</button>
								</template>
								<template v-if="opType =='SpecialCheck'">
									<button type="default" v-if="item.canSpecialCheck" class="control-btn"
										@click="qualityCheck(item)" style="background-color: #91cc75">专检</button>
								</template>

							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 暂停窗口 -->
		<u-popup :show="showPause" mode="center" @close="close" customStyle="width:600px;" height="50%">
			<view style="padding:20px;">
				<view class="main-workSelect-title">
					选择暂停原因
				</view>
				<view style="width: 100%;height: 288px;border: #b7b7ba;border-style: solid;overflow-y:scroll;">
					<u-radio-group wrap v-model="pauseReason" @change="">
						<u-radio :customStyle="{marginBottom: '8px'}" v-for="(item, index) in pauseReasonList"
							:key="index" :name="item.name" @change="">{{item.name}}
						</u-radio>
					</u-radio-group>
				</view>
				<text>*点击阴影部分返回</text>
				<u-button type="primary" @click="opStop()">暂停</u-button>
			</view>
		</u-popup>
		
		<u-popup :show="showBom" mode="center" @close="close" customStyle="width:600px;" height="50%">
			<view style="padding:20px;">
				<view class="main-workSelect-title">
					BOM分类
				</view>
				<view style="width: 100%;height: 288px;border: #b7b7ba;border-style: solid;overflow-y:scroll;">
					<uni-table>
						<uni-tr>
							<uni-th align="center">序号</uni-th>
							<uni-th align="center">顶层图号</uni-th>
							<uni-th align="center">类型</uni-th>
							<uni-th align="center">操作</uni-th>
						</uni-tr>
						<uni-tr v-for="(item,index) in topBom" :key="item.id">
							<uni-th align="center">{{index+1}}</uni-th>
							<uni-th align="center">{{item.drawingNo}}</uni-th>
							<uni-th align="center">{{item.orderTypeName}}</uni-th>
							<uni-td align="center">
								<button type="primary" size="mini" @click="showDrawingBom(item.drawingNo)">查看</button>
							</uni-td>
						</uni-tr>
					</uni-table>
					
					<!-- <u-radio-group wrap v-model="pauseReason" @change="">
						<u-radio :customStyle="{marginBottom: '8px'}" v-for="(item, index) in pauseReasonList"
							:key="index" :name="item.name" @change="">{{item.name}}
						</u-radio>
					</u-radio-group> -->
					
				</view>
			</view>
		</u-popup>
		
		<u-popup mode="bottom" :show="productionStatus" @close="close" heigth="50%">
			<view class="content xui-reset">
				<view class="popup-btn__wrapper">
					<u-button class="mgReset" style="margin-bottom: 5px;" type="primary" @click="selectStatusConfirm">确定
					</u-button>
				</view>
				<scroll-view scroll-y="true" style="height:250rpx">
					<uni-table border stripe>
						<uni-tr>
							<uni-th align="center">生产状态</uni-th>
						</uni-tr>
						<uni-tr>
							<uni-td align="center">
								<view class="flexCenter">
									<u-checkbox-group v-model="productionStatusSelected">
										<u-checkbox :customStyle="{margin: '8px'}"
											v-for="(item, index) in productionStatusList" :key="index"
											:label="item.label" :name="item.value">
										</u-checkbox>
									</u-checkbox-group>
								</view>
							</uni-td>
						</uni-tr>
					</uni-table>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getOpTask,
		getDrawingBom,
		getBomByDrawingNo,
		opStart,
		opStop,
		opRestart,
		opFinish,
		getPauseReason,
		getLastProcedure,
		checkMaterial
	} from "@/https/production/proudction.js"
	export default {
		data() {
			let productionStatusSelected = [0, 1, 2, 4];
			return {
				listQuery: {
					pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
					pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
					type: 'Production',
					status: productionStatusSelected,
					keyword: '',
					productNo: '',
				},
				total: 0,
				currentPage: 0,
				dataList: [],
				productionStatus: false,
				triggered: true,
				showPause: false,
				selectedAll: true,
				pauseReasonList: [],
				pauseReason: '',
				stopData: {},
				appraiseData: '',
				showBom:false,
				showAppraise: false,
				productionStatusList: [{
						value: 0,
						label: '未开工',
					},
					{
						value: 1,
						label: '开工中',
					},
					{
						value: 2,
						label: '报工',
					},
					{
						value: 4,
						label: '暂停',
					}
				],
				productionStatusSelected,
				productionStatusName: null,
				opType: '',
				workSpace: '',
				topBom:[],
				checkStatus: false,
				checkStatusList: [{
						value: 0,
						label: '需自检',
					},
					{
						value: 1,
						label: '需兼检',
					},
					{
						value: 2,
						label: '需专检',
					},
					{
						value: 3,
						label: '无检查',
					},
					{
						value: 4,
						label: '已检查',
					},
				],
			}
		},
		computed: {},
		onLoad(options) {

			this.setProductionStatus();

			if (options && options.opType) {
				this.opType = options.opType;
				if (this.opType === this.$constants.qualityCheckType.InitialCheck ||
					this.opType === this.$constants.qualityCheckType.SpecialCheck) {
					this.listQuery.type = this.opType;
				}
			}

			this.listQuery.productNo = getApp().queryNo

			getPauseReason().then(res => {
				if (res.err_code === 10000) {
					this.pauseReasonList = res.data
				}
			})
			
			

		},

		onShow() {
			this.onQuery()
		},

		methods: {

			onQuery() {
				this.listQuery.pg_pagenum = 1;
				this._onQuery();
			},
			_onQuery(appendList = false) {
				this.workSpace = uni.getStorageSync("workSpace")
				getOpTask(this.listQuery).then(res => {
					if (res.err_code === 10000) {
						res.data.forEach(item => {
							if (item.checkStatus === this.$constants.checkStatus.SelfCheck) {
								item.canSelfCheck = true;
							} else if (item.checkStatus === this.$constants.checkStatus.Initial) {
								item.canInitialCheck = true;
							} else if (item.checkStatus === this.$constants.checkStatus.Special) {
								item.canSpecialCheck = true;
							}
						})
						if (appendList) {
							this.dataList = this.dataList.concat(res.data);
						} else {
							this.dataList = res.data
						}
						this.total = res.total_count
						if (res.total_count == 0) {
							uni.showToast({
								title: "当前无有操作记录任务",
								icon: 'none',
								duration: 2000
							})
						}
					} else {
						uni.showToast({
							title: res.err_msg,
							icon: 'none',
							duration: 2000
						})
					}
					if (getApp().queryNo) {
						getApp().queryNo = ''
					}
				})
			},
			queryTaskTime() {
				if (this.timer) {
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(() => {
					this.onQuery();
				}, 800)
			},
			handleChangeAll() {
				this.selectedAll = !this.selectedAll
				this.productionStatusList.forEach(item => {
					item.checked = this.selectedAll;
				})
				console.log(this.productionStatusLis);
			},
			drawing(item) {
				const req = {
				  productNo : item.productNo,
				  productNoMain : item.productNoMain
				}
				getDrawingBom(req).then(res=>{
				  this.topBom = res.data
				})
				this.showBom = true
				// let lgnName = uni.getStorageSync('lgnName');
				// window.open("http://ct.tbea-hb.com.cn/#/externalCtDetail?in_draw_no=" + item.drawingNo + "&user_code=" +
				// 	lgnName + "", '_blank')
			},
			showDrawingBom(drawingNo){
			  const req = {
			    drawingNo : drawingNo
			  }
			  getBomByDrawingNo(req).then(res=>{
				var item = encodeURIComponent(JSON.stringify(res.data)).replace(/%/g, '%25')
				uni.navigateTo({
					url: '/pages/production/opTask/opBom?item=' + item
				})
			  })
			},
			handleChangeSingle(params) {
				params.checked = !params.checked
				let isNotAllSelected = false;
				this.productionStatusList.some(item => {
					if (!item.checked) {
						isNotAllSelected = true;
						return true;
					} else {
						return false;
					}
				})
				console.log(this.productionStatusLis);
				this.selectedAll = !isNotAllSelected;
			},
			selectStatusConfirm() {
				if (this.productionStatusSelected.length === 0) {
					uni.showToast({
						title: '请先勾选状态数据'
					});
					return;
				}
				this.setProductionStatus();
				this.$nextTick(() => {
					this.onQuery()
				})
				this.productionStatus = false;
			},
			setProductionStatus() {
				let selectedList = [];
				this.productionStatusSelected.forEach(item => {
					this.productionStatusList.some(subItem => {
						if (item === subItem.value) {
							selectedList.push(subItem);
							return true;
						} else {
							return false;
						}
					})
				})
				this.listQuery.status = []
				selectedList.forEach(item => {
					this.listQuery.status.push(item.value)
				});
				if (selectedList.length === 0) {
					this.productionStatusName = '';
					return;
				}
				if (selectedList.length > 1) {
					this.productionStatusName = selectedList[0].label + '...';
				} else {
					this.productionStatusName = selectedList[0].label;
				}
			},
			opMaterialCheck(data) {
				var item = encodeURIComponent(JSON.stringify(data)).replace(/%/g, '%25')
				uni.navigateTo({
					url: '/pages/production/opTask/checkMaterial?item=' + item
				})
			},
			toSwitch() {
				uni.navigateTo({
					url: '/pages/production/opTask/selectWorkSpace'
				});
			},
			onStart(data) {
				uni.showModal({
					title: "开工提醒",
					content: "是否开工" + data.projectName + "项目" + data.opName + "工序?",
					showCancel: true,
					cancelText: '否',
					confirmText: '是',
					success: res => {
						if (res.confirm) {
							let opPlanIds = []
							opPlanIds.push(data.opPlanId)
							opStart({
								opPlanIds: opPlanIds
							}).then(resp => {
								if (resp.err_code == 10000) {
									uni.showToast({
										title: '开工成功',
										icon: 'none',
										duration: 2000
									});
									this.onQuery()
								} else {
									uni.showToast({
										title: resp.err_msg,
										icon: 'none',
										duration: 2000
									})
								}
							})
						}
					}
				})
			},
			opMaterial(data) {
				var item = encodeURIComponent(JSON.stringify(data)).replace(/%/g, '%25')
				uni.navigateTo({
					url: '/pages/production/opTask/opMaterial?item=' + item
				})
			},
			onReport(data) {
				var item = encodeURIComponent(JSON.stringify(data)).replace(/%/g, '%25')
				uni.navigateTo({
					url: '/pages/production/opTask/opReport?item=' + item
				})
			},
			onFinish(data) {
				uni.showModal({
					title: "完工提醒",
					content: "是否完工" + data.projectName + "项目" + data.opName + "工序?",
					showCancel: true,
					cancelText: '否',
					confirmText: '是',
					success: res => {
						if (res.confirm) {
							opFinish({
								opPlanId: data.opPlanId
							}).then(resp => {
								if (resp.err_code == 10000) {
									uni.showToast({
										title: '完工成功',
										icon: 'none',
										duration: 2000
									});
									this.onQuery()
								} else {
									uni.showToast({
										title: resp.err_msg,
										icon: 'none',
										duration: 2000
									})
								}
							})
						}
					}
				})
			},
			stop(data) {
				this.showPause = true
				this.stopData = data
			},
			close() {
				this.showPause = false
				this.productionStatus = false
				this.showBom =false
			},
			
			opStop(data) {
				opStop({
					opPlanId: this.stopData.opPlanId,
					reason: this.pauseReason
				}).then(res => {
					if (res.err_code === 10000) {
						this.showPause = false
						this.onQuery()
					} else {
						uni.showToast({
							title: resp.err_msg,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			
			andon(data) {
				var item = encodeURIComponent(JSON.stringify(data)).replace(/%/g, '%25')
				uni.navigateTo({
					url: '/pages/production/opTask/andon?item=' + item
				})
			},
			
			restart(data) {
				uni.showModal({
					title: "恢复提醒",
					content: "确认恢复" + data.projectName + "项目" + data.opName + "工序?",
					showCancel: true,
					cancelText: '否',
					confirmText: '是',
					success: res => {
						if (res.confirm) {
							opRestart({
								opPlanId: data.opPlanId
							}).then(resp => {
								if (resp.err_code == 10000) {
									uni.showToast({
										title: '恢复',
										icon: 'none',
										duration: 2000
									});
									this.onQuery();
								} else {
									uni.showToast({
										title: resp.err_msg,
										icon: 'none',
										duration: 2000
									})
								}
							})
						}
					}
				})
			},
			//下拉
			pullDown() {
				let totalPage = Math.ceil(this.total / this.listQuery.pg_pagesize)
				if (this.listQuery.pg_pagenum + 1 > totalPage) {
					uni.hideNavigationBarLoading();
					this.$u.toast('无更多数据');
				} else {
					this.listQuery.pg_pagenum += 1;
					this._onQuery(true);
				}
			},

			qualityCheck(item) {
				let params = {
					...this.formatQualityPublicParams(item),
				}
				uni.navigateTo({
					url: '/pages/quality/check?options=' + JSON.stringify(params)
				});
			},
			
			formatQualityPublicParams(item) {
				return {
					drawingNo: item.drawingNo,
					productModel: item.productModel,
					productNo: item.productNo,
					projectName: item.projectName,
					opPlanId: item.opPlanId,
					positionId: item.positionId,
					checkStatus: item.checkStatus,
					productCate: item.productCate,
					procedureId: item.opStandMark
				}
			}
		},


	}
</script>

<style lang="scss" scoped>
	.main {
		width: 90%;
		margin: 0 auto;
	}

	.queliao {
		background-color: #C0C4CC;
	}

	.queliao_header {
		position: relative;
		display: flex;
		align-items: center;
	}

	.queliao_header .queliao_button {
		position: absolute;
		right: 15rpx;
	}

	.header_productNo {
		margin: 0 15rpx;
		font-size: 12rpx;
		text-align: center;
		border-radius: 5rpx;
		background-color: #F3F4F6;
		border: 1rpx solid pink;
		width: 185rpx;
		height: 30rpx;
		line-height: 30rpx;
	}

	.header_text {
		margin-top: 5rpx;
		margin-bottom: 5rpx;
		width: 120rpx;
		height: 25rpx;
		line-height: 25rpx;
		background-color: white;
		box-sizing: border-box;
		border: 1rpx solid pink;
		text-align: center;
	}

	.con {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.item-main {
		display: flex;
	}

	.item-right {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin: 0 5rpx;
		// flex: 1;
	}

	.item-right button {
		width: 100px;
		height: 100px;
		margin: 10px;
		border-radius: 18px;
		background-color: #1AAD19;
		font-size: 18px;
		line-height: 100px;
		color: white;
	}

	.item-right button+button+button {
		background-color: #E54D42;
	}

	.item-left {
		width: 220rpx;
		// flex: 0;
	}

	.left-texts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.left-texts text+text {
		line-height: 1.6;
	}

	.left-texts text {
		background-color: #F3F4F6;
		margin-top: 18px;
		margin-right: 18px;
		font-size: 22px;
		width: 345px;
		height: 74px;
		line-height: 32px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		text-align: left;
		padding: 0 10px;
	}

	.item {
		margin-top: 6rpx;
		background-color: white;
		border-radius: 5rpx;
		padding: 10rpx 10rpx 10rpx;
		width: 100%;
		position: relative;
	}

	.item-header {
		// position: absolute;
		// top: -20rpx;
		// left: -5rpx;
		display: flex;
		align-items: center;
	}

	.header-text {
		padding: 5rpx 8rpx;
		margin-left: 0;
		background-color: #F3F4F6;
		border-radius: 10rpx;
		border: 1rpx solid #a0cfff;
		font-size: 15rpx;
		display: flex;
		align-items: flex-start;
		width: 100%;

		.header-text-item {
			margin-right: 8rpx;
		}

		.status {
			color: rgb(48, 178, 234);
		}
	}

	.tag-j,
	.tag-z {
		min-width: 56rpx;
		text-align: center;
		border-radius: 3rpx;
		background-color: red;
		margin-left: 20rpx;
		font-size: 12rpx;
		height: 28rpx;
		line-height: 26rpx;
		box-sizing: border-box;
	}

	.tag-z {
		background-color: pink;
		border: 1rpx solid red;
		color: #09BB07;
	}

	.tag-j {
		background-color: #CCE6FF;
		border: 1rpx solid #0FAEFF;
		color: #007AFF;
	}

	.header {
		border-bottom: 5px solid #aaa;
	}

	.headerp {
		border-bottom: 5px solid #aaa;
		position: relative;
		display: inline-flex;
		margin-bottom: 0px;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
	}

	.product {
		font-size: 14px;
		margin-top: 14px;
		margin-left: 10px;
		margin-right: 10px;
		margin-bottom: 14px;
	}

	.input-view {
		width: 100rpx;
		float: right;
		margin-right: 0;
	}

	.tag-s {
		min-width: 56rpx;
		text-align: center;
		border-radius: 3rpx;
		background-color: red;
		margin-left: 20rpx;
		font-size: 12rpx;
		height: 56rpx;
		line-height: 26rpx;
		box-sizing: border-box;
	}

	.tag-s {
		background-color: #CCE6FF;
		border: 1rpx solid #0FAEFF;
		color: #ff5500;
	}

	.tag-s2 {
		margin-top: 5rpx;
		min-width: 56rpx;
		text-align: center;
		border-radius: 3rpx;
		background-color: red;
		margin-left: 0;
		font-size: 12rpx;
		min-height: 28rpx;
		line-height: 26rpx;
		box-sizing: border-box;
		text-align: left;
		padding: 6px;
	}

	.tag-s2 {
		background-color: #FFFFCC;
		border: 1rpx solid #0FAEFF;
		color: #0099CC;
	}

	.report-btn {
		background-color: #007AFF !important;
	}

	.assess-btn {
		background-color: rgb(78, 213, 199) !important;
	}
</style>