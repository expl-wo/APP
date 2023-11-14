<template>
	<view class="content">
		<view class="app-containerC app-containerWrap " v-for="item in workSpaceList">
			<label class="label">{{item.name}}({{item.taskCount}}):</label>
			<view class="app-containerR app-containerWrap">
				<view class="group-warter w-195 tc  "
					:style="{'background': i.color,'white-space': 'normal', 'height': 'auto'}" @tap="tap(i)"
					v-for="i in item.sub" :key="i.name" v-bind="item.sub">
					{{ i.name }}<br>
					{{i.wkNumber}}<br>
					任务数：{{i.taskCount}},{{i.initTaskCount}},{{i.specialTaskCount}}
				</view>
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
				workSpaceList: [],
			};
		},
		methods: {
			tap(data) {
				if (data.isEmpower === 0) {
					// this.$message({ message: '请已选择已绑定工位', type: 'error' })
				} else {
					this.station = data
					// this.$message({ message: '已选择'+ this.station.name+'工位', type: 'sucess' })
					let params = {
						productLineId: this.station.productLineId,
						workspaceId: this.station.wkNumber
					}
					findInstanceByWork({
						workspaceId: this.station.id
					}).then(res => {
						if (res.data == null || res.data.list.length === 0) {
							changeWorkspace(params).then(response => {

								if (response.err_code === 10000) {
									uni.navigateTo({
										url: '/pages/production/opTask/index'
									})
									uni.setStorageSync("workSpace",this.station.name)
									// getApp().globalData.workSpace = this.station.name
									//   this.$message.success('数据保存成功');
									//   this.$store.dispatch('my/changeLineWorkSpace',response.data.lineSteps)
									//   console.log(this.fromPath)
									//   if(this.fromPath === '/' || this.fromPath === ''){
									//     this.$router.push('/pm/pm004_opTask')
									//   }else{
									//     this.$router.push(this.fromPath )
									//   }
								} else {
									// this.$message.error(response.err_msg);
								}
							})
						} else {
							var item = encodeURIComponent(JSON.stringify(res.data)).replace(/%/g,'%25')
							var station = encodeURIComponent(JSON.stringify(this.station)).replace(/%/g,'%25')
							// this.processDataDe(res.data).then( ()=>{)
							uni.navigateTo({
								url: '/pages/production/opTask/selectPosition?item='+item+'&station='+station
							})
							// this.processDataDe(res.data)
							// this.$refs.instanceDialogRef.init(res.data,this.station)
						}
					})
				}
			},
			processData(dataList) {
				dataList.forEach((item) => {
					let subList = item.sub
					if (subList && subList.length > 0) {
						subList.forEach(secondItem => {
							if (secondItem.isEmpower === 1) {
								secondItem['color'] = '#4cd6f5'
							} else if (secondItem.isEmpower === 2) {
								secondItem['color'] = '#bbf75e'
							} else if (secondItem.isEmpower === 0) {
								secondItem['color'] = '#e5e5e5'
							}
						})
					}
				})
			},

			resetting() {
				let params = {
					productLineId: null,
					workspaceId: null
				}
				changeWorkspace(params).then(response => {
					if (response.err_code === 10000) {
						// this.$message.success('重置成功');
						// this.$store.dispatch('my/changeLineWorkSpace',response.data.lineSteps)
						this.onBtnQuery()
					} else {
						// this.$message.error(response.err_msg);
					}
				})
			},
		},
		onLoad() {
			findLineSteps().then(response => {
				this.processData(response.data)
				this.workSpaceList = response.data
			})
		}
	}
</script>

<style>
	.label {
		margin: 10px;
		font-size: 22px !important;
		float: left;
	}
</style>