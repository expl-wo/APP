<template>
	<view class="content">
		<!--andon分类-->
		<view class="app-containerR app-containerWrap">
			<view class="group-warter tc text bg-blue card" v-for="(item,index) of classItems" @click="tap(item)"
				:key="item.id" @tap="onNext(item)">
				<view class="group-title" style="font-size:15upx">{{item.cateName}}</view>
				<!-- <view class="group-bomtitle tc" style="font-size:10upx" v-if="item.sub && item.sub.length > 0">(分类--有下级)</view>
				<view class="group-bomtitle tc" style="font-size:10upx" v-else>(分类--无下级)</view> -->
			</view>
		</view>

		<!--异常项-->
		<view class="app-containerR app-containerWrap">
			<view class="group-warter tc text bg-orange card" v-for="(item,index) of abnormalItem" @click="tap(item)"
				:key="item.id" @tap="onTrigger(item)">
				<view class="group-title" style="font-size:10upx">{{item.abnormalName}}</view>
				<view class="group-bomtitle tc" style="font-size:7upx">{{item.abnormalDesc}}</view>
				<text class="group-bomtitle bt-orange tc" style="font-size:10upx"
					v-for="(responder, indes) of item.responders" :key="responder.id">
					【{{responder.name}}】
				</text>
				<!-- <view class="group-bomtitle bt-orange tc" style="font-size:10upx" v-for="(responder, indes) of item.responders" :key="responder.id">
				{{responder.name}}</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	// Andon分类查询、异常项查询
	import {
		getCateList,
		getAbnormalList
	} from "@/https/andon/andon.js"
	export default {
		data() {
			return {
				classItems: [], // andon分类集合
				abnormalItem: [], // 异常项集合
				listQuery: {
					pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
					pg_pagesize: 1000, // 查询第几页数据，默认第一页 pg_pagesize
					cateId: '' // 查询的分类id
				}
			}
		},
		methods: {
			onQuery() {
				// 查询andon分类
				getCateList().then(res => {
					this.classItems = res.data
				})
			},
			// 查看分类下的子分类
			onNext(item) {
				this.listQuery.cateId = item.id
				// 异常项查询
				getAbnormalList(this.listQuery).then(response => {
					this.abnormalItem = response.data
					console.log(this.abnormalItem)
					if (item.sub && item.sub.length > 0) {
						this.classItems = item.sub
					} else {
						// 判断有没有异常项
						if (this.abnormalItem.length > 0) {
							this.classItems = []
						}
					}
				})
			},
			// andon触发
			onTrigger(item) {
				uni.navigateTo({
					url: './andon_003_trigger?item=' + JSON.stringify(item) + '&fcateId=' + this.listQuery.cateId,
				})
			}
		},
		onLoad(options) {
			if (options.type == 8) {
				this.listQuery.cateId = options.cateId
				getAbnormalList(this.listQuery).then(response => {
					this.abnormalItem = response.data
				})
				return
			}
			this.onQuery()
		}
	}
</script>

<style lang="scss">
	.card {
		width: 160rpx;
		height: 90rpx;
	}
</style>