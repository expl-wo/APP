<template>
	
	
	<view class="content">
		<view class="app-containerR app-containerWrap">
			<view class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap1()" v-show="showList[1]">
				<u-icon class="text-xl" size="60" name="../../../static/img/icon/bxrgl.svg"></u-icon>
				<view class="group-title">报修管理</view>
			</view>
			<view class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap2()" v-show="showList[0]">
				<u-icon class="text-xl" size="60" name="../../../static/img/icon/wxrgl.svg"></u-icon>
				<view class="group-title">维修管理</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import { bianliShuzu } from '../../../utils/quanxian.js'
	export default {
		data() {
			return {
				
				codeList:['pad-weiXiuRenGL3002','pad-baoXiuRenGL3001'],
				showList:[true,true]
			};
		},
		methods: {
			// 报修人管理
			jumpTap1() {
				uni.navigateTo({
					url:'/pages/equip/equipRepair/reportManager/index'
				});
			},
			// 维修人管理
			jumpTap2() {
				uni.navigateTo({
					url:'/pages/equip/equipRepair/repairManager/index'
				});
			},
		},
		onLoad(options) {
			// this.codeList.forEach(item=>{
			// 	this.showList=bianliShuzu(getApp().globalData.padGL.sub,item,this.showList,this.codeList).map(item=>{
			// 		  return item
			// 	})
			// })
		}
	}
</script>

<style lang="scss">
</style>