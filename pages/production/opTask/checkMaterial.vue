<template>	
		<scroll-view scroll-y="true" style="height: 700px"  @scrolltolower="pullDown">
			<view class="content">
			<uni-table border>
				<uni-tr>
					<uni-th align="center">序号</uni-th>
					<uni-th align="center">部件编号</uni-th>
					<uni-th align="center">部件名称</uni-th>
					<uni-th align="center">数量</uni-th>
					<uni-th align="center">单位</uni-th>
					<uni-th align="center">物料制造源</uni-th>
					<uni-th align="center">说明</uni-th>
				</uni-tr>
				<uni-tr v-for="(item,index) in dataList" :key="index">
					<uni-td align="center">{{index+1}}</uni-td>
					<uni-td align="center">
						<u--text @click="drawing(item.partNumber)" decoration="underline" size="15px" color="#2979FF" :text="item.partNumber" ></u--text>
					</uni-td>
					<uni-td align="center">{{item.partName}}</uni-td>
					<uni-td align="center">{{item.quantity}}</uni-td>
					<uni-td align="center">{{item.unit}}</uni-td>
					<uni-td align="center">{{item.source}}</uni-td>
					<uni-td align="center">{{item.description}}</uni-td>
				</uni-tr>
			</uni-table>
			</view>
		</scroll-view>
		
	
</template>

<script>
	import {
		getBom
	} from "@/https/production/proudction.js"
	export default {
		data() {
			return {
				data: {},
				dataList: [],
				listQuery: {
					pg_pagenum: 1,
					pg_pagesize: 25
				},
				total:0,
			}
		},
		methods: {
			onQuery(){
				this.listQuery.pg_pagenum = 1;
				this._onQuery();
			},
			_onQuery(appendList=false) {
				getBom({
					opStandMark: this.data.opStandMark,
					drawingNo: this.data.drawingNo,
					bomNumber: this.data.bomNumber,
					pg_pagenum: this.listQuery.pg_pagenum,
					pg_pagesize: this.listQuery.pg_pagesize
				}).then(res => {
					if (res.err_code == 10000) {
						if(appendList){
							this.dataList = this.dataList.concat(res.data);
						}else{
							this.dataList = res.data
						}
						this.total = res.total_count
						if (res.total_count == 0) {
							uni.showToast({
								title: "当前无有操作记录任务",
								icon: 'none',
								duration: 2000
							})
						}
					} else {
						uni.showToast({
							title: resp.err_msg,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			drawing(number) {
				var partNumber = encodeURI(number)
				var url = 'http://192.168.100.12:8080/aes/redirect/ryd?partNumber=' + partNumber + '&userName=' + uni.getStorageSync("lgnId")
				// #ifdef H5
				window.open(url)
				// #endif
				// #ifdef APP-PLUS
				plus.runtime.openURL(url)
				// #endif
			},
			//下拉
			pullDown() {
				let totalPage = Math.ceil(this.total / this.listQuery.pg_pagesize)
				if (this.listQuery.pg_pagenum + 1 > totalPage) {
					uni.hideNavigationBarLoading();
					this.$u.toast('无更多数据');
				} else {
					this.listQuery.pg_pagenum += 1;
					this._onQuery(true);
				}
			},
		},
		onLoad(e) {
			this.data = JSON.parse(decodeURIComponent(e.item))
			this.onQuery()
		}
	}
</script>

<style>
</style>