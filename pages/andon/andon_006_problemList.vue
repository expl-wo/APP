<template>
	<view class="content">
		<view class="app-containerC app-containerWrap">
			<view class="tc">
				<u-button :type="listQuery.status == 4 ? 'primary' : ''" class="m-10"  @click="onChange(4)">已解决</u-button>
				<u-button :type="listQuery.status == 5 ? 'primary' : ''" class="m-10"  @click="onChange(5)">未解决</u-button>
			</view>
			
			<view class="group-warter app-containerR shadow" v-for="(x,index) in classItems" :class="{'text-blue': listQuery.status == 4 }" @tap="jumpTap(x)">
				<view class="group-title tl w-180">
					<u-button type="success" v-show="x.problemSource == 1">转办</u-button>
				</view>
				<view class="group-title app-containerC cc w-180">{{x.abnormalName}}</view>
				<view class="group-title otherCon">
					<view class="tl">异常配置人员：{{x.setResponser}}</view>
					<view class="tl">触发时间：{{x.triggerDate}}</view>
					<view class="tl text-blue" v-show="x.status != 0">响应时间：{{x.responseDate}}</view>
					<view class="tl" v-show="x.status != 0">响应人员：{{x.responserName}}</view>
					<view class="tl" v-show="x.status != 0">异常预计解决时间：{{x.resolutionTime}}</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import { $message } from '@/utils/common.js'
	// 已提报问题查询
	import { getTriggerList } from "@/https/andon/andon.js"
	export default {
		data() {
			return {
				listQuery:{
					pg_pagenum:1, // 每页显示多少条数据，默认为10条 pg_pagenum
					pg_pagesize: 1000, // 查询第几页数据，默认第一页 pg_pagesize
					status: 4 // 查询条件id,枚举类AndonStatus:-1,所有状态;0,触发;1,响应;2,关闭
				},
				classItems: []
			};
		},
		methods: {
			// 切换状态
			onChange(val) {
				this.listQuery.status = val
				if(val == 5){ /** 未解决列表*/
					
				}else if(val == 4){ /** 已解决可关闭列表*/
					
				}
				this.onQuery()
			},
			onQuery() {
				// 已提报问题查询
				getTriggerList(this.listQuery).then(res => {
					this.classItems = res.data
				})
			},
			// 跳转到下一页
			jumpTap(item) {
				if(this.listQuery.status == 5){
					uni.navigateTo({
						url:'./andon_007_problemClose?item='+JSON.stringify(item)
					})
				}else{
					uni.redirectTo({
						url:'./andon_007_problemClose?item='+JSON.stringify(item)
					});
				}
			}
		},
		onLoad(options) {
			this.onChange(5)
		}
	}
</script>

<style lang="scss">
	.u-button{
		margin: 10px;
	}
</style>
