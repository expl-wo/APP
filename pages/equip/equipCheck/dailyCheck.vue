<template>
	<view class="content">
		<view style="margin-left: 10px;">
			<checkbox-group @change="checkboxChange">
				<label>
					<checkbox :value="cb"/>未安排责任人设备点检任务
				</label>
			</checkbox-group>
		</view>
		<u-empty mode="list" text="无点检任务" v-show="checkListData==null||checkListData.length == 0">
		</u-empty>
		<view class="app-containerR app-containerWrap">
			<view class="group-warter w-240 tc text bg-blue" v-for="(item,index) of checkListData"  @click="tap(item)" :key="item.eqpId">
				<view class="group-title">设备名称：{{item.eqpName}}</view>
				<view class="group-bomtitle tc">使用部门：{{item.usingDepName}}</view>
				<view class="group-bomtitle tc">设备编码：{{item.eqpId}}</view>
				<view class="group-bomtitle tc">班组：{{item.installSite}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getOtherSpotCheckList} from '@/https/equip/equipCheck.js'
	import { $confirm } from '@/utils/common.js'
	export default{
		data(){
			return{
				cb: "0",
				needRefresh:false,
				checkListData :[]
			}
		},
		methods:{
			checkboxChange(e){
				this.checkListData = []				
				if(e.detail.value == "0"){
					e.detail.value == "1"
					this.cb = "1"
				}else{
					e.detail.value == "0"
					this.cb = "0"
				}
				console.log(this.cb)
				getOtherSpotCheckList({findNoManager:this.cb}).then(res =>{
					this.checkListData = res.data
				})
			},
			onShow() {
				this.checkListData = []
				getOtherSpotCheckList({findNoManager:this.cb}).then(res =>{
					console.log('点检', res)
					this.checkListData = res.data
				})
			},
			//点击某个设备，进行点检操作
			tap: function(item) {
				uni.navigateTo({url:"/pages/equip/equipCheck/checkItem?eqpItem=" + JSON.stringify(item) + '&type=qita'})
			},
		},
		
	}
</script>

<style>
</style>