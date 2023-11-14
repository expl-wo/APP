<template>
	<view class="content">
		<view class="app-containerR app-containerWrap">
			<view class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap1()" v-show="showList[1]">
				<u-icon class="text-xl" size="60" name="../../../static/img/icon/em_qtdj.svg"></u-icon>
				<view class="group-title">日常保养</view>
			</view>
			<view class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap2()" v-show="showList[0]">
				<u-icon class="text-xl" size="60" name="../../../static/img/icon/zydj.svg"></u-icon>
				<view class="group-title">定期保养</view>
			</view>
			<view class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap3()" v-show="showList[0]">
				<u-icon class="text-xl" size="60" name="../../../static/img/icon/zydj.svg"></u-icon>
				<view class="group-title">保养验收</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import { bianliShuzu } from '../../../utils/quanxian.js'
	export default {
		data() {
			return {
				codeList:['pad-riChangBaoYang3010','pad-dingQiBaoYang3011','pad-baoYangYanShou3012'],
				showList:[true,true]
			};
		},
		methods: {
			// 日常保养
			jumpTap1() {
				uni.navigateTo({
					url:'/pages/equip/equipMaintenance/maintenanceTask?type=2&isAccept=0'
				});
			},
			// 定期保养
			jumpTap2() {
				uni.navigateTo({
					url:'/pages/equip/equipMaintenance/maintenanceTask?type=1&isAccept=0'
				});
			},
			// 保养验收
			jumpTap3() {
				uni.navigateTo({
					url:'/pages/equip/equipMaintenance/maintenanceTask?type=1&isAccept=1'
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