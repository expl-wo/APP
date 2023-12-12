<template>
	<view class="content">
		<u-empty mode="list" text="无任务" v-show="maintenanceDevice.length == 0">
		</u-empty>
		<view class="app-containerR app-containerWrap">
			<view class="group-warter w-240 tc text bg-blue" v-for="(item,index) of maintenanceDevice" 
			@click="tap(item)" :key="item.recordId">
				<view class="group-title">设备名称：{{item.eqpName}}</view>
				<view class="group-bomtitle tc">使用部门：{{item.usingDepName}}</view>
				<view class="group-bomtitle tc">设备编码：{{item.eqpId}}</view>
				<view class="group-bomtitle tc">班组：{{item.installSite}}</view>
				<view class="group-bomtitle tc">保养名称：{{item.ckOrMtcName}}</view>
				<view class="group-bomtitle tc">安全措施：{{item.safetyMeasure}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getDeviceMaintence } from '@/https/equip/equipMaintenance.js'	
	export default {
		data() {
			return {
				type:'',
				isAccept:'',
				maintenanceDevice :[]
			};
		},
		methods:{
			onShow() {
				this.maintenanceDevice = []
				var para = {type: this.type,isAccept:this.isAccept}
				getDeviceMaintence(para).then(res =>{
					// console.log("保养任务"+JSON.stringify(res.data))
					this.maintenanceDevice = res.data
					
				})
			},	
			//点击某个设备，进行保养操作
			tap: function(item) {
				if(this.type == 1 && this.isAccept==0){
					uni.showModal({
					    title: '保养',
					    content: '确定开始保养',
					    success: function (res) {
					        if (res.confirm) {
								uni.navigateTo({url:"/pages/equip/equipMaintenance/maintenanceOperation?deviceItem=" + JSON.stringify(item)})
					            console.log('用户点击确定');
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					})
				}else if(this.type == 2&& this.isAccept==0){
					uni.navigateTo({url:"/pages/equip/equipMaintenance/maintenanceOperation?deviceItem=" + JSON.stringify(item)})
				}else if(this.type == 1&&this.isAccept==1){
					console.log(1111);
					uni.navigateTo({url:"/pages/equip/equipMaintenance/maintenanceApply?deviceItem=" + JSON.stringify(item)})
					// uni.navigateTo({url:"/pages/equip/equipMaintenance/maintenanceApply=" + JSON.stringify(item)})
				}

			}
			},
			onLoad(options) {
				console.log(options);
				this.type = options.type
				this.isAccept = options.isAccept
			}
	}
</script>


<style>
</style>
