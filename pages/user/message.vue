<template>
	<view>
		<view class="cards">
			<view v-if="list.length==0"  style="display: flex; justify-content: center;">
				<text style="font-size: 24rpx;">暂无数据</text>
			</view>
			<view style="box-sizing: border-box;" @click="clickCard(item)" v-for="(item,index) of list">
				<view style="width: 680rpx;box-sizing: border-box;" slot="body">
					<view>
						<view class="card-content">
							<view :class="{'u-line-1':!item.details}" class="u-body-item-title">
								<text>{{item.cont}}</text>
							</view>
							<view class="ckxq">
								<text v-show="item.details==false" @click.stop="details(item)">展开</text>
								<text v-show="item.details==true" @click.stop="details(item)">收起</text>
							</view>
							<view class="c">
							</view>
						</view>
						<view v-show="item.toAppLink!=null" style="margin-top: 5rpx;" class="ckxq"><text @click.stop="tiaozhuan(item)">点击操作>></text></view>
					</view>
				</view>
			</view>
		</view>	
		<view style="display: flex;align-items: center;width: 750rpx;" class="">
			<u-button type="primary" @click="changePgNum(-1)" size="mini">上一页</u-button>
			<u-button type="primary" @click="changePgNum(1)" size="mini">下一页</u-button>
			<u-button  type="primary" size="mini" @click="read">标为已读</u-button>
			<u-button  type="primary" size="mini" @click="changeSta('0')">未读</u-button>
			<u-button  type="primary" size="mini" @click="changeSta('1')">已读</u-button>
		</view>
	</view>
</template>

<script>
	import { $message } from '@/https/_public/common.js'
	import { queryMsgList,msgRead,msgDel } from '@/https/sys/message.js'
	export default {
		data() {
			return {
				list:[],
				checkedList:[],
				queryList:{
					pg_pagesize:10,
					pg_pagenum:1,
					status:'0'
				}
			};
		},
		methods:{
			changeSta(sta){
				this.queryList.status=sta
				console.log(this.queryList)
				this.getMsgList()
			},
			clickCard(item){
				item.isActive = !item.isActive
				console.log(this.list)
			},
			read(){
				let obj = { ids:[] }
				this.list.forEach(item=>{
					if(item.isActive && item.status=='未读'){
						obj.ids.push(item.id)
					}
				})
				if(obj.ids.length==0){
					uni.showToast({
						title: '没有选择未读的信息,请选择!',
						icon:'none'
					});
					return
				}
				msgRead(obj).then(res=>{
					uni.showToast({
						title: '操作成功!',
						icon:'none'
					});
					this.getMsgList()
				})
			},
			getMsgList(){
				queryMsgList(this.queryList).then(res=>{
					// if(res.data.length==0){
					// 	uni.showToast({
					// 		title:'暂无更多数据',
					// 		icon:'none'
					// 	})
					// 	return
					// }
					res.data.forEach(item=>{
						item.details=false
						item.isActive=false
						item.status=item.status?'已读':'未读'
					})
					this.list = res.data
					console.log(res.data)
				})
			},
			changePgNum(n){
				console.log(this.queryList.pg_pagenum)
				if(this.queryList.pg_pagenum<=1 && n==-1) return
				this.queryList.pg_pagenum+=n
				this.getMsgList()
			},
			details(item){
				item.details=!item.details
			},
			tiaozhuan(item){
				if(item.status=='未读'){
					let obj = { ids:[] }
					obj.ids.push(item.id)
					msgRead(obj).then(res=>{})
				}
				let url = item.toAppLink
					uni.navigateTo({
					url:url
				})
			},
		},
		onLoad(options) {
			this.getMsgList()
		}
	};
</script>

<style scoped lang="scss">
	.u-card-wrap {
			background-color: $u-bg-color;
			padding: 1px;
		}
		.cards{
			height: 350rpx;
			overflow: scroll;
		}
		.u-body-item {
			font-size: 32rpx;
			color: #333;
			padding: 20rpx 10rpx;
		}
		.u-body-item image {
			width: 120rpx;
			flex: 0 0 120rpx;
			height: 120rpx;
			border-radius: 8rpx;
			margin-left: 12rpx;
		}
		.active{
			border:1rpx solid #2979FF;
		}
		.ckxq{
			color: #2979FF;
		}
		.card-content{
			display: flex;
			flex-direction: row;
		}
		.card-content .ckxq text{
			display: flex;
			width: 50rpx !important;
		}
</style>
