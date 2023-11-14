<template>
	<view class="content">
		<uni-table border>
			<uni-tr>
				<uni-th align="center">序号</uni-th>
				<uni-th align="center">部件编号</uni-th>
				<uni-th align="center">部件名称</uni-th>
				<uni-th align="center">是否有图</uni-th>
				<uni-th align="center">部件类型</uni-th>
			</uni-tr>
			<uni-tr v-for="(item,index) in dataList" :key="index">
				<uni-td align="center">{{index+1}}</uni-td>
				<uni-td align="center">
					{{item.mnumber}}

				</uni-td>
				<uni-td align="center">{{item.mname}}</uni-td>
				<uni-td align="center">{{item.partType1}}</uni-td>
				<uni-td align="center">
					<u--text @click="openDrawing(item.mnumber)" v-if="item.isTh == '有图'" decoration="underline" size="15px"
						color="#2979FF" :text="item.isTh"></u--text>
					<!-- <a class="xui-a" v-if="item.isTh == '有图'" @click="openDrawing(item.mnumber)" >{{scope.row.isTh }}</a> -->
					<span v-else>{{item.isTh }}</span>
				</uni-td>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script>
	// import {
	// 	getBom
	// } from "@/https/production/proudction.js"
	export default {
		data() {
			return {
				data: {},
				dataList: [],
				listQuery: {
					pg_pagenum: 1,
					pg_pagesize: 25
				},
				total: 0,
			}
		},
		methods: {

			openDrawing(number){
				
			  const url = 'http://192.168.100.12:8080/aes/redirect/r2?test=0&useId='+ '638624' +'&no=' + number

			  window.open(url, '_blank')
			  
			},
			//下拉
			// pullDown() {
			// 	let totalPage = Math.ceil(this.total / this.listQuery.pg_pagesize)
			// 	if (this.listQuery.pg_pagenum + 1 > totalPage) {
			// 		uni.hideNavigationBarLoading();
			// 		this.$u.toast('无更多数据');
			// 	} else {
			// 		this.listQuery.pg_pagenum += 1;
			// 		this._onQuery(true);
			// 	}
			// },
		},
		onLoad(e) {
			this.dataList = JSON.parse(decodeURIComponent(e.item))
		}
	}
</script>

<style>
</style>