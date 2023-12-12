<template>
	<view class="content">
		<view class="app-containerR bg-white cc">
			<view class="myform leftMax3RCon">
				<u-form>
					<u-form-item label="报修设备">
						<u-input   v-model="repairCompleteData.eqpName" type="text" disabled></u-input>
					</u-form-item>
					<u-form-item label="报修时间">
						<u-input   v-model="repairCompleteData.triggerTime" type="text" disabled></u-input>
					</u-form-item>
					<u-form-item label="报修来源">
						<u-input   v-model="repairCompleteData.source" type="text" disabled></u-input>
					</u-form-item>
					<u-form-item label="响应时间">
						<u-input   v-model="repairCompleteData.respTime" type="text" disabled></u-input>
					</u-form-item>
					<u-form-item label="响应人">
						<u-input   v-model="repairCompleteData.respPerName" type="text" disabled></u-input>
					</u-form-item>
					<u-form-item label="故障部位">
						<u-input   :height="40" v-model="repairCompleteData.phenomenon" type="textarea" disabled></u-input>
					</u-form-item>
					<u-form-item label="维修过程分析描述">
						<u-input   :height="40" v-model="repairCompleteData.analysisDesc" type="textarea" disabled></u-input>
					</u-form-item>
					<u-form-item label="完成时间">
						<u-input   v-model="repairCompleteData.completionTime" type="text" disabled></u-input>
					</u-form-item>
					<u-form-item label="维修人员">
						<u-input   v-model="repairCompleteData.repairManName" type="text" disabled></u-input>
					</u-form-item>
					<u-form-item label="设备状态">
						<u-radio-group v-model="repairCompleteData.status">
							<u-radio :name="1">
								已修复
							</u-radio>
							<u-radio :name="0">
								没修复
							</u-radio>
						</u-radio-group>
						<!-- <u-input :border="border" v-model="repairCompleteData.evaluate" type="text" ></u-input> -->
					</u-form-item>
					<u-form-item label="满意度">
						<u-radio-group v-model="repairCompleteData.evaluate">
							<u-radio name="非常满意">
								非常满意
							</u-radio>
							<u-radio name="满意">
								满意
							</u-radio>
							<u-radio name="一般">
								一般
							</u-radio>
							<u-radio name="不满意">
								不满意
							</u-radio>
						</u-radio-group>
						<!-- <u-rate v-model="repairCompleteData.score"></u-rate> -->
					</u-form-item>
					<u-form-item label="是否清理维修现场">
						<u-radio-group v-model="repairCompleteData.isClear">
							<u-radio :name="1">
								是
							</u-radio>
							<u-radio :name="0">
								否
							</u-radio>
						</u-radio-group>
						<!-- <u-input :border="border" v-model="repairCompleteData.evaluate" type="text" ></u-input> -->
					</u-form-item>
					<u-form-item label="报修图片">
					     <u-image v-for="(item,index) in reportPicArr" :key="index" :src="item" width="200px" height="200px" class="img" @tap="previewReportPictures(item)"></u-image>
					</u-form-item>
					<u-form-item label="维修图片">
					     <u-image v-for="(item,index) in compPicArr" :key="index" :src="item" width="200px" height="200px" class="img" @tap="previewCompPictures(item)"></u-image>
					</u-form-item>
				</u-form>
				<view class="wp app-containerR cc">
					<button type="primary" class="m-10" size="mini" @click="repairCompleteSureClick">确认</button>
					<button class="m-10" size="mini" @click="cancelClick">取消</button>
				</view >
			</view>
		</view>
	</view>
</template>

<script>
	import {confirmRepairInit, confirmRepairSubmit} from '@/https/equip/equipReport.js'
	import { getFileServerUrl } from '@/utils/config.js'
	export default {
		data() {
			return {
				border:false,
				repairmgtId:'', //设备维修单id
				repairCompleteData:'',
				reportPicArr:'',
				compPicArr:''
			};
		},
		onLoad:function(option){
			this.repairCompleteData = []
			this.repairmgtId = option.repairmgtId
			// console.log("11++:",option.repairmgtId)
			//维修完成确认界面初始化
			confirmRepairInit({id:this.repairmgtId}).then(res=>{
				console.log("维修完成确认界面初始化==",res)
				this.repairCompleteData = res.data.repairInfo
				this.reportPicArr = res.data.reportPicPath //报修照片地址
				this.compPicArr = res.data.compPicPath //维修完成照片地址
				// 触发来源、枚举 0：Andon 1：SCADA 2：预约维修 3：设备报修
				if(this.repairCompleteData.triggerSource == 0){
					this.repairCompleteData.source = 'Andon'
				}else if(this.repairCompleteData.triggerSource == 1){
					this.repairCompleteData.source = 'SCADA'
				}else if(this.repairCompleteData.triggerSource == 2){
					this.repairCompleteData.source = '预约维修'
				}else{
					this.repairCompleteData.source = '设备报修'
				}
				//报修图片拼接
				for(let i=0; i<this.reportPicArr.length; i++){
					var pic = this.reportPicArr[i]
					this.reportPicArr[i] = getFileServerUrl()+pic
				}
				//维修后图片拼接
				for(let i=0; i<this.compPicArr.length; i++){
					var pic = this.compPicArr[i]
					this.compPicArr[i] = getFileServerUrl()+pic
				}
				console.log('照片',this.reportPicArr, this.compPicArr)
			})
		},
		
		methods:{
			//维修确认
			repairCompleteSureClick(){
				console.log('维修确认111')
				//维修确认
				confirmRepairSubmit({id:this.repairmgtId,evaluate:this.repairCompleteData.evaluate,
							status:this.repairCompleteData.status,isClear:this.repairCompleteData.isClear}).then(res=>{
								if(res.err_code === 10000){
									uni.navigateBack()
								}else{
									uni.showToast({	
										title: res.err_msg,
										icon: 'none',
										duration: 1000
									});
								}
					
				})
			},
			// 取消
			cancelClick(){
				uni.navigateBack()
			},
			//报修图片放大
			previewReportPictures(item) {
				uni.previewImage({
					current: item,
					urls: this.reportPicArr
				})
			},
			//维修图片放大
			previewCompPictures(item) {
				uni.previewImage({
					current: item,
					urls: this.compPicArr
				})
			},
		}
	}
</script>


<style>
</style>
