<template>
	<!--andon响应列表查询-->
	<view class="content">
		<view class="app-containerC app-containerWrap">
			<view class="tc">
				<u-button :type="listQuery.status == 1 ? 'primary' : ''" class="m-10" 
					@click="onChange(1)">待响应</u-button>
				<u-button :type="listQuery.status == 3 ? 'primary' : ''" class="m-10" 
					@click="onChange(3)">待解决</u-button>
			</view>

			<view class="group-warter app-containerR shadow" v-for="(x,index) in dataList"
				:class="{'text-blue': listQuery.status == 1 }" @tap="jumpTap(x)">
				<view class="group-title tl w-180">
					<u-button type="success"  v-show="x.problemSource == 0">触发</u-button>
					<u-button type="success"  v-show="x.problemSource == 2">接口</u-button>
					<u-button type="success"  v-show="x.problemSource == 1">转办</u-button>
					<u-button type="success"  v-show="x.problemSource == 3">驳回</u-button>
					<u-button type="success"  v-show="x.problemSource == 4">指派</u-button>
				</view>
				<view class="group-title app-containerC cc w-180">{{x.abnormalName}}</view>
				<view class="group-title otherCon">
					<view class="tl">编号：{{x.andonNumber}}</view>
					<view class="tl">提报人：{{x.triggerName}}</view>
					<view class="tl">触发时间：{{x.triggerDate}}</view>
					<view class="tl">问题描述：{{x.remarks}}</view>
					<view class="tl" v-show="x.responseDate != null">响应时间：{{x.responseDate}}</view>
					<view class="tl" v-show="x.responserName != null">响应人员：{{x.responserName}}</view>
				</view>
			</view>
			<!-- <view class="group-warter app-containerR shadow" v-for="(x,index) in dataList" :key="x.id" @tap="jumpTap1(x)">
				<view class="group-title otherCon">
					<view class="tl">异常项: {{x.abnormalName}}</view>
					<view class="tl">项目名称: {{x.projectName}}</view>
					<view class="tl">问题描述:{{x.remarks}}</view>
					<view class="tl">触发人:{{x.triggerName}}</view>
				</view>
				<view class="group-title tr w-240">{{x.triggerDate}}</view>
			</view> -->

		</view>
	</view>
</template>

<script>
	import {
		$message
	} from '@/utils/common.js'
	// 已提报问题查询
	import {
		getResponseList,
		getSolveList
	} from "@/https/andon/andon.js"
	export default {
		data() {
			return {
				listQuery: {
					pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
					pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
					status: 1 // 枚举类AndonStatus:-1,所有状态;0,触发;1,响应;2,关闭;3,解决
				},
				dataList: []
			};
		},
		methods: {
			// Andon触发
			jumpTap(item) {
				if (this.listQuery.status == 1) { // 响应
					uni.navigateTo({
						url: './andon_005_response?item=' + JSON.stringify(item) + '&tmptoken=""'
						// url:'/pages/andon/andon_005_response?item='+JSON.stringify(item)+'&tmptoken=""'
					});
				} else { // 解决
					uni.navigateTo({
						url: './andon_008_solve?item=' + JSON.stringify(item) + '&tmptoken=""'
						// url:'/pages/andon/andon_005_response?item='+JSON.stringify(item)+'&tmptoken=""'
					});
				}

			},
			onQuery() {
				getResponseList().then(response => {
					this.dataList = response.data
					console.log(this.dataList)
				})
			},
			// 切换状态
			onChange(val) {
				if (1 == val) {
					this.listQuery.status = 1
					this.onQuery()
				} else {
					this.listQuery.status = 3
					getSolveList().then(response => {
						if (response.data.length == 0) {
							uni.showToast({
								title: '暂无待解决数据',
								icon: 'none',
								duration: 2000
							})
						}
						this.dataList = response.data
						console.log(this.dataList)
					})
				}

			},
		},
		onLoad(options) {
			this.onQuery()
		},
		onPullDownRefresh() {
			this.onQuery()
		}
	}
</script>

<style lang="scss">
</style>