<template>
	<view class="content">
		<view class="app-containerC app-containerWrap">
			<view class="group-warter app-containerR shadow" v-for="(x,index) in classItems"  @tap="jumpTap(x)">
				<view class="group-title tl w-180">
					<u-button type="success" size="mini" v-show="x.status == 0">触发</u-button>
					<u-button type="success" size="mini" v-show="x.status == 1">已响应</u-button>
					<u-button type="success" size="mini" v-show="x.status == 3">已解决</u-button>
				</view>
				<view class="group-title app-containerC cc w-180">{{x.abnormalName}}</view>
				<view class="group-title otherCon">
					<view class="tl">问题提报人员：{{x.triggerName}}</view>
					<view class="tl">异常配置人员：{{x.setResponser}}</view>
					<view class="tl">触发时间：{{x.triggerDate}}</view>
					<view class="tl text-blue" v-show="x.status != 0">响应时间：{{x.responseDate}}</view>
					<view class="tl" v-show="x.status != 0">响应人员：{{x.responserName}}</view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import { $message } from '@/utils/common.js'
	// 已提报问题查询
	import { getClazzTriggerList } from "@/https/andon/andon.js"
	export default {
		data() {
			return {
				classItems: []
			}
		},
		methods: {
			onQuery() {
				// 已提报问题查询
				getClazzTriggerList().then(res => {
					this.classItems = res.data
					console.log(this.classItems)
				})
			},
			// 跳转到下一页
			jumpTap(item) {
				uni.redirectTo({
					url:'./andon_007_problemClose?item='+JSON.stringify(item)
				});
			}
		},
		onLoad(options) {
			this.onQuery()
		}
	}
</script>

<style>

</style>
