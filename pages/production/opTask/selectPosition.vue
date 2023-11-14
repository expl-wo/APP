<template>
	<view class="content">
		<view style="margin-left: 10px;"> 无工位任务数：{{noWorkSpaceTaskCount}}</view>
		
		<view class="app-containerR app-containerWrap ">
			
			<view class="group-warter w-240 tc  "
				:style="{'background': i.color,'white-space': 'normal', 'height': 'auto'}" @tap="tap(i)"
				v-for="i in dataList" :key="i.typeNumber" v-bind="dataList">
				<u-icon class="text-xl" size="60" name="../../static/img/icon/gscx.png"></u-icon>
				{{i.typeName }}<br>
				{{i.typeNumber}}<br>
				任务数：{{i.taskCount}},{{i.initTaskCount}},{{i.specialTaskCount}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		findLineSteps,
		findInstanceByWork,
		changeWorkspace
	} from "@/https/production/proudction.js"
	export default {
		data() {
			return {
				dataList: [],
				station:{},
				noWorkSpaceTaskCount: 0,
			};
		},
		methods: {
			tap(data) {
				let params = {
					productLineId: this.station.productLineId,
					workspaceId: this.station.wkNumber,
					instanceId: data.typeNumber
				}
				console.log(data);
				changeWorkspace(params).then(response => {
					if (response.err_code === 10000) {
						uni.navigateTo({
							url: '/pages/production/opTask/index'
						})
						uni.setStorageSync("workSpace",data.typeName)
						// getApp().globalData.workSpace = data.typeName
						// uni.setStorageSync('workSpace', JSON.stringify(data.name));
						// this.$message.success('数据保存成功');
						// this.$store.dispatch('my/changeLineWorkSpace', response.data.lineSteps)
						// if (this.fromPath === '/' || this.fromPath === '') {
						// 	this.$router.push('/pm/pm004_opTask')
						// } else {
						// 	this.$router.push(this.fromPath)
						// }
					} else {
						// this.$message.error(response.err_msg);
					}
				})
				console.log(data)
			},
			processDataDe(dataList){
			  dataList.forEach((item)=>{
			        /* item['23_startDate'] = '4/15'
			         item['23_status'] = 'delay'*/
			        if (item.isEmpower===1){
			          item['color'] = '#5ac6f5'
			        } else if (item.isEmpower===2){
			          item['color'] = '#bbf75e'
			        } else if (item.isEmpower===0){
			          item['color'] = '#e5e5e5'
			        }
			  })
			  console.log(dataList);
			},
		},
		onLoad(e) {
			
			var data = JSON.parse( decodeURIComponent(e.item))
			this.processDataDe(data.list)
			this.noWorkSpaceTaskCount = data.noWorkSpaceTaskCount
			this.$nextTick( ()=>{
				this.dataList=data.list
			})
			this.station = JSON.parse( decodeURIComponent(e.station))
		}
	}
</script>

<style>
	.label {
		/* position: absolute; */
		/* color: #2979FF; */
		margin: 15rpx;
		font-size: 15rpx !important;
		float: left;
	}
</style>