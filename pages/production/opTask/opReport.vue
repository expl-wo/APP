<template>
	<view class="content">
		<view class="main safe-margin-bottom">
			<view class="xui-reset">
				<u--form id="main-form" class="main-form" labelPosition="left" :model="model" ref="form1">
					<u-form-item label="报工人:" prop="model.userName" addClass="form-name large-form">
						<u-input :height="24" placeholder="请选择" @click.native="handleSelectOp" v-model="model.userName"
							type="select"></u-input>
					</u-form-item>
					<u-form-item class="btnGroup mr_20">
						<u-button class="bu_W" type="primary" @click="report">报工</u-button>
						<u-button class="bu_W" type="success" @click="finish">完工</u-button>
					</u-form-item>
					<u-form-item style="margin-left: 5rpx;">
						<!-- <view>操作者:<span style="color: #aaa;margin-left: 4rpx;">{{lgn.dataList.name}}</span></view> -->
					</u-form-item>
					<u-form-item style="margin-left: 5rpx;">
						<view>生产号:<span style="color: #ED1C24">{{ opData.productNoMain }}</span></view>
					</u-form-item>
				</u--form>
			</view>
			<view class="main-wrapper">
				<view class="main-content">
					<view class="main-table xui-reset">
						<uni-table ref="table" rowKey="userId" :data="tableList" border type="selection"
							emptyText="暂无更多数据" @selection-change="selectionChange">
							<uni-tr>
								<uni-th width="150" align="center">姓名</uni-th>
								<uni-th width="120" align="center">工时</uni-th>
								<uni-th align="center">工作内容</uni-th>
								<uni-th align="center">备注</uni-th>
								<uni-th width="80" align="center">操作</uni-th>
							</uni-tr>
							<uni-tr v-for="(item, index) in tableList" :key="item.userId" :keyValue="item.userId"
								ref="trItem">
								<uni-td align="center">{{item.userName}}</uni-td>
								<uni-td align="center">
									<u-input v-model="item.workTime" type="digit" placeholder="请输入工时" inputAlign="center"
										height="80px" />
								</uni-td>
								<uni-td align="center">{{item.content}}</uni-td>
								<uni-td align="center">{{item.remark}}</uni-td>
								<uni-td align="center">
									<u-button type="error" @click="deleteRowData(item, index)">删除</u-button>
								</uni-td>
							</uni-tr>
						</uni-table>
					</view>
					<view class="main-workSelect">
						<view class="main-workSelect-title" style="padding-bottom: 4px;">
							工作内容选择:
						</view>
						<view class="main-workSelect-panel">
							<view v-for="(item, index) in checkboxList" :key="index" class="slider-item-wrapper">
								<view class="item-slider-wrapper">

									<view style="margin-left: 5px;">
										<u-checkbox-group>
											<u-checkbox :checked="item.checked" @change="contentCheckboxChange(item)"
												:disabled="item.historyRatios>0"></u-checkbox>
										</u-checkbox-group>
									</view>

									<view class="item-slider-content">
										<text style="margin-left: 5px;">{{item.opName}}:{{item.ratios}}%</text>
										<view class="u-page__slide-item" style="margin-top: 0px;">
											<u-slider @change="stepChange(item)" :disabled="!item.checked && item.historyRatios == 100" v-model=" item.ratios"
												  block-size="18"
												style="width: 100%;">
											</u-slider >
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="main-remark">
							<view style="margin-right: 10px;">
								备注
							</view>
							<input class="uni-input" v-model="remark" />
							<button type="primary" class="uni-btn" @click="joinContent">加入</button>
						</view>
					</view>
				</view>
				<view class="main-right">
					<view class="right-title">暂停原因选择：</view>
					<view class="right-content-wrapper">
						<view class="right-content-item">
							<u-radio-group v-model="reason" wrap :size="3" canEmpty>
								<u-radio :customStyle="{ marginRight: '16px' }" v-for="(item, index) in pauseReason"
									:key="index" :name="item.name">{{item.name}}</u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="right-content-wrapper">
						<u-button @click="stop()" type="primary" class="uni-btn">暂停</u-button>
					</view>
				</view>
			</view>
		</view>

		<u-modal v-show="finishedShow" content="是否报工" confirmText="是" cancelText="否"
			@confirm="finishedShow = false;report()" @cancel="finishedShow = false;" confirmColor="#606266"
			showCancelButton :mask-close-able="true" @close="finishedShow = false"></u-modal>

		<u-modal v-show="finishedJobShow" content="是否完工" confirmText="是" cancelText="否"
			@confirm="finishedJobShow = false;finish()" @cancel="finishedJobShow = false;" confirmColor="#606266"
			showCancelButton :mask-close-able="true" @close="finishedJobShow = false">
		</u-modal>

		<!--操作者弹窗-->
		<u-popup mode="bottom" :show="dialogOpVisible" @close="close" heigth="50%">
			<view class="content xui-reset">
				<u--form class="popup-btn__wrapper" style="display: flex;">
					<u-form-item label="报工人:" prop="model.userName" addClass="form-name large-form">
						<u-input class="uni-input" clearable placeholder="工号/姓名" v-model="search"
							@input="queryUserTime()" />
					</u-form-item>
					<u-form-item>
						<u-button class="uni-btn" type="primary" @click="$refs.table2.clearSelection();queryClazz()">查询班组成员</u-button>
						<u-button class="uni-btn" type="primary" @click="$refs.table2.clearSelection();queryTeam()">查询小组成员</u-button>
					</u-form-item>
					<u-form-item>
						<u-button class="uni-btn" type="success" @click="selectUserConfirm">确定</u-button>
					</u-form-item>

				</u--form>
				<scroll-view scroll-y="true" style="height:250rpx">
					<view class="app-containerC wp table-zdy mini-table">
						<uni-table ref="table2"  border stripe type="selection"  emptyText="暂无更多数据" @selection-change="selectionChange2">
							<uni-tr>
								<uni-th align="center">工号</uni-th>
								<uni-th align="center">姓名</uni-th>
								<uni-th align="center">今日已报工时</uni-th>							
							</uni-tr>
							<uni-tr v-for="(item, index) in userList" :key="index">
								<uni-td align="center">{{ item.userId }}</uni-td>
								<uni-td align="center">
									<view class="name">{{ item.userName }}</view>
								</uni-td>
								<uni-td align="center">{{ item.workTime }}</uni-td>
							</uni-tr>
						</uni-table>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		queryTeamMember,
		queryClazzMember,
		opReport,
		opFinish,
		opStop,
		getOpInfo,
		getPauseReason
	} from "@/https/production/proudction.js"
	export default {
		data() {
			return {
				opData: {},
				userData: [],
				model: {
					userName: '',
					userList: []
				},
				userList: [],
				search: '',
				pauseReason: [],
				reason: '',
				finishedShow: false,
				finishedJobShow: false,
				tableList: [],
				checkboxList: [],
				dialogOpVisible: false,
				reportView: false,
				finishView: false,
				selectedAll: false,
				coilType: 0,
				remark: '',
				alreadyChooseUser: [],
				selectedIndexs:[],
			}
		},
		methods: {
			handleSelectOp() {
				this.dialogOpVisible = true;
				this.$nextTick(()=>{
					this.$refs.table2.toggleRowSelection(this.selectedIndexs)
				})
				
			},
			stop() {
				opStop({opPlanId:this.opData.opPlanId,reason:this.reason}).then(res =>{
					if (res.err_code === 10000) {
						uni.showToast({
							title: '暂停成功'
						});
						uni.navigateBack()
						return;
					} else {
						uni.showToast({
							title: res.err_msg
						});
						return;
					}
				})
			},
			// 加入工作内容
			joinContent() {
				let content = ''
				this.checkboxList.forEach(item => {
					if (item.checked && item.ratios > item.historyRatios)
						content += item.opName + item.ratios + '%;'
				})
				console.log(this.alreadyChooseUser);
				this.$forceUpdate();
				this.alreadyChooseUser.forEach(item =>{
					this.tableList[item].content = content.substr(0, content.length - 1)
					this.tableList[item].remark = this.remark
				})
			},
			stepChange(data){
				if(data.ratios< data.historyRatios){
					data.ratios = data.historyRatios
				}
			},
			//查询小组成员
			queryTeam() {				
				this.selectedIndexs = []
				this.tableList = []
				this.model.userName = ''
				queryTeamMember().then(res => {
					this.userList = res.data
				})
			},
			//查询班组成员
			queryClazz() {			
				this.selectedIndexs = []
				this.tableList = []
				this.model.userName = ''
				queryClazzMember().then(res => {
					this.userList = res.data
				})
			},
			selectionChange2(e) {
				console.log(e)			
				this.$forceUpdate()
				e.detail.index.forEach(item =>{
					this.userList[item].checked=true
				})
				this.selectedIndexs = e.detail.index
			},
			//确认勾选da'ta
			selectUserConfirm() {
				this.tableList = [];
				console.log(this.model.userList);
				console.log(this.userList);
				let selectedUserList = [...new Set([ ...this.model.userList,...this.userList.filter((item,index) => {
					return this.selectedIndexs.indexOf(index) !== -1;
				})])]

				selectedUserList = selectedUserList.filter(item => {
					return item.checked
				})

				if (selectedUserList.length === 0) {
					uni.showToast({
						title: '您未勾选操作者'
					});
					return;
				}

				if (selectedUserList.length > 1) {
					this.model.userName = selectedUserList[0].userName + '...';
				} else {
					this.model.userName = selectedUserList[0].userName;
				}
				this.model.userList = selectedUserList;
				this.addBaseDataTime();
				this.dialogOpVisible = false;
				let that = this;
				setTimeout(function() {
					that.$refs.table.selectionAll();
				}, 500)
			},
			queryUserTime() {
				let that = this;
				setTimeout(function() {
					that.$refs.table.selectionAll();
				}, 500)
			},

			report() {
				var flag = true;
				
				if(this.tableList.length<1){
					uni.showToast({						 
						title: "请选择报工人"
					});
					flag = false;
					return;
				}
				this.tableList.forEach(item => {
					if(item.workTime == null || item.workTime <= 0){					  
					  uni.showToast({				  	 
					  	title: "存在未填写工时的数据"
					  });
					  flag = false;
					}
					if (item.content == null) {
					  uni.showToast({
					  	 
					  	title: "存在未填写工作内容的数据"
					  });
					  // canReport = false						  
					}			
				})
				
				let param = this.reportDataInit()
				
				if(flag){
					if(param.reportDetails.length == 0){
						uni.showToast({
							title: "报工内容不能为空"
						});
						return;
					} else{
						opReport(param).then(res => {
							if (res.err_code === 10000) {
								uni.showToast({
									title: '报工成功'
								});
								uni.navigateBack()						
								return;
							} else {
								uni.showToast({
									title: res.err_msg
								});
								return;
							}
						})
					}
				}
				
				
				
			},
			finish() {
				var flag = true;
				
				this.tableList.forEach(item => {
					if(item.workTime == null || item.workTime <= 0){					  
					  uni.showToast({				  	 
					  	title: "存在未填写工时的数据"
					  });
					  flag = false;
					}
					if (item.content == null) {
					  uni.showToast({
					  	 
					  	title: "存在未填写工作内容的数据"
					  });
					  flag = false;				  
					}			
				})
				this.checkboxList.forEach(item => {
					if (item.checked == true && item.ratios < 100) {
						flag = false;
						uni.showToast({
							title: '有工作内容未完成'
						});
						return;
					}
				})	
				if(flag){
					let param = this.reportDataInit()
					opFinish(param).then(res => {
						if (res.err_code === 10000) {
							uni.showToast({
								title: '完工成功'
							});
							uni.navigateBack()	
							return;
						} else {
							uni.showToast({
								title: res.err_msg
							});
							return;
						}
					})
				}
				
			},
			reportDataInit() {
				
				let param = {
					opPlanId: this.opData.opPlanId,
					reportDetails: [],
					usableProgresses: []
				}
				let workProgresses = []
				this.checkboxList.forEach(item => {
					if (item.checked == true) {
						param.usableProgresses.push({
							id: item.id,
							usable: "1"
						})
						if (item.ratios > item.historyRatios) {
							workProgresses.push({
								id: item.id,
								ratios: item.ratios
							})
						}
					} else {
						param.usableProgresses.push({
							id: item.id,
							usable: "0"
						})
					}
				})	
				this.tableList.forEach(item => {
					console.log(item);
					if(workProgresses.length>0){
						let reportDetail = {
							reporter: item.reporter,
							standardTime: item.workTime,
							workProgresses: workProgresses,
							remarks: item.remark,
							approval: 0,
						}
						param.reportDetails.push(reportDetail)
					}				
				})
				console.log(param);
				return param
			},
			close() {
				this.dialogOpVisible = false
				// console.log('close');
			},
			selectionChange(val) {
				this.alreadyChooseUser = val.detail.index;
			},
			addBaseDataTime() {
				//this.tableList = [];
				let selectedUserList = this.model.userList
				
				selectedUserList.forEach(item => {
					var obj = {}					
					obj = this.tableList.find(e => {
						return e.userCode === item.userCode
					})
					if (obj == null) {
						let baseDataItem = {
							reporter: item.userCode,
							userName: item.userName,
							workTime: null,
							content: '',
							remarks: '',
							status: '待审核',
							produceId: [],
							statusClass: 'un-verify',
						}
						if (baseDataItem.reporter != null && baseDataItem.reporter != "") {
							this.tableList.push(baseDataItem);
						}
					}
				})

			},
			addBaseDataProduce() {
				var produce = [];
				let produceString = '';
				let x = this.alreadyChooseUser;
				console.log(x);
				this.checkboxList.forEach(item => {
					if (item.ratios != 0 && item.ratios != null && (item.checked == true)) {
						let index = this.historyCheckboxList.findIndex(value => item.id == value.id);
						if (index != -1 && this.historyCheckboxList[index].ratios != item.ratios) {
							produce.push({
								id: item.id,
								ratios: item.ratios + ""
							});
							produceString = produceString + item.opName + (item.ratios + '') + '%' + ','
						}
					}
				})
				console.log(produceString);
				x.forEach(item => {
					this.tableList[item].content = produceString;
					this.tableList[item].remarks = this.remarksData;
					this.tableList[item].produceId = [];
					this.tableList[item].produceId = this.tableList[item].produceId.concat(produce);
				})
			},
			contentCheckboxChange(item) {
				item.checked = !item.checked
			},
			deleteRowData(row, trIndex) {
				console.log('deleteRowData:' + JSON.stringify(row));
				let trRef = this.$refs.trItem[trIndex];
				this.selectedIndexs.splice(trIndex,1);
				
				this.model.userList = this.model.userList.filter(item => item.id != row.userId)
				this.tableList.some((item, i) => {
					if (item === row) {
						this.tableList.splice(i, 1);
						return true;
					} else {
						return false;
					}
				})
			},
		},
		onLoad(e) {
			console.log(e);
			this.opData = JSON.parse(decodeURIComponent(e.item))
			getOpInfo({
				opPlanId: this.opData.opPlanId
			}).then(res => {
				let result = res.data.opplanList
				result.forEach(item => {
					item.checked = true
					if (item.ratios == -1) item.checked = false
					item.ratios = parseInt(item.ratios)
					item.historyRatios = item.ratios
				})
				this.coilType = res.data.coilType
				if (res.data.coilProperty != undefined) {
					this.coilList = res.data.coilProperty
				}
				this.checkboxList = result
				
				
				if(this.opData.opStatus == 1){
				  queryClazzMember().then(re => {
				    this.userList = re.data
				    this.userList.forEach( (item,index) =>{
				      res.data.participants.forEach(i =>{
				        if(i.personId == item.userCode){              
				          console.log("111",item)
						  this.selectedIndexs.push(index)
				          this.tableList.push({
				            ...item,
				            workTime : null,
							reporter: item.userCode
				          })
						  this.alreadyChooseUser.push(this.tableList.length-1)
						  
				        }
				      })
				    })
					this.$nextTick(()=>{
						this.$refs.table.selectionAll()
					})
				  })
				}
			})
			getPauseReason().then(res => {
				if (res.err_code === 10000) {
					this.pauseReason = res.data
				} else {


				}
			})
			
		}
	}
</script>

<style lang="scss" scoped>
	// @import "uview-ui/index.scss";
	.main-form {
		margin: 5px;
		height: 60px;
	}

	.u-form-item {
		margin: 20px;
	}

	.u-form-item .u-button {
		margin: 10px;
		min-width: 100px;
	}

	.content-select {
		padding: 4px;
		background: #FFF;

		.content-label {
			padding-bottom: 4px;
		}
	}

	.bu_W {
		width: 150px;
	}


	/deep/ .u-select__body__picker-view__item {
		font-size: 23px;
	}
</style>