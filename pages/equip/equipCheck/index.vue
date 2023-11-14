<template>
	<view class="content">
		<view class="app-containerR app-containerWrap">
			<view class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap1()" v-show="showList[1]">
				<u-icon class="text-xl" size="60" name="../../../static/img/icon/em_qtdj.svg"></u-icon>
				<view class="group-title">日常点检</view>
			</view>
			<view class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap2()" v-show="showList[0]">
				<u-icon class="text-xl" size="60" name="../../../static/img/icon/zydj.svg"></u-icon>
				<view class="group-title">专业点检</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				codeList:['pad-zhuanYeDJ3002','pad-qiTaDianJian3001'],
				showList:[true,true]
			};
		},
		methods: {
			// 日常点检
			jumpTap1() {
				uni.navigateTo({
					url:'/pages/equip/equipCheck/dailyCheck'
				});
			},
			// 专业点检
			jumpTap2() {
				uni.navigateTo({
					url:'/pages/equip/equipCheck/specialityCheck'
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

<style lang="scss" scoped>
</style>