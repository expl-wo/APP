<template>
	<view class="content">
		<u-empty mode="list" text="无任务" v-show="dataList.length == 0">
		</u-empty>
		<view class="app-containerR app-containerWrap">
			<view class="group-warter w-240 tc text bg-blue" v-for="(item,index) of dataList" 
			@click="tap(item)" :key="item.id">
				<view class=" group-title ">鉴定单号：{{item.billNum}}</view>
				<view class="group-bomtitle tc">设备名称：{{item.eName}}</view>	
				<view class="group-bomtitle tc">设备编码：{{item.eNumber}}</view>				
				<view class="group-bomtitle tc">使用部门：{{item.usingDepName}}</view>
				<view class="group-bomtitle tc">班组：{{item.installSite}}</view>
				<view class="group-bomtitle tc">鉴定名称：{{item.name}}</view>
				
				
			</view>
		</view>
	</view>
</template>

<script>
	import { getAprriaseTask } from '@/https/equip/equipIntegrityAppriase.js'
	export default {
		data() {
			return {
				dataList:[]
			};
		},
		methods:{
			onShow() {
				this.dataList = []
				getAprriaseTask().then(res =>{
					// console.log("保养任务"+JSON.stringify(res.data))
					if(res.err_code == 10000){
						this.dataList = res.data
					}
										
				})
			},
			//点击某个设备，进行保养操作
			tap: function(item) {
				uni.navigateTo({url:"/pages/equip/equipIntegrityAppraisal/IntegrityOperation?deviceItem=" + JSON.stringify(item)})	
			}
		}
	}
</script>

<style>
</style>