<template>
	<view class="content">
		<view class="main">
			<view class="headerp" id="main-form">
				<view class="product ml-10">
					生产号：
				</view>
				<view class="input-view">
					<u--input placeholder="" :height="30" fontSize="8" border="surround"
						v-model="listQuery.productNo" @confirm="onBtnQuery"></u--input>
				</view>
				<button size="mini" class="ml-10" type="primary" @click="onBtnQuery">查询</button>
				<xui-scan v-if="showScan" qrCodeType="barCode" @scanResult="handleScanResult" label="请扫描线圈条码"></xui-scan>
			</view>
		</view>
		<scroll-view scroll-y="true" @scrolltolower="handleScrollTable">
			<view class="app-containerC wp table-zdy mini-table">
				<uni-table ref="table" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th width="150" align="center">序号</uni-th>
						<uni-th width="150" align="center">生产号</uni-th>
						<uni-th width="150" align="center">图号</uni-th>
						<uni-th width="150" align="center">型号</uni-th>
						<uni-th width="150" align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{ index + 1 }}</uni-td>
						<uni-td align="center">{{ item.productNoMain }}</uni-td>
						<uni-td align="center">{{ item.drawingNo }}</uni-td>
						<uni-td align="center">{{ item.productModel }}</uni-td>
						<uni-td align="center">
							<view class="uni-group flexCenter">
								<button size="mini" type="primary" @click="handleSelect(item)">开始配平</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
		</scroll-view>
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
				listQuery: {
					pg_pagenum: 1, // 查询第几页数据，默认第一页 pg_pagesize
					pg_pagesize: 20, // 每页显示多少条数据，默认为10条 pg_pagenum
					productNo: '', // 生产号
					trimStatus: '0' //是否已配平 0|否，1|是
				},
				total: 0,
				tableData: [], //保存未配平的线圈
				selectedIndexs: [],
				showScan: false
			}
		},
		onLoad() {
		},
		onShow() {
			// #ifdef APP-PLUS
			this.showScan = true;
			// #endif
			this.onBtnQuery();
		},
		onHide(){
			this.showScan = false;
		},
		methods: {
			onBtnQuery() {
				this.tableData = []
				findProductNum(this.listQuery).then(response => {
					this.tableData = response.data;
					this.total = response.total_count;
				})
			},
			handleSelect(row) {
				let options = {
					productNoMain: row.productNoMain,
					drawingNo: row.drawingNo,
					productModel: row.productModel
				}
				uni.navigateTo({
					url: '/pages/production/resistanceTrim/trimManage?options=' + JSON.stringify(options)
				})
			},
			handleScrollTable() {

			},
			// 多选
			selectionChange(e) {
				console.log(e.detail.index)
				this.selectedIndexs = e.detail.index
			},
			handleScanResult(result){
				console.log(result);
				getCoilInfoByScanCode({
					serialNumber: result
				}).then(response=>{
					if(response.err_code === this.$constants.status.success2){
						console.log(response.data.productNoMain);
						let data = response.data;
						//获取到线圈数据，得到生产号信息，
						if(this.$constants.isNotEmpty(data.productNoMain)){
							console.log('-----');
							uni.navigateTo({
								url: '/pages/production/resistanceTrim/trimManage?options=' + JSON.stringify(data)
							})
						}
					}else{
						this.$u.toast(response.err_msg);
					}
				})
				
			}
		}
	}
</script>

<style>
</style>