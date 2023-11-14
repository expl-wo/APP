<template>
	<view>
		<view class="xui-check-header xui-table-wrapper" style="height: 30px;margin-top: 6px;">
			<view class="item ml-10">生产号：{{entity.productNo}}</view>
			<view class="item ml-10">项目名称：{{entity.projectName}}</view>
			<view class="item ml-10">型号：{{entity.productModel}}</view>
			<view class="item ml-10 flex-default" >状态：<u--text type="primary" :text="checkStatusChs"></u--text></view>
		</view>
		<view class="xui-check-header xui-table-wrapper ml-10" v-if="frontStepRejectReason && checkStatus < 1">
			驳回理由：{{frontStepRejectReason}}
		</view>
		<view class="xui-check-header xui-table-wrapper ml-10 mb-5" style="height: 30px;" v-if="checkStatus<=2">
			<button class="uni-button mr-5" type="primary" v-if="checkStatus < 1" size="mini"
				@click="handleAddCheckItem">添加检验项</button>
			<button class="uni-button mr-5" type="yellow" v-if="checkStatus < 2" size="mini"
				@click="handleSave">暂存</button>
			<button class="uni-button mr-5" type="success" v-if="checkStatus < 2" size="mini"
				@click="handleSubmit">提交</button>
			<button class="uni-button mr-5" type="success" v-if="checkStatus == 2" size="mini"
				@click="handleShowScan">扫工牌确认</button>
			<button class="uni-button mr-5" type="success" v-if="checkStatus == 2" size="mini"
				@click="handleShowAccount">账号确认</button>
			<button class="uni-button mr-5" type="warn" v-if="checkStatus == 2" size="mini"
				@click="handleReject">驳回</button>
		</view>
		<view class="check-table" style="min-width: 98vw;margin-left: 1vw;">
			<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center" width="80">序号</uni-th>
					<uni-th align="center" width="150">检验项名称</uni-th>
					<uni-th align="center">检验项明细</uni-th>
					<uni-th align="center" width="90">数据类型</uni-th>
					<uni-th align="center" width="140" v-if="checkStatus >= 1">自检结果</uni-th>
					<uni-th align="center" width="140" v-if="checkStatus >= 2">兼检结果</uni-th>
					<uni-th align="center" width="160" v-if="checkStatus < 2">检验结果</uni-th>
					<uni-th align="center" width="90" v-if="checkStatus < 1">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in checkDatas" :key="index">
					<uni-td align="center">{{ index+1 }}</uni-td>
					<uni-td align="center">
						{{ item.itemName }}
					</uni-td>
					<uni-td align="center">
						{{ item.itemRequest }}
					</uni-td>
					<uni-td align="center">
							<u--text type="success" v-if="item.valueCate==1" text="判断"></u--text>
							<u--text type="info" v-else text="填报"></u--text>
					</uni-td>
					<uni-td align="center" v-if="checkStatus >= 1">
						<view :key="index+ 'selfResultDesc'">{{ item.selfResultDesc }}</view>
					</uni-td>
					<uni-td align="center" v-if="checkStatus >= 2">
						<view :key="index+ 'multiResultDesc'">{{item.multiResultDesc}}</view>
					</uni-td>
					<uni-td  align="center" v-if="checkStatus < 2">
						<view v-if="item.valueCate !=1">
							<u-input :disabled="item.isApplicable===1" :fontSize="8" placeholder="检测值" border="surround" v-model="item.value"></u-input>
						</view>
						<view v-else>
							<u-radio-group :disabled="item.isApplicable===1" v-model="item.value">
								<u-radio  labelSize="8" iconSize="6" v-for="(itemOpt, index) in selectOptions"
									:key="index" :label="itemOpt.label" :name="itemOpt.name">
								</u-radio>
							</u-radio-group>
						</view>
					</uni-td>
					<uni-td align="center" v-if="checkStatus < 1">
						<view class="uni-group">
							<button v-if="item.isApplicable===1"  class="uni-button" size="mini" @click="handleDeleteRow(item,0)"
								type="success">启用</button>
							<button v-else  class="uni-button" size="mini" @click="handleDeleteRow(item,1)"
								type="warn">禁用</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>

		<!-- 选择 -->
		<u-popup mode="bottom" :show="moreCheckItemShow">
			<view class="content">
				<view class="rejectPopupBtnWrapper">
					<button type="primary" size="mini" @click="handleSelectItem">添加</button>
					<button type="default" size="mini" @click="moreCheckItemShow=false">取消</button>
				</view>
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<uni-table style="width: 98vw;margin-left: 1vw;margin-right: 1vw;" ref="table" border stripe type="selection" emptyText="暂无更多数据"
						@selection-change="selectionChange">
						<uni-tr>
							<uni-th width="150" align="center">检验项名称</uni-th>
							<uni-th width="150" align="center">检验项明细</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in moreCheckItemList" :key="index">
							<uni-td align="center">{{ item.itemName }}</uni-td>
							<uni-td align="center">{{ item.itemRequest }}</uni-td>
						</uni-tr>
					</uni-table>
				</scroll-view>
			</view>
		</u-popup>
		<u-popup :show="rejectShow">
			<view>
				<view class="rejectPopupBtnWrapper">
					<button type="primary" size="mini" @click="handleSubmitReject">确定</button>
					<button type="default" size="mini" @click="rejectShow=false">取消</button>
				</view>
				<view class="textWrapper" v-if="rejectShow">
					<u--textarea v-model="rejectReason" placeholder="请输入驳回理由" focus clearable></u--textarea>
				</view>
			</view>
		</u-popup>
		<u-popup :show="scanShow">
			<view class="rejectPopupBtnWrapper">
				<button type="primary" size="mini" @click="handleScanSubmit">确定</button>
				<button type="default" size="mini" @click="scanShow=false">取消</button>
			</view>
			<view v-if="scanShow">
				<view class="textWrapper">
					<u-input v-model="scanResultCode" placeholder="请扫描工牌二维码" focus clearable></u-input>
				</view>
			</view>
		</u-popup>
		<u-popup :show="accountShow">
			<view class="rejectPopupBtnWrapper">
				<button type="primary" size="mini" @click="handleAccountSubmit">确定</button>
				<button type="default" size="mini" @click="accountShow=false">取消</button>
			</view>
			<view class="textWrapper">
				<u-form :model="accountForm" ref="uForm" :rules="rules">
					<u-form-item prop="username">
						<u-input v-model="accountForm.username" placeholder="请输入用户名" prefixIcon="account"
							prefixIconStyle="font-size: 22px;color: #3c9cff;">
						</u-input>
					</u-form-item>
					<u-form-item prop="password">
						<u-input :key="passwordType" :type="passwordType" confirmType="done" v-model="accountForm.password"
							placeholder="请输入密码" prefixIcon="lock" prefixIconStyle="font-size: 22px;color: #3c9cff"
							@confirm="handleAccountSubmit">
							<template slot="suffix">
								<u-icon slot="right" :color="passwordType === 'password' ? '#606266' : '#3c9cff'"
									name="eye" @click="handleChangePasswordType"></u-icon>
							</template>
						</u-input>
					</u-form-item>
				</u-form>
			</view>
		</u-popup>
		
		<u-popup mode="bottom" :show="multiCheckItemShow">
			<view class="content">
				<view class="rejectPopupBtnWrapper">
					<button type="primary" size="mini" @click="handleSubmitReject">确定</button>
					<button type="default" size="mini" @click="multiCheckItemShow=false">取消</button>
				</view>
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="textWrapper">
						<u--textarea v-model="rejectReason" placeholder="请输入驳回理由" focus clearable></u--textarea>
					</view>
					<uni-table style="width: 98vw;margin-left: 1vw;margin-right: 1vw;" ref="table" border stripe emptyText="暂无更多数据">
						<uni-tr>
							<uni-th width="150" align="center">检验项名称</uni-th>
							<uni-th width="150" align="center">检验项明细</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in rejectDataList" :key="index">
							<uni-td align="center">{{ item.itemName }}</uni-td>
							<uni-td align="center">{{ item.itemRequest }}</uni-td>
						</uni-tr>
					</uni-table>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getCheckInfo,
		getTestByOpStand,
		disableTestRecord,
		saveTestRecordFill,
		saveCheck,
		onSpecialEnsure,onSpecialEnsure2,getSpChecherInfo,onCheckRestart,addEmptyTestRecord
	} from '@/https/quality/quality.js'
	import {
		transformDictDetail
	} from '@/components/xui/xui-dictionary/index'
	export default {
		data() {
			/*  */
			return {
				loading: false,
				entity: {},
				checkDatas: [],
				checkStatus: '',
				frontStepRejectReason: '',
				checkStatusChs: '',
				selectOptions: [{
					name: '1',
					label: '是'
				}, {
					name: '0',
					label: '否'
				}],

				moreCheckItemShow: false,
				moreCheckItemList: [],
				selectedIndexs: [],

				rejectShow: false,
				rejectReason: '',


				//显示上次的驳回理由
				showRejectDesc: false,
				rejectDesc: '',

				//扫工牌确认
				scanShow: false,
				scanResultCode: '',

				//账号确认
				accountShow: false,
				accountForm: {
					username: '',
					password: ''
				},
				passwordType: 'password',
				rules: {
					'username': {
						type: 'string',
						required: true,
						message: '不能为空',
						trigger: ['blur', 'change']
					},
					'password': {
						type: 'string',
						required: true,
						message: '不能为空',
						trigger: ['blur', 'change']
					},
				},
				
				//兼检驳回
				multiCheckItemShow: false,
				rejectDataList: []
				
			}
		},
		onLoad(queryData) {
			this.entity = JSON.parse(queryData.options);
		},
		onShow() {
			this.getCheckData();
		},
		computed: {
			type() {
				if (this.checkStatus <= this.$constants.checkStatus.SelfCheck) {
					return this.$constants.checkStatus.SelfCheck;
				} else if (this.checkStatus <= this.$constants.checkStatus.Initial) {
					return this.$constants.checkStatus.Initial;
				} else if (this.checkStatus <= this.$constants.checkStatus.Special) {
					return this.$constants.checkStatus.Special;
				} else {
					return this.$constants.checkStatus.UnknownCheck;
				}
			},
		},
		methods: {
			getCheckData() {
				let params = {
					opPlanId: this.entity.opPlanId
				}
				getCheckInfo(params).then(async res => {
					let checkDatas = res.data.checkItems;
					checkDatas.forEach(async item => {
						if (item.valueCate != 1) {
							item.selfResultDesc = item.selfCheckValue;
							item.multiResultDesc = item.initialCheckValue;
							if(this.$constants.isNullOrEmpty(item.value)){
								item.value = '1';
							}
						} else {
							item.selfResultDesc = await transformDictDetail('flag01', item
								.selfCheckValue);
							item.multiResultDesc = await transformDictDetail('flag01', item
								.initialCheckValue);
						}
					})
					this.checkStatus = res.data.checkStatus;
					this.frontStepRejectReason = res.data.rejectReason;
					this.checkStatusChs = await transformDictDetail('checkStatusType', this.checkStatus);
					this.$nextTick(()=>{
						setTimeout(()=>{
							this.checkDatas = checkDatas;
						}, 100);
					})
				})
			},
			handleDeleteRow(item,param) {
				// let index = this.checkDatas.indexOf(item);
				// if (index >= 0) {
				// 	this.checkDatas.splice(index, 1);
				// }
				disableTestRecord({
				  opPlanId: this.entity.opPlanId,
				  itemId: item.id,
				  isApplicable: param
				}).then(res => {
				  if (res.err_code == 10000) {
				    if (param === 1) {
						uni.showToast({
							icon: 'none',
							title: '禁用成功！'
						})
				    } else {
						uni.showToast({
							icon: 'none',
							title: '启用成功！'
						})
				    }
				    this.getCheckData()
				  } else {
					  uni.showToast({
					  	icon: 'none',
					  	title: res.err_msg
					  })
				  }
				})
			},
			handleAddCheckItem() {
				this.selectedIndexs = [];
				this.moreCheckItemShow = true;
				this.getMoreCheckItemData();
			},
			//必填内容
			validateData() {
				if (this.checkDatas.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '没有检验项，请添加'
					})
					return false;
				}
				let canSubmit = true;
				this.checkDatas.find(item => {
					if (this.$constants.isNullOrEmpty(item.value)) {
						uni.showToast({
							icon: 'none',
							title: `${item.itemName}检验项的值为空`
						})
						canSubmit = false;
						return true;
					} else {
						return false;
					}
				})
				return canSubmit;
			},
			handleSave() {
				let list = this.checkDatas.map(item => {
					return {
						recordId: item.recordId,
						value: item.value
					}
				})
				saveTestRecordFill({
					list
				}).then(response => {
					if (response.err_code === this.$constants.status.success2) {
						uni.showToast({
							icon: 'none',
							title: `数据暂存成功`
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: response.err_msg
						})
					}
				})
			},
			handleSubmit() {
				if (!this.validateData()) {
					return;
				}
				let list = this.checkDatas.map(item => {
					return {
						recordId: item.recordId,
						value: item.value
					}
				})
				let params = {
					opPlanId: this.entity.opPlanId,
					type: this.type,
					checkItems: list
				}
				saveCheck(params).then(response => {
					if (response.err_code === this.$constants.status.success2) {
						if(response.data === 10000){
							uni.showToast({
								icon: 'none',
								title: `数据提交成功`
							})
							setTimeout(()=>{
								uni.navigateBack({
									delta: 1
								});
							}, 2000);
						}else{
							//说明是兼检，需要提交驳回理由
							this.rejectDataList = response.data;
							this.multiCheckItemShow = true;
							this.getCheckData();
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: response.err_msg
						})
					}
				})
			},
			handleReject() {
				this.rejectShow = true;
			},
			getMoreCheckItemData() {
				let params = {
					opPlanId: this.entity.opPlanId,
					procedureId: this.entity.procedureId,
					productCate: this.entity.productCate
				}
				getTestByOpStand(params).then(response => {
					this.moreCheckItemList = response.data;
				})
			},
			// 多选处理
			selectedItems() {
				return this.selectedIndexs.map(i => this.moreCheckItemList[i])
			},
			// 多选
			selectionChange(e) {
				this.selectedIndexs = e.detail.index;
			},
			handleSubmitReject() {
				if(this.$constants.isEmpty(this.rejectReason)){
					this.$u.toast("驳回理由不能为空");
					return;
				}
				onCheckRestart({
					opPlanId: this.entity.opPlanId,
					rejectReason: this.rejectReason
				}).then(res => {
					if (res.err_code == 10000) {
						uni.showToast({
							icon: 'none',
							title: '驳回成功，已驳回到自检流程!'
						})
						//返回到上一个页面
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							});
						}, 2000)
						/* this.getCheckData();
						this.rejectShow = false; */
					} else {
						uni.showToast({
							icon: 'none',
							title: res.err_msg
						})
					}
				})
			},
			handleSelectItem() {
				if (!this.selectedIndexs || this.selectedIndexs.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请选择添加的检验项'
					})
					return;
				}
				let selectItems = this.selectedItems().map(item => {
					return item.id
				});
				addEmptyTestRecord({
					opPlanId: this.entity.opPlanId,
					itemId: selectItems
				}).then(response => {
					this.getCheckData();
					this.moreCheckItemShow = false;
				})
			},
			handleShowScan() {
				this.scanShow = true;
				this.scanResultCode = '';
			},
			handleShowAccount() {
				this.accountShow = true;
				this.accountForm = {
					username: '',
					password: ''
				}
			},
			handleScanSubmit() {
				if(this.$constants.isNullOrEmpty(this.scanResultCode)){
					uni.$u.toast('请扫描工牌后再确认');
					return;
				}
				onSpecialEnsure({
					userCode: this.scanResultCode,
					opPlanId: this.entity.opPlanId
				}).then(res => {
					if (res.err_code == 10000) {
						uni.$u.toast('专检提交成功!');
						this.scanShow = false;
						this.getCheckData();
					} else {
						uni.$u.toast(res.err_msg);
					}
				})
			},
			handleAccountSubmit() {
				this.$refs.uForm.validate().then(res => {
					getSpChecherInfo({
						...this.accountForm,
						type: 1
					}).then(res => {
						const {
							data
						} = res
						if (res.code == 200) {
							onSpecialEnsure2({
								userInfo: data.userInfo,
								opPlanId: this.entity.opPlanId
							}).then(res => {
								if (res.err_code == 10000) {
									uni.$u.toast("专检提交成功!");
									this.getCheckData()
									this.accountShow = false
								} else {
									uni.$u.toast(res.err_msg);
								}
							})
						} else {
							uni.$u.toast("找不到用户信息！")
						}
					}).catch(error => {
					})
				}).catch(errors => {
				})
			},
			//切换密码输入框展示类型
			handleChangePasswordType() {
				this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
			},
		}
	}
</script>

<style>
</style>