<template>
	<view class="content">
		<view class="hp app-containerR">
			<view class="app-containerC" style="width: 140px;padding-left: 20px;">
				<button type="primary" class="btn m-10" size="mini" @click="reportRepair">设备报修</button>			
			</view>
			<view class="line"></view>
			<view class="app-containerC">
				<view class="titleCls">已报修设备：</view>
				<view class="app-containerR ">
					<view class="group-warter w-240 tc text bg-blue" 
						v-for="(item,index) of repairData"
						@click="itemClick(item)" :key="item.repairmgtId">
						<view class="group-title">设备编号：{{item.number}}</view>
						<view class="group-bomtitle tc">设备名称：{{item.name}}</view>
						<view class="group-bomtitle tc" :class="{'text-red':item.status==0}">维修状态：{{item.repairStatus}}</view>
					</view>
				</view>
			</view>	
		</view>
	</view>
</template>

<script>
	import {getDeviceRepair} from '@/https/equip/equipReport.js'
	import { $confirm } from '@/utils/common.js'
	export default {
		data() {
			return {
				repairData: '',
			};
		},
		methods: {
			//获取维修设备信息
			onShow() {
				// console.log('报修管理 Show');
				this.repairData = []
				var para = {pg_pagesize: 100,pg_pagenum: 1}
				getDeviceRepair(para).then(res => {
					console.log('查询的维修设备', res)
					this.repairData = res.data
					this.repairData.forEach(item => {
						//维修单状态 0：报修（未响应） 1：响应检测中 2：待二次维修 3：维修中 4：待件、待人中 5：维修完成 6：维修已确认
						if (item.status == '0') {
							item.repairStatus = "报修未响应"
						}else if (item.status == '1') {
							item.repairStatus = "响应检测中"
						}else if (item.status == '2') {
							item.repairStatus = "待二次维修"
						}else if (item.status == '3') {
							item.repairStatus = "维修中"
						}else if (item.status == '4') {
							item.repairStatus = "待件、待人中"
						}else if (item.status == '5') {
							item.repairStatus = "维修完成"
						}else if (item.status == '6') {
							item.repairStatus = "维修已确认"
						}
					})
				})
			},
			//报修确认页面跳转
			itemClick(item){
				if(item.repairStatus == "维修完成"){
					uni.navigateTo({url:"/pages/equip/equipRepair/reportManager/ensure?repairmgtId=" + item.repairmgtId})
				}else{
					$confirm('只有维修状态为已完成的设备才能进行维修确认操作!').then(res =>{})
				}
			},
			//设备报修跳转
			reportRepair(){
				uni.navigateTo({url:'/pages/equip/equipRepair/reportManager/equipReport'})
			},
			// 预约报修跳转
			orderRepair(){
				uni.navigateTo({url:'/pages/equip/equipRepair/reportManager/orderReport'})
			},
			
		}
	}
</script>

<style>
	.group-bomtitle{
		padding: 10px;
	}
	.line {
		margin-left: 20px;
		width: 2rpx;
		background-color: #0081ff;
	}
	.titleCls{
		color: #0081ff;
		font-size: 15px;
		margin-left: 20px;
	}
</style>
