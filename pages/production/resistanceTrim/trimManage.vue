<template>
	<view class="content">
		<view class="main">
			<view class="headerp" id="main-form">
				<view class="product">
					生产号：{{entity.productNoMain}} 图号： {{entity.drawingNo}} 型号： {{entity.productModel}}
				</view>
				<xui-dict-select class="ml-5" v-if="!isConfirmPage" v-model="threePhaseType"
					item-code="threePhaseType"></xui-dict-select>
				<button class="ml-5" v-if="isPrePage || isEditPage" type="primary" size="mini"
					@click="onPreTrim">预配平</button>
				<button class="ml-5" v-if="isConfirmPage" type="primary" size="mini"
					@click="pageStatus = 'edit'">再次修改</button>
				<button class="ml-5" v-if="isConfirmPage" type="success" size="mini"
					@click="onConfirmTrim">确认配平</button>
				<xui-scan v-if="showScan && isPrePage" qrCodeType="barCode" @scanResult="handleScanResult" 
				label="请扫描线圈条码"></xui-scan>
			</view>
			 <view v-if="!isPrePage" class="successTip">序列号字体为绿色表示预配平成功</view>
		</view>
		<scroll-view scroll-y="true" v-if="isPrePage">
			<view class="app-containerC wp table-zdy mini-table">
				<uni-table ref="table" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th width="150" align="center">序号</uni-th>
						<uni-th align="center">线圈序列号</uni-th>
						<uni-th align="center">电阻值</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{ index + 1 }}</uni-td>
						<uni-td align="center">{{ item.serialNumber }}</uni-td>
						<uni-td align="center">
							<view class="xui-flex-center">
								<u-input type="number" style="max-width: 180px;"
									v-model="item.resistanceValue"></u-input>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
		</scroll-view>

		<scroll-view scroll-y="true" v-if="isConfirmPage || isEditPage">
			<view class="app-containerC wp table-zdy mini-table">
				<uni-table ref="table" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th width="150" align="center" v-if="isEditPage">选择</uni-th>
						<uni-th align="center">序号</uni-th>
						<uni-th align="center">线圈序列号</uni-th>
						<uni-th align="center">组名</uni-th>
						<uni-th align="center">电阻平衡率</uni-th>
						<uni-th align="center">电阻值</uni-th>
						<uni-th align="center">三相</uni-th>
					</uni-tr>
					<uni-tr v-for="(x, index) in resultData" :key="index">
						<uni-td align="center" v-if="isEditPage">
							<checkbox-group @change="val=>checkChange(val, x)">
								<checkbox :checked="x.checked" />
							</checkbox-group>
						</uni-td>
						<uni-td align="center">{{ index + 1 }}</uni-td>
						<uni-td align="center">
						 <view :class="getTrimStatus(x)">{{ x.serialNumber }}</view>
						</uni-td>
						<uni-td align="center">{{ x.teamLabel }}</uni-td>
						<uni-td align="center">{{ x.resistanceBalance }}</uni-td>
						<uni-td align="center">{{ x.resistanceValue }}</uni-td>
						<uni-td align="center">{{ x.phaseName   }}</uni-td>
					</uni-tr>
				</uni-table>
			</view>
		</scroll-view>

		<u-popup mode="center" :show="serialNumberVisible" customStyle="margin-bottom: 260px;width:600px;" round="3" closeOnClickOverlay>
			<view class="u-popup-slot">
				<view class="serialNumberContent" style="margin: 10px;">
					<u--form labelPosition="left" labelWidth="60" :model="serialNumberModel" ref="uForm">
						<u-form-item label="线圈序列号" borderBottom>
							{{serialNumberModel.serialNumber}}
						</u-form-item>
						<u-form-item label="电阻值" borderBottom>
							<u-input type="number" ref="inputRef" focus style="max-width: 180px;"
								v-model="serialNumberModel.resistanceValue" @confirm="onConfirmSerialNumber"></u-input>
						</u-form-item>
					</u--form>
					<view class="tip">{{serialNumberModelTip}}</view>
					<view class="xui-flex-center" style="margin-top: 10px;">
						<u-button text="取消" customStyle="width: 100px" @click="serialNumberVisible=false"></u-button>
						<u-button type="primary" text="确定" customStyle="width: 100px;margin-left: 6px;"
							@click="onConfirmSerialNumber"></u-button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		findProductNum,
		getCoilList,
		handTrim,
		preTrim,
		preTrimCoil,
		saveResistanceValue,
		getCoilInfoByScanCode
	} from '@/https/pm/coilTrim'

	export default {
		data() {
			return {
				//页面当前状态，默认是pre预配平   confirm确认配平   edit修改配平
				pageStatus: 'pre',

				threePhaseType: 'ABC',
				tableData: [],
				resultData: [],
				total: 0,
				entity: {},
				listQuery: {
					pg_pagenum: 1, // 查询第几页数据，默认第一页 pg_pagesize
					pg_pagesize: 100000, // 每页显示多少条数据，默认为10条 pg_pagenum
				},
				confirmDialogVisible: false,
				confirmThreePhaseType: '',
				confirmDataList: [],
				showScan: false,

				serialNumberVisible: false,
				serialNumberModel: {
					serialNumber: '',
					resistanceValue: ''
				},
				serialNumberModelTip: ''
			}
		},
		onLoad(options) {
			this.entity = JSON.parse(options.options);

		},
		onShow() {
			// #ifdef APP-PLUS
			this.showScan = true;
			// #endif
			this.pageStatus = 'pre';
			this.getTableData();
		},
		onHide() {
			this.showScan = false;
			this.pageStatus = 'pre';
		},
		computed: {
			isPrePage() {
				return this.pageStatus === 'pre'
			},
			isConfirmPage() {
				return this.pageStatus === 'confirm'
			},
			isEditPage() {
				return this.pageStatus === 'edit'
			}
		},
		methods: {
			getTableData() {
				let params = {
					productNo: this.entity.productNoMain,
					...this.listQuery
				}
				getCoilList(params).then(response => {
					response.data.forEach(item => {
						item.checked = false;
					})
					this.tableData = response.data
					this.total = response.total_count
				})
			},
			onPreTrim() {
				let flag = 0;
				let params = {};
				if (this.isPrePage) {
					if (this.tableData.length <= 2) {
						this.$u.toast('线圈不能少于3')
						return;
					}
					let valueList = [];
					this.tableData.forEach(item => {
						if (item.resistanceValue && item.resistanceValue > 0) {
							valueList.push(item);
						}
					})
					if (valueList.length <= 2) {
						this.$u.toast('有电阻值的线圈不能少于3');
						return;
					}
					valueList.forEach(item => {
						item.rule = this.threePhaseType
					})
					params = {
						coilList: valueList,
					}
				} else {
					let valueList = this.resultData.filter(item => {
						return item.checked;
					})
					if (valueList.length <= 2) {
						this.$u.toast('勾选的线圈不能少于3')
						return;
					}
					valueList.forEach(item => {
						item.rule = this.threePhaseType
					})
					params = {
						coilList: valueList,
					}
				}
				this.$u.toast('开始预配平');
				preTrimCoil(params).then(response => {
					if (response.err_code === this.$constants.status.success2) {
						//处理成功，根据预配平结果，将3条数据移动到最上面，并选中
						if (this.isPrePage) {
							response.data.forEach(item => {
								item.checked = true;
							})
							this.resultData = response.data;
						} else {
							let preSelectedDataList = [];
							response.data.forEach(item => {
								if (item.teamLabel) {
									this.resultData.some((subItem, index) => {
										let flag = (item.serialNumber == subItem.serialNumber);
										if (flag) {
											preSelectedDataList.push(item);
											this.resultData.splice(index, 1);
											return true;
										} else {
											return false;
										}
									})
								}
							})
							preSelectedDataList.forEach(item => {
								item.checked = true;
							})
							this.resultData.forEach(item => {
								item.checked = false;
								item.phaseName = '';
							})
							this.resultData = preSelectedDataList.concat(this.resultData);
						}
						this.pageStatus = 'confirm';
					} else {
						this.$u.toast(response.err_msg);
					}
				})
			},
			onConfirmTrim() {
				let coilList = this.resultData.filter(item => {
					return !!item.phaseName
				})
				let params = {
					coilList
				}
				handTrim(params).then(response => {
					if (response.err_code === this.$constants.status.success2) {
						this.$u.toast("配平成功");
						this.confirmDialogVisible = false;
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 2000)
					} else {
						this.$u.toast(response.err_msg);
					}
				})
			},
			checkChange(val, item) {
				if (!val.detail.value || val.detail.value.length === 0) {
					item.checked = false;
				} else {
					item.checked = true;
				}
			},
		  getTrimStatus(row) {
			  if (this.$constants.isNotEmpty(row.phaseName)) {
				return 'xui-content__success';
			  } else {
				return "";
			  }
			},
			handleScanResult(result) {
				getCoilInfoByScanCode({
					serialNumber: result
				}).then(response => {
					if (response.err_code === this.$constants.status.success2) {
						let data = response.data;
						//获取到线圈数据，得到生产号信息，
						if (this.$constants.isNotEmpty(data.productNoMain)) {
							if (data.productNoMain !== this.entity.productNoMain) {
								this.$u.toast("扫描的线圈不属于本生产号");
								return;
							}
							if (data.trimStatus == 1) {
								this.$u.toast("扫描的线圈已配平，请扫描其它未配平线圈");
								return;
							}
							this.serialNumberModel.serialNumber = result;
							this.serialNumberModel.resistanceValue = '';
							this.serialNumberVisible = true;
							this.$nextTick(()=>{
								setTimeout(()=>{
									this.$refs.inputRef && this.$refs.inputRef.onFocus();
								}, 300)
							})
						}
					} else {
						this.$u.toast(response.err_msg);
					}
				})
			},
			//线圈电阻值保存
			onConfirmSerialNumber() {
				if (this.$constants.isEmpty(this.serialNumberModel.resistanceValue) || this.serialNumberModel
					.resistanceValue <= 0) {
					this.serialNumberModelTip = "请输入大于0的电阻值"
					return;
				}
				let selectedArr = [],
					noSelectedArr = [];
				this.tableData.forEach(item => {
					if (item.serialNumber === this.serialNumberModel.serialNumber) {
						item.resistanceValue = this.serialNumberModel.resistanceValue;
						selectedArr.push(item);
					} else {
						noSelectedArr.push(item);
					}
				})
				if (selectedArr.length > 0) {
					this.tableData = selectedArr.concat(noSelectedArr);
				}
				this.serialNumberVisible = false;
			}
		}
	}
</script>

<style scoped>
	.successTip {
	  font-size: 15px;
	  margin-left: 5px;
	  margin-bottom: 4px;
	  margin-right: 4px;
	  color: #19be6b
	}
</style>