<template>
	<view class="content">
		<view class="hp app-containerC">
			<view class="app-containerR navbar">
				<view class="titleCls">待维修设备：</view>
				<xui-scan v-if="showScan" @scanResult="scanNext" label="请扫码维修"></xui-scan>
			</view>
			<view v-show="guanjianShow">
				<view class="titel">
					<text>关键设备</text>
				</view>
				<view class="app-containerR app-containerWrap">
					<!-- @click="itemClick(item)" -->
					<view :class="{'bg-orange':item.status==0,'bg-blue':item.status!=0}"
						class="group-warter w-240 tc text" v-for="(item,index) of guanjianList" :key="item.repairmgtId"
						@click="itemClick(item)">
						<view class="group-title">设备名称：{{item.name}}</view>
						<view class="group-bomtitle tc">使用部门：{{item.usingDepName}}</view>
						<view class="group-bomtitle tc">设备编号：{{item.number}}</view>
						<view class="group-bomtitle tc">班组：{{item.installSite}}</view>
						<view class="group-bomtitle tc">报修时间：{{item.reportTime}}</view>
						<view class="group-bomtitle tc" :class="{'text-black':item.status==0}">
							维修状态：{{item.repairStatus}}</view>
						<view class="group-bomtitle tc">故障类别：{{item.faultCateName}}</view>
						<view class="group-bomtitle tc">维修单号：{{item.orderNum}}</view>
						<view class="group-bomtitle tc">负责人：{{item.repairManName}}</view>
					</view>
				</view>
			</view>
			<view v-show="zhongdianShow">
				<view class="titel">
					<text>重点设备</text>
				</view>
				<view class="app-containerR app-containerWrap">
					<!-- @click="itemClick(item)" -->
					<view :class="{'bg-orange':item.status==0,'bg-blue':item.status!=0}"
						class="group-warter w-240 tc text" v-for="(item,index) of zhongdianList" :key="item.repairmgtId"
						@click="itemClick(item)">
						<view class="group-title">设备名称：{{item.name}}</view>
						<view class="group-bomtitle tc">使用部门：{{item.usingDepName}}</view>
						<view class="group-bomtitle tc">设备编号：{{item.number}}</view>
						<view class="group-bomtitle tc">班组：{{item.installSite}}</view>
						<view class="group-bomtitle tc">报修时间：{{item.reportTime}}</view>
						<view class="group-bomtitle tc" :class="{'text-black':item.status==0}">
							维修状态：{{item.repairStatus}}</view>
						<view class="group-bomtitle tc">故障类别：{{item.faultCateName}}</view>
						<view class="group-bomtitle tc">维修单号：{{item.orderNum}}</view>
						<view class="group-bomtitle tc">负责人：{{item.repairManName}}</view>
					</view>
				</view>
			</view>
			<view v-show="yibanShow">
				<view class="titel">
					<text>一般设备</text>
				</view>
				<view class="app-containerR app-containerWrap">
					<!-- @click="itemClick(item)" -->
					<view :class="{'bg-orange':item.status==0,'bg-blue':item.status!=0}"
						class="group-warter w-240 tc text" v-for="(item,index) of yibanList" :key="item.repairmgtId"
						@click="itemClick(item)">
						<view class="group-title">设备名称：{{item.name}}</view>
						<view class="group-bomtitle tc">使用部门：{{item.usingDepName}}</view>
						<view class="group-bomtitle tc">设备编号：{{item.number}}</view>
						<view class="group-bomtitle tc">班组：{{item.installSite}}</view>
						<view class="group-bomtitle tc">报修时间：{{item.reportTime}}</view>
						<view class="group-bomtitle tc" :class="{'text-black':item.status==0}">
							维修状态：{{item.repairStatus}}</view>
						<view class="group-bomtitle tc">故障类别：{{item.faultCateName}}</view>
						<view class="group-bomtitle tc">维修单号：{{item.orderNum}}</view>
						<view class="group-bomtitle tc">负责人：{{item.repairManName}}</view>
					</view>
				</view>
			</view>
		</view>

		<!--扫码弹窗-->
		<u-popup mode="top" @close="close" :show="scanShow">
			<view class="app-containerC wp table-zdy">
				<view class="th-group">
					<view class="th">请点击屏幕上绿色按钮进行扫码操作</view>
				</view>
				<view class="td-group">
					<view class="td">
						<input class="uni-input" type="text" v-model="scanId" :focus="focus" @blur="focus=false"
							@input="scanNext" />
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getNeedRepairList,
		chooseOneDeviceTo,
		secondRepairInvolve
	} from '@/https/equip/equipRepair.js'
	export default {
		data() {
			return {
				showScan: false,
				needRepairData: '',
				scanId: '',
				scanShow: false,
				focus: false,
				zhongdianList: [],
				guanjianList: [],
				yibanList: [],
				guanjianShow: true,
				yibanShow: true,
				zhongdianShow: true
			};
		},
		onShow(){
			this.showScan = true;
		},
		onHide(){
			this.showScan = false;
		},
		methods: {
			onShow() {
				this.needRepairData = []
				// console.log('維修報表Show');
				var para = {
					pg_pagesize: 100,
					pg_pagenum: 1
				}
				getNeedRepairList(para).then(res => {
					// console.log('維修列表數據',res.data)
					this.needRepairData = res.data
					console.log(res.data)
					this.needRepairData.forEach(item => {
						//维修单状态 0：报修（未响应） 1：响应检测中 2：待二次维修 3：维修中 4：待件、待人中 5：维修完成 6：维修已确认
						if (item.status == '0') {
							item.repairStatus = "报修未响应"
						} else if (item.status == '1') {
							item.repairStatus = "响应检测中"
						} else if (item.status == '2') {
							item.repairStatus = "待二次维修"
						} else if (item.status == '3') {
							item.repairStatus = "维修中"
						} else if (item.status == '4') {
							item.repairStatus = "等待中"
						} else if (item.status == '5') {
							item.repairStatus = "维修完成"
						} else if (item.status == '6') {
							item.repairStatus = "维修已确认"
						}
					})
					this.zhongdianList = this.needRepairData.filter(item => {
						return item.clazz == '重点设备'
					})
					this.zhongdianShow = this.zhongdianList.length == 0 ? false : true
					this.yibanList = this.needRepairData.filter(item => {
						return item.clazz == '一般设备'
					})
					this.yibanShow = this.yibanList.length == 0 ? false : true
					this.guanjianList = this.needRepairData.filter(item => {
						return item.clazz == '关键设备'
					})
					this.guanjianShow = this.guanjianList.length == 0 ? false : true
				})
			},

			//扫码之后根据设备ID判断要去哪个页面
			chooseOneDeviceScan() {
				chooseOneDeviceTo({id: this.scanId}).then(res => {
					if(res.err_code === 10000){
						var repairId = res.data.id //维修单ID
						var isRemind = res.data.isRemind //0：不弹出二次介入弹框 1：弹出二次介入弹框
						var toWhere = res.data.toWhere //0：维修管理响应初始化界面 1：维修操作初始化界面
						var hint = res.data.hint //若弹出提醒框，提醒该维修单已由谁进行了操作
						
						if (isRemind == 0) { //不弹出弹框
							if (toWhere == 0) {
								//响应页面
								uni.navigateTo({url: "/pages/equip/equipRepair/repairManager/response?repairId=" + repairId})
							} else {
								//维修操作页面
								uni.navigateTo({url: "/pages/equip/equipRepair/repairManager/operation?repairId=" +repairId})
							}
						} else { //第二个人介入，弹框
							var type = ''
							if (toWhere == 0) {
								type = '响应'
							} else {
								type = '维修'
							}
							uni.showModal({
							    title: '提示',
							    content: '这条维修记录已经由'+hint+'进行了'+type+'操作，是否要介入该操作？',
							    success: function (res) {
							        if (res.confirm) {//当扫码后确定接口去向为设备维修响应初始化界面后，且已经有人正在进行响应检测，则弹出提醒框，若选择是时，则isInter字段为1，若选择否时，则为0
							            console.log('用户点击确定');
										if(toWhere == 0){
											//响应页面
											 uni.navigateTo({url: "/pages/equip/equipRepair/repairManager/response?repairId=" +repairId})
										}else{
											//先请求一个维修介入的接口，在进入维修操作页面
											secondRepairInvolve({id:repairId}).then(res=>{
												// console.log('维修介入',res)
												uni.navigateTo({url: "/pages/equip/equipRepair/repairManager/operation?repairId=" +repairId})
											})
										}
							        } else if (res.cancel) {
							            console.log('用户点击取消')
							        }
							    }
							})
						
						}
					}else{
						uni.showToast({
							title: res.err_msg,
							duration: 2000
						})
					}
					
				})
				this.scanId = ''
			},

			close(){
				this.scanShow =false
			},
			//点击扫码按钮
			scanButtonClick() {
				this.scanShow = true
				setTimeout(() => {
					this.focus = true;
				}, 300);
			},
			// 扫码
			scanNext(result) {
				this.scanId = result
				this.chooseOneDeviceScan()
			},

			// 点击某一个设备
			itemClick(item) {
				//电动扳手id:20200820101601
				this.scanId = item.repairmgtId
				this.chooseOneDeviceScan()
			},
		}
	}
</script>


<style lang="scss" scoped>
	.titleCls {
		color: #0081ff;
		font-size: 20px;
		margin-left: 20px;
		margin-top: 15px;
	}

	.navbar {
		display: flex;
		justify-content: space-between;
	}

	.btn {
		margin-top: 10px;
		margin-right: 20px;
	}

	.titel {
		color: #0081ff;
		font-size: 17px;
		margin-left: 20px;
		margin-top: 15px;
	}

	.u-size-mini {
		margin: 3px;
		height: 15px;
		font-size: 12px;
	}
</style>