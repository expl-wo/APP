<template>
	<view class="content">
		<u-empty mode="list" text="无点检任务" v-show="spotcheckListData.length == 0">
		</u-empty>
		<view class="app-containerR app-containerWrap">
			<view class="group-warter w-240 tc text bg-blue" v-for="(item,index) of spotcheckListData"
				@click="tap(item)" :key="item.EQPID||item.eqpId">
				<view class="group-title">设备名称：{{item.EQPNAME||item.eqpName}}</view>
				<view class="group-bomtitle tc">使用部门：{{item.USINGDEPNAME||item.usingDepName}}</view>
				<view class="group-bomtitle tc">设备编码：{{item.EQPID||item.eqpId}}</view>
				<view class="group-bomtitle tc">班组：{{item.INSTALLSITE||tem.installSite}}</view>
				<view class="group-bomtitle tc">点检配置名称：{{item.CHECKNAME || item.checkName}}</view>
				<!-- <view class="group-bomtitle tc">下次点检时间：{{item.NEXTCHECKDT || item.nextCheckDt}}</view> -->
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		getProSpotCheckList
	} from '@/https/equip/equipCheck.js'
	import {
		$confirm
	} from '@/utils/common.js'
	export default {
		data() {
			return {
				spotcheckListData: []
			}
		},
		methods: {
			onShow() {
				this.spotcheckListData = []
				getProSpotCheckList().then(res => {
					this.spotcheckListData = res.data
				})
			},
			//点击某个设备，进行点检操作
			tap: function(item) {
				uni.navigateTo({
					url: "/pages/equip/equipCheck/checkItem?eqpItem=" + JSON.stringify(item) + '&type=0'
				})
				// if (item.RECID || item.recId) {
				// 	$confirm('是否更新该点检').then(res => {
				// 		uni.navigateTo({
				// 			url: "/pages/equip/equipCheck/checkItem?eqpItem=" + JSON.stringify(item) +
				// 				'&type=0'
				// 		})
				// 	})
				// } else {
					
				// }
			},
		},

	}
</script>

<style lang="scss" scoped>
	.group-bomtitle {
		padding: 10px;
	}
</style>