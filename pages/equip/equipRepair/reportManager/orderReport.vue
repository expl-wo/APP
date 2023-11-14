<template>
	<view class="content">
		<view class="app-containerR bg-white cc">
			<view class="leftMax3RCon">
				<u-form :model="showForm" ref="uForm" labelWidth="90px">
					<u-form-item label="设备类型" prop="className" required>
						<u-input placeholder="请选择设备类型" v-model="showForm.className" type="text" disabled=""></u-input>
						<button class="btn" type="primary" size="mini" @click="classShow = true">请选择</button>
					</u-form-item>
					<u-form-item label="报修设备" prop="equipName" required>
						<u-input placeholder="请选择报修设备" v-model="showForm.equipName" type="text" disabled=""></u-input>
						<button class="btn" type="primary" size="mini" @click="deviceShow = true">请选择</button>
					</u-form-item>
					<u-form-item label="预约时间" prop="showTime" required>
						<!-- <u-input placeholder="请选择预约维修时间" v-model="showForm.showTime" type="text" disabled=""></u-input> -->
						<uni-datetime-picker type="datetime" :start="nowData" v-model="showForm.showTime" hide-second />
						<!-- <button class="btn" type="primary" size="mini" @click="timeShow = true">请选择</button> -->
					</u-form-item>
					<u-form-item label="故障类型" prop="faultName" required>
						<u-input placeholder="请选择故障类型" v-model="showForm.faultName" type="text" disabled=""></u-input>
						<button class="btn" type="primary" size="mini" @click="faultShow = true">请选择</button>
					</u-form-item>
					<u-form-item label="上传图片" class="upload-group" prop="localImages" required>
						<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" accept="image"
							multiple :maxCount="3" :previewFullImage="true"></u-upload>
					</u-form-item>
				</u-form>
				<view class="wp app-containerR cc">
					<button type="primary" class="m-20" size="mini" @click="submitRepairClick">确认</button>
					<button class="m-20" size="mini" @click="cancelClick">取消</button>
				</view>
			</view>
		</view>


		<!-- 		<u-datetime-picker
			mode="datetime" :minDate="nowData" 
			:show="timeShow" @close="close" 
			@cancel="close"  :params="timeParams" 
			ref="datetimePicker"
			@confirm="datePickerConfirm"></u-datetime-picker> -->

		<!--设备类型弹窗-->
		<u-popup mode="bottom" @close="close" :show="classShow">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">设备类型名称</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in classList" :key="x.id">
							<view class="td">{{x.name}}</view>
							<view class="td">
								<button size="mini" type="primary" @click="saveClassData(x)">确认</button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<!--选择设备弹窗-->
		<u-popup mode="bottom" @close="close" :show="deviceShow">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">设备名称</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in eqpIdNameData" :key="x.k">
							<view class="td">{{x.v}}</view>
							<view class="td">
								<button size="mini" type="primary" @click="saveDeviceData(x)">确认</button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<!--选择故障类型弹窗-->
		<u-popup mode="bottom" @close="close" :show="faultShow">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">故障类型名称</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in faultData" :key="x.k">
							<view class="td">{{x.v}}</view>
							<view class="td">
								<button size="mini" type="primary" @click="saveFaultData(x)">确认</button>
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
		getToken,
		setToken
	} from '@/utils/auth.js';
	import uploadHttp from '@/https/_public/upload';
	import {
		$confirm
	} from '@/utils/common.js'
	import {
		getFileServerUrl
	} from '@/utils/config.js'
	import {
		getRepairInit,
		submitRepair,
		getEqpClass,
		getEqpByClass
	} from '@/https/equip/equipReport.js'
	// import{ uploadSingleFileCommonUrl } from '@/api/common.js'
	export default {
		data() {
			return {
				border: false, //input边框
				classShow: false,
				deviceShow: false,
				eqpIdNameData: [], //k是id,v是名称[{k:'',v:''}]
				faultShow: false,
				faultData: [],
				classShow: false,
				classList: [],
				fileList: [],
				//时间日期选择器
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				nowData: 0,
				timeShow: false,
				//展示给用户看的form
				showForm: {
					equipName: '',
					faultName: '',
					showTime: '',
					localImages: [],
					images: ''
				},
				requestForm: { //上传给后台的form
					equipId: '',
					faultId: [],
					// orderRequstTime:'',
					requestImages: [],
				},
				rules: {
					className: [{
						required: true,
						message: '请选择设备类型',
						trigger: ['change'],
					}],
					equipName: [{
						required: true,
						message: '请选择报修设备',
						trigger: ['change', 'blur'],
					}],
					faultName: [{
						required: true,
						message: '请选择故障类型',
						trigger: ['change', 'blur'],
					}],
					showTime: [{
						required: true,
						message: '请选择预约维修时间',
						trigger: ['change', 'blur'],
					}],
					localImages: [{
						type: 'array',
						min: 1,
						required: true,
						message: '请上传照片',
						trigger: ['change'],
					}]
				},
			}
		},
		// 必须要把验证放在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);

		},
		onLoad() {
			this.queryEqpClass()
		},
		methods: {
			onShow() {
				this.eqpIdNameData = []
				this.faultData = []
				// console.log('预约报修 Show');
				getRepairInit().then(res => {
					// if(res.data.eqpIdName.length>0){
					// 	this.eqpIdNameData = res.data.eqpIdName
					// }
					if (res.data.faultCate.length > 0) {
						this.faultData = res.data.faultCate
					}
				})
				this.nowData = Number(new Date())
			},
			//获取类型列表
			queryEqpClass() {
				getEqpClass().then(res => {
					this.classList = res.data
					console.log(this.classList)
				})
			},
			close() {
				this.classShow = false
				this.deviceShow = false
				this.faultShow = false
				this.timeShow = false
			},
			deletePic(event) {
				// value.imageToShow = ''
				this.fileList.splice(event.index, 1)
				this.showForm.localImages.splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event, value, index) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				// #ifdef H5
				const whiteList = ['jpg', 'png', 'jepg', 'jpeg', 'img', 'gif']
				var isSuffix = false
				lists.forEach(item => {
					const fileSuffix = item.name.substring(item.name.lastIndexOf('.') + 1)
					isSuffix = whiteList.indexOf(fileSuffix.toLowerCase()) === -1
				})
				if (isSuffix) {
					uni.showToast({
						icon: 'none',
						title: "请选择图片",
					});
					return;
				}
				// #endif
				let fileListLen = this.fileList.length
				lists.map((item) => {
					this.fileList.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					this.showForm.localImages.push(result)

					let item = this.fileList[fileListLen]
					let url = getFileServerUrl() + result;
					this.fileList.splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: url
					}))

					fileListLen++;

					// this.fileList.splice(event.index, 1)
					// this.fileList.push({url:url})
				}
			},

			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					uploadHttp.upload({
						token: getToken(),
						filePath: url
					}).then(response => {
						if (response.code === 200) {
							setTimeout(() => {
								return resolve(response.data.filePath)
							}, 150)
						} else {
							return resolve({
								status: 500,
								msg: '上传失败'
							});
						}
					});
				})
			},

			bindDateTimeChange: function(e) {
				this.showForm.showTime = e.detail.value
			},

			// 通过class找设备
			queryEqpByClass(id) {
				console.log('通过class找设备')
				getEqpByClass({
					id: id
				}).then(res => {
					this.eqpIdNameData = res.data
					console.log(this.eqpIdNameData)
				})
			},
			//选择设备类型
			saveClassData(item) {
				this.showForm.className = item.name
				this.requestForm.classId = item.id
				this.classShow = false
				this.queryEqpByClass(item.id)
			},
			//选择设备
			saveDeviceData(item) {
				this.showForm.equipName = item.v
				this.requestForm.equipId = item.k
				this.deviceShow = false
			},
			// 选择故障类型
			saveFaultData(item) {
				this.showForm.faultName = item.v
				this.requestForm.faultId.push(item.k)
				this.faultShow = false
			},
			// 选择预约时间
			datePickerConfirm(object) {
				console.log('选择时间', object)
				// this.showForm.showTime = object.year + "-" + object.month + "-" + object.day + " " + object.hour + ":" +
				// 	object.minute
				this.timeShow = false
			},
			// 提交报修
			submitRepairClick() {
				this.$refs.uForm.validate().then(valid => {
					if (valid) {
						console.log('验证通过');
						//请求参数
						var para = {
							repairInfo: {},
							repairPic: [],
							faultCateId: ''
						}
						para.repairInfo = {
							eqpId: this.requestForm.equipId,
							triggerSource: '2',
							triggerTime: this.showForm.showTime
						}
						para.repairPic = this.showForm.localImages
						para.faultCateId = this.requestForm.faultId
						console.log('请求参数', para)
						//报修API
						submitRepair(para).then(res => {
							console.log(res)
							uni.navigateBack()
						})
					} else {
						console.log('验证失败')
					}
				}).catch(errors => {
				})
			},
			// 取消
			cancelClick() {
				uni.navigateBack()
			},
			//上传图片
			takePhoto() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePathsArray = chooseImageRes.tempFilePaths;
						this.showForm.localImages = this.showForm.localImages.concat(tempFilePathsArray)
						this.showForm.images = this.showForm.localImages.toString()
						for (let i = 0; i < tempFilePathsArray.length; i++) {
							uploadSingleFileCommonUrl(tempFilePathsArray[i]).then(res => {
								this.requestForm.requestImages.push(res.data.url)
							})
						}
						console.log('图片', this.showForm.localImages, this.requestForm.requestImages)
					},
				})
			},
			//图片放大
			previewPictures(item) {
				uni.previewImage({
					current: item,
					urls: this.showForm.localImages
				})
			},
		}
	}
</script>



<style lang="scss" scoped>
	.btn {
		margin-left: 10px;
	}

	.u-checkbox {
		margin-right: 20px;
	}
	
	/deep/.u-form-item{
		padding-left: 12px;
	}
</style>