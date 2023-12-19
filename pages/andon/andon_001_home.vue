<template>
	<view class="content">
		<view class="app-containerR app-containerWrap">
			<view v-show="showList[0]" class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap1()">
				<u-icon class="text-xl"  size="60"  name="../../static/img/icon/cf.png"></u-icon>
				<view class="group-title">Andon触发</view>
			</view>
			<view  v-show="showList[1]" class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap2()">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/xy.png"></u-icon>
				<view class="group-title">Andon响应</view>
			</view>
			<view  v-show="showList[2]" class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap3()">
				<u-icon class="text-xl" size="60" name="../../static/img/icon/bgwtlb.png"></u-icon>
				<view class="group-title">Andon关闭</view>
			</view>
			<view  v-show="showList[3]" class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap4()">
				<u-icon class="text-xl" size="60" name="../../static/img/icon/bgwtlb.png"></u-icon>
				<view class="group-title">班组/部门未关闭安灯</view>
			</view>
		</view>
		
		<!-- <tabbar></tabbar> -->
	</view>
</template>

<script>
	import { bianliShuzu } from '../../utils/quanxian.js'
	// import tabbar from '@/pages/tabbar/tabbar.vue' // 设备分类管理 
	export default {
		// components: { tabbar },
		data() {
			return {
				codeList:['pad-AndonCF2007','pad-AndonXY2008','pad-AndonLB2009','pad-AndonBZ2006'],
				showList:[false,false,false,false]
			};
		},
		methods: {
			// Andon触发
			jumpTap1() {
				uni.navigateTo({
					url:'/pages/andon/andon_002_class'
				});
				getApp().globalData.andonData={}
			},
			// Andon响应
			jumpTap2() {
				uni.navigateTo({
					url:'/pages/andon/andon_004_responseList'
				});
			},
			// Andon报告问题列表
			jumpTap3() {
				uni.navigateTo({
					url:'/pages/andon/andon_006_problemList'
				});
			},
			// 班组、部门未关闭安灯
			jumpTap4(){
				uni.navigateTo({
					url:'/pages/andon/andon_011_clazzProblemList'
				});
			}
		},
		onLoad(options) {
			this.codeList.forEach(item=>{
				this.showList=bianliShuzu(getApp().globalData.padGL.sub,item,this.showList,this.codeList).map(item=>{
					  return item
				})
			})
		}
	}
</script>

<style lang="scss">
</style>
