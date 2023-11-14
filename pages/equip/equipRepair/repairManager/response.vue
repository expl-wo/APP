<template>
	<view class="content">
		<view class="app-containerR bg-white cc">
			<view class="leftMax3RCon">
				<u-form :model="showForm" :rules="rules" ref="uForm">
					<u-form-item label="设备名称">
						<u-input v-model="eqpName" type="text" disabled=""></u-input>
					</u-form-item>
					<u-form-item label="报修时间">
						<u-input v-model="triggerTime" type="text" disabled=""></u-input>
					</u-form-item>
					<u-form-item label="故障描述">
						<u-input v-model="showForm.faultDescription" type="textarea" :maxlength="2000" :rows="6"
							placeholder=" " disabled=""></u-input>
					</u-form-item>
					<u-form-item label="故障照片">

						<u-image v-for="(item,index) in pictures" :key="index" :src="item" width="200px" height="200px"
							class="img" @tap="previewPictures(item,pictures)"></u-image>
					</u-form-item>
					<u-form-item label="响应时间">
						<u-input v-model="respTime" type="text" disabled=""></u-input>
					</u-form-item>
					<u-form-item label="设备状态" prop="equipStatus">
						<u-input placeholder="请选择设备状态" v-model="showForm.equipStatus" type="text" disabled=""></u-input>
						<button class="btn" type="primary" size="mini" @click="equipStatuShow = true">请选择</button>
					</u-form-item>
					<u-form-item label="故障类型" prop="faultName">
						<u-checkbox-group v-model="showForm.faultName" @change="change">
							<u-checkbox size="18px" label-size="14px" iconSize="16px" v-for="(item, index) in faultData"
								:key="item.k" :name="item.k" :label="item.v">{{item.v}}</u-checkbox>
						</u-checkbox-group>
					</u-form-item>
					<u-form-item label="问题描述">
						<u-input :height="40" type="textarea" v-model="description"></u-input>
					</u-form-item>
				</u-form>
				<view class="wp app-containerR cc">
					<button type="primary" class="btn" size="mini" @click="repairResponseClick">确认</button>
				</view>
			</view>
		</view>

		<!--选择设备状态弹窗-->
		<u-popup mode="bottom" @close="close" :show="equipStatuShow">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">设备状态</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in equipStatuData" :key="x.value">
							<view class="td">{{x.label}}</view>
							<view class="td">
								<button size="mini" type="primary" @click="saveDeviceStatuData(x)">确认</button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getFileServerUrl
	} from '@/utils/config.js'
	import {
		getNeedRepairInit,
		responseSubmit
	} from '@/https/equip/equipRepair.js'
	export default {
		data() {
			return {
				border: false,
				repairId: '', //上个页面传过来的维修单ID
				eqpName: '', //设备名称
				triggerTime: '', //维修时间
				respTime: '', //响应时间
				faultData: [], //故障类型:k是id,v是名称
				equipStatuData: [{
					value: 1,
					label: '需要维修'
				}, {
					value: 2,
					label: '可继续使用'
				}],
				equipStatuShow: false,
				description: '',
				showForm: {
					equipStatus: '',
					faultName: [],
					faultDescription: '',
					// pictures:[],
				},
				pictures: [],
				requestForm: {
					currentStatus: '', //给后台传的响应状态 枚举 2：待二次维修 3：维修中
					faultId: '',
				},
				rules: {
					equipStatus: [{
						required: true,
						message: '请选择设备状态',
						trigger: ['change', 'blur'],
					}],
					faultName: [{
						type: 'array',
						min: 1,
						required: true,
						message: '请选择故障类型',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur'],
					}]
				},
			};
		},
		// 必须要把验证放在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad: function(option) {
			this.faultData = []
			this.repairId = option.repairId
			//响应初始化
			getNeedRepairInit({
				id: this.repairId
			}).then(res => {
				this.respTime = res.data.respTime
				this.eqpName = res.data.eqpName
				this.showForm.faultDescription = res.data.faultDescription
				// this.showForm.pictures = res.data.pictures
				this.triggerTime = res.data.triggerTime
				if (res.data.faultCate.length > 0) {
					this.faultData = res.data.faultCate
				}
				this.pictures = this.getImageUrls(res.data.pictures)
				// console.log('res',res)
			})
		},
		methods: {
			close() {
				this.equipStatuShow = false
			},
			// 选择设备响应状态
			saveDeviceStatuData(item) {
				this.showForm.equipStatus = item.label
				this.requestForm.currentStatus = item.value
				this.equipStatuShow = false
			},
			getImageUrl(url) {
				return getFileServerUrl() + url
			},
			getImageUrls(urls) {
				return urls.map(item => {
					return getFileServerUrl() + item
				})
			},
			previewPictures(item, allItems) {
				uni.previewImage({
					current: item,
					urls: allItems
				})
			},
			// 维修响应
			repairResponseClick() {
				this.$refs.uForm.validate().then(() => {
					uni.$u.toast('校验通过')
					var param = {
						respInfo: {
							id: this.repairId,
							respDesc: this.description,
							currentStatus: this.requestForm.currentStatus
						},
						cateId: this.requestForm.faultId,
					}
					// console.log('维修响应参数',param)
					responseSubmit(param).then(res => {
						if (res.err_code == 10000) {
							// console.log('维修响应数据',res)
							if (this.showForm.equipStatus == '需要维修') { //维修操作
								uni.redirectTo({
									url: "/pages/equip/equipRepair/repairManager/operation?repairId=" +
										this.repairId
								}) //维修操作页面
							} else { //可继续使用
								uni.navigateBack()
							}
						} else {
							uni.$u.toast(res.err_msg)
						}

					})
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},

			// 取消
			cancelClick() {
				uni.navigateBack()
			},
			change(e) {
				this.requestForm.faultId = e;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.btn {
		margin-left: 10px;
	}

	.img {
		margin-right: 10px;
	}

	.u-checkbox {
		margin-right: 20px;
	}
</style>