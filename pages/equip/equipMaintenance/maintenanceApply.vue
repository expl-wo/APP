<template>
	<view class="content main">
		<view class="bt-info">保养单信息：</view>
		<template>
			<u-form :model="acceptInfo" ref="uForm" label-width="80px" label-align="center">
				<u-row gutter="16">
					<u-col span="6">
						<u-form-item class="text-bt" label="保养单号:">
							<u-input :disabled="true" height="30"  type="textarea"
								v-model="acceptInfo.dspNo" />
						</u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item class="text-bt" label="保养名称:">
							<u-input :disabled="true" height="30"  type="textarea"
								v-model="acceptInfo.mtcName" />
						</u-form-item>
					</u-col>
				</u-row>
				<u-row gutter="16">
					<u-col span="6">
						<u-form-item class="text-bt" label="设备编号:">
							<u-input :disabled="true" height="30"  type="textarea"
								v-model="acceptInfo.eqpId" />
						</u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item class="text-bt" label="设备名称:">
							<u-input :disabled="true" height="30"  type="textarea"
								v-model="acceptInfo.eqpName" />
						</u-form-item>
					</u-col>
				</u-row>
				<u-row gutter="16">
					<u-col span="6">
						<u-form-item class="text-bt" label="保养日期:">
							<u-input :disabled="true" height="30"  type="textarea"
								v-model="acceptInfo.mtcDate" />
						</u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item class="text-bt" label="保养人:">
							<u-input :disabled="true" height="30"  type="textarea"
								v-model="acceptInfo.mtcUser" />
						</u-form-item>
					</u-col>
				</u-row>
				<u-row gutter="16">
					<u-col span="6">
						<u-form-item class="text-bt" label="评价:">
							<u-radio-group  v-model="acceptInfo.evaluate">							
								<u-radio style="margin-left: 10px;" name="优" label="优" />
								<u-radio style="margin-left: 10px;" name="良" label="良" />		
								<u-radio style="margin-left: 10px;" name="差" label="差" />							
							</u-radio-group>
						</u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item class="text-bt" label="发生风险:">
							<u-radio-group width="60%" v-model="acceptInfo.haveRisk" >
								<u-radio :name="1" style="margin-left: 10px;"  label="有" />
								<u-radio :name="0" style="margin-left: 10px;"  label="无" />
							</u-radio-group>
						</u-form-item>
					</u-col>
				</u-row>
				<u-row gutter="16" v-show="acceptInfo.haveRisk == 1">
					<u-col span="12">
						<u-form-item class="text-bt" label="风险说明:">
							<u-input maxlength="2000" :disabled="acceptInfo.haveRisk == 0"  type="textarea"
								v-model="acceptInfo.riskDescription" />
						</u-form-item>
					</u-col>
				</u-row>
			</u-form>
		</template>

		<view class="bt-info">保养项记录：</view>
		<view class="app-containerC wp table-zdy wrap border-black">
			<view class="th-group">
				<view class="th" >步骤</view>
				<view class="th">保养项名称</view>
				<view class="th">保养描述</view>
				<!-- <view class="th">保养图示</view> -->
				<view class="th">保养记录</view>
				<view class="th">拍摄照片</view>
			</view>
			<view class="td-group" style="height: 100px" v-for="item in maintenanceItemSData" :key="item.id">
				<view class="td">{{item.step}}</view>
				<view class="td">{{item.name}}</view>
				<view class="td">{{item.description}}</view>
				<!-- <view class="td">
					<image class="wp hp" :src="item.illId" @click="previewImg(item.illId)"></image>
				</view> -->
				<view class="td">{{item.record}}</view>
				<view class="td">
					<image class="wp hp"  mode="aspectFit"  :src="getImageUrl(item.imageToShow)" @click="previewImg(item.imageToShow)"></image>
				</view>
			</view>
		</view>

		<view class="bt-info">需验收人员：</view>
		<template>
			
			<u-form :model="acceptInfo" ref="uForm" label-width="200px" label-align="center">
				<u-row gutter="16">
					<u-col span="6">
						<u-form-item class="text-bt" label="保养负责人:">
							<u-input :disabled="true" height="30"    type="textarea"
								v-model="acceptInfo.acceptorName" />
						</u-form-item>
					</u-col>
					<u-col span="6">
						<button class="button-custom-style" type="primary" :ripple="true" @click="scanForPhone(0)">验收</button>
					</u-col>
				</u-row>
				<u-row gutter="16">
					<u-col span="6">
						<u-form-item class="text-bt" label="使用部门负责人:">
							<u-input :disabled="true" height="30"    type="textarea"
								v-model="acceptInfo.departmentUserName" />
						</u-form-item>
					</u-col>
					<u-col span="6">
						<button class="button-custom-style"  type="primary" :ripple="true" @click="scanForPhone(1)">验收</button>
					</u-col>
				</u-row>
				<u-row gutter="16">
					<u-col span="6">
						<u-form-item class="text-bt" label="设备部负责人:">
							<u-input :disabled="true" height="30"    type="textarea"
								v-model="acceptInfo.eqpDepartmentUserName" />
						</u-form-item>
					</u-col>
					<u-col span="6">
						<button class="button-custom-style"  type="primary" :ripple="true" @click="scanForPhone(2)">验收</button>
					</u-col>
				</u-row>
			</u-form>
		</template>


		<view class="wp app-containerR cc">
			<button type="primary" class="m-20"  :ripple="true" @click="saveAccept">保存</button>
			<button type="success" class="m-20"  :ripple="true" @click="submitAccept">验收完成</button>
			<button class="m-20"  @click="cancelClick">取消</button>
		</view>
	</view>
</template>

<script>
	import {
		getAcceptInfo,
		acceptFinish,
		acceptUser
	} from '@/https/equip/equipMaintenance.js'
	import {
		getCommonUrlStore,
		uploadSingleFileCommonUrl
	} from '@/https/_public/common.js'
	import {
		$confirm
	} from '@/utils/common.js'
	import {getFileServerUrl} from '@/utils/config.js'
	export default {
		data() {
			return {
				maintenanceItemSData: '', //所有保养项内容
				mtcDspId: '', //保养单主键id，提交保养单的时候传给后台
				deviceItem: '', //上个页面传过来的数据
				acceptInfo: {
					dspNo: '',
					mtcName: '',
					eqpId: '',
					eqpName: '',
					mtcDate: '',
					mtcUser: '',
					evaluate: '',
					haveRisk: '',
					riskDescription: '',
					acceptorId: '',
					acceptorName: '',
					departmentUserId: '',
					departmentUserName: '',
					eqpDepartmentUserId: '',
					eqpDepartmentUserName: '',
				}, //所有验收信息
			};
		},
		onLoad: function(option) {
			this.maintenanceItemSData = []
			//点击某台设备进行保养，传过来的参数
			this.deviceItem = JSON.parse(option.deviceItem)
			this.deviceItem.mtcId = this.deviceItem.ckOrMtcId
			this.deviceItem.mtcDspId = this.deviceItem.attribute1
			// console.log('para',this.deviceItem)
			//获取该台设备的所有保养项内容
			getAcceptInfo(this.deviceItem).then(res => {
				this.maintenanceItemSData = res.data.items
				this.mtcDspId = res.data.mtcDspId
				this.acceptInfo = res.data.acceptInfo
				if(!this.acceptInfo.evaluate){
					this.acceptInfo.evaluate = '优'
				}
				if(!this.acceptInfo.haveRisk){
					this.acceptInfo.haveRisk = '0'
				}
				this.maintenanceItemSData.forEach(item => {
					item.illId = getCommonUrlStore() + item.illId
					item.imageToShow = getCommonUrlStore() + item.photoPath
				})
				// console.log('保养验收数据',this.acceptInfo)
			})
		},
		methods: {
			//保存验收数据
			saveAccept() {
				let param = {
					dspInfo: {
						id: this.mtcDspId,
						evaluate: this.acceptInfo.evaluate,
						haveRisk: this.acceptInfo.haveRisk,
						riskDescription: this.acceptInfo.riskDescription == 0 ? "" : this.acceptInfo.riskDescription
					},
					type: 0
				}
				acceptFinish(param).then(res => {
					if (res.err_code === 10000) {
						uni.navigateBack()
					}
				})
			},
			getImageUrl(url){
				return getFileServerUrl()+url
			},
			//验收完成
			submitAccept() {
				// console.log("验收提交的数据",this.acceptInfo)
				let param = {
					dspInfo: {
						id: this.mtcDspId,
						evaluate: this.acceptInfo.evaluate,
						haveRisk: this.acceptInfo.haveRisk,
						riskDescription: this.acceptInfo.riskDescription == 0 ? "" : this.acceptInfo.riskDescription
					},
					type: 1
				}
				acceptFinish(param).then(res => {
					console.log(res)
					if (res.err_code === 10000) {
						uni.navigateBack()
					}
				})
			},
			scanForPhone(userFrom) {
				var that = this
				uni.scanCode({
					onlyFromCamera: true,
					success: function(res) {
						acceptUser({
							dspId: that.mtcDspId,
							keyNum: res.result,
							userFrom: userFrom
						}).then(lgnRes => {
							// console.log(lgnRes);
							that.acceptInfo.acceptorId= lgnRes.data.acceptorId,
							that.acceptInfo.acceptorName= lgnRes.data.acceptorName,
							that.acceptInfo.departmentUserId= lgnRes.data.departmentUserId,
							that.acceptInfo.departmentUserName= lgnRes.data.departmentUserName,
							that.acceptInfo.eqpDepartmentUserId= lgnRes.data.eqpDepartmentUserId,
							that.acceptInfo.eqpDepartmentUserName= lgnRes.data.eqpDepartmentUserName
							// console.log("111111",lgnRes)
						})
					},
				})
			},
			// 取消
			cancelClick() {
				uni.navigateBack()
			},
			//点击图片放大预览
			previewImg(logourl) {
				console.log(logourl)
				let _this = this;
				let imgsArray = [];
				imgsArray[0] = getFileServerUrl()+logourl
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});
			},
			reload() {
				uni.reLaunch({
					url:"/pages/equip/equip_maintenance/maintenance_003_accept?deviceItem=" + JSON.stringify(this.deviceItem),
					success: () => {
						console.log('reload触发了!!!!!! url====>' + url)
						}
					})
			},
		},
	}
</script>

<style scoped lang="scss">
	.wrap {
		padding: 2rpx;
		margin: 8rpx;
	}

	.u-row {
		margin: 4rpx;
	}

	.border-black {
		background: #ffffff;
		border-style: solid;
		border-width: 1rpx;
		border-color: rgb(0, 0, 0);
	}
	.u-input{
		padding: 5%;
	}
	.text-bt {
		color: black;
		text-align: right;
		font-size: 12rpx;
	}

	.bt-info {
		height: 30rpx;
		font-size: 20rpx;
		color: rgb(55, 167, 247);
	}

	.button-custom-style {
		width: 80rpx;
		// height: 30rpx;
		// font-size: 15rpx;
		// font-weight: bold;
	}
	.main{
		padding-left: 10%;
		padding-right: 10%;
	}
</style>
