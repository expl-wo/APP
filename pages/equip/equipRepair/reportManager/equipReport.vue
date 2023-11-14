<template>
	<view class="content" style="height: 100%;">
		<view class="app-containerR bg-white cc">
			<view class="leftMax3RCon" style="height: 100%;overflow: auto;">
				<u-form :model="showForm" ref="uForm" labelWidth="90px">
					<u-form-item label="报修设备" prop="equipName" required>
						<u-input placeholder="请选择设备" v-model="showForm.equipName" type="text" disabled=""></u-input>
						<button class="btn" type="primary" size="mini" @click="deviceShow = true">请选择</button>
						<button class="btn" type="primary" v-if="isApp" size="mini" @click="toStart()">扫码</button>
						<!-- <barcode autostart="true" ref="barcode"></barcode> -->
					</u-form-item>
					<u-form-item label="设备类型" prop="equipName" required>
						<u-input placeholder="请选择设备类型" v-model="showForm.className" type="text" disabled=""></u-input>
					</u-form-item>
					<u-form-item label="故障类型" prop="faultNames" required>
						<u-checkbox-group v-model="showForm.faultNames">
							<u-checkbox  :size="'18px'" :label-size="'14px'" iconSize="16px"
							  v-for="(item, index) in faultData" :key="item.k"
								:name="item.k" :label="item.v"></u-checkbox>
						</u-checkbox-group>
					</u-form-item>
					<u-form-item label="维修人" prop="repairMans" required>
						<u-input placeholder="请选择设维修责任人" v-model="showForm.repairMans" type="text"
							:disabled="true"></u-input>
						<button class="btn" type="primary" size="mini" @click="repairShow = true">请选择</button>
					</u-form-item>
					<u-form-item label="故障描述" prop="faultDescription">
						<u-input v-model="showForm.faultDescription" type="textarea" :maxlength="2000" :rows="6"
							placeholder="请输入描述"></u-input>
					</u-form-item>
					<u-form-item label="上传图片" class="upload-group" prop="localImages" required>
						<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" accept="image"
							multiple :maxCount="3" :previewFullImage="true"></u-upload>
					</u-form-item>
				</u-form>
				<view class="wp app-containerR cc">
					<button type="primary" class="m-20" size="mini" @click="submitRepairClick">确认</button>
				</view>
			</view>
		</view>
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
				<u-form>
					<u-form-item style="width: 30%;">
						<u-search placeholder="请输入设备编码/名称"
							v-model="keyWord" :show-action="false"></u-search>
						<button slot="right" size="mini" type="primary" @click="queryEqpAll()">搜索</button>
					</u-form-item>
				</u-form>

				<scroll-view scroll-y="true" style="height: 300rpx;" @scrolltolower="pullDown">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">设备编号</view>
							<view class="th">设备名称</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in eqpShowData" :key="x.k" :id="pageNum">
							<view class="td">{{x.number}}</view>
							<view class="td">{{x.name}}</view>
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
		<u-modal :show="repairShow" @close="close" title="用户选择" width="660px" :show-cancel-button="true" :show-title="false"
			:confirm-style="{'margin': '-20px','font-size':'20px'}"
			:cancel-style="{'margin': '-20px','font-size':'20px'}" style="height: 60%;" @confirm="confirmRepairMan"
			@cancel="close" :mask-close-able="true">
			<cv-transfer v-model="selectValue" :data="selectData" :titles="titles"></cv-transfer>
		</u-modal>
	</view>
</template>

<script>
	import {
		getRepairInit,
		submitRepair,
		getEqpClass,
		getEqpByClass,
		getRepairMans,
		getEqpinfo,
		queryEqpList
	} from '@/https/equip/equipReport.js'
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
	import xuiPdaScan from '@/components/xui-pad-scan/xui-pda-scan.vue'
	import cvTransfer from "@/uni_modules/cv-transfer/components/cv-transfer/cv-transfer.vue"
	// import{ uploadSingleFileCommonUrl } from '@/api/common.js'
	export default {
		components: {
			xuiPdaScan
		},
		data() {
			let isApp = false;
			// #ifdef APP-PLUS
			isApp = true;
			// #endif
			return {
				isApp,
				border: false, //input边框
				deviceShow: false,
				eqpIdNameData: [], //k是id,v是名称[{k:'',v:''}]
				faultShow: false,
				faultData: [],
				classShow: false,
				classList: [],
				repairShow: false,
				showScan: true,
				fileList: [],
				//展示给用户看的form
				showForm: {
					equipName: '',
					faultName: '',
					className: '',
					localImages: [],
					images: '',
					faultNames: [],
					repairMans: '',
					faultDescription: ''
				},
				requestForm: { //上传给后台的form
					equipId: '',
					faultId: '',
					classId: '',
					requestImages: [],
				},
				selectData: [],
				selectValue: [],
				titles: ['可选用户', '已选用户'],
				rules: {
					equipName: [{
						required: true,
						message: '请选择报修设备',
						trigger: ['change', 'blur'],
					}],
					faultNames: [{
						type:'array',
						min: 1,
						message: '请选择故障类型',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur'],
					}],
					localImages: [{
						type: 'array',
						min: 1,
						required: true,
						message: '请上传图片',
						trigger: ['change', 'blur'],
					}],
					repairMans: [{
						required: true,
						message: '请选择维修人',
						trigger: ['change', 'blur'],
					}]
				},
				selectUser: [],
				selectItem: null,
				unSelectUser: [],
				eqpShowData: [],
				allEqpData: [],
				keyWord: null,
				pageNum: 1,
			}
		},
		// 必须要把验证放在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {
			//this.queryEqpClass()
			this.queryEqp();
			this.queryEqpAll();
		},

		onHide() {
			this.showScan = false;
		},
		watch: {
			allEqpData: function(newVal, oldVal) {
				if (this.keyWord) this.eqpShowData = this.allEqpData.filter(item => item.number.indexOf(this.keyWord) >=
					0 || item.name.indexOf(this.keyWord) >= 0)
			},
			keyWord: function(newVal, oldVal) {
				if (newVal) this.eqpShowData = this.allEqpData.filter(item => item.number.indexOf(newVal) >= 0 || item.name
					.indexOf(newVal) >= 0)
				else this.eqpShowData = this.eqpIdNameData
			},
			deviceShow: function(newVal, oldVal) {
				if (!newVal) {
					this.pageNum = 1;
					this.queryEqp();
				}
			}
		},
		methods: {
			onShow() {
				this.faultData = []
				this.eqpIdNameData = []
				getRepairInit().then(res => {
					if (res.data.faultCate.length > 0) {
						this.faultData = res.data.faultCate
						console.log(this.faultData)
					}
				})
			},
			close() {
				this.repairShow = false
				this.faultShow = false
				this.deviceShow = false
				this.classShow = false
			},
			async toStart() {
				var that = this;
				await uni.scanCode({
					success(rs) {
						queryEqpList({
							pg_pagesize: 1000,
							keyWords: rs.result
						}).then(res => {
							if (res.data[0].id === rs.result) {
								that.saveDeviceData(res.data[0])
							}else{
								uni.showToast({
									icon: 'none',
									title: "找到多个设备",
								});
							}
						})

					}
				})
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
				const whiteList = ['jpg', 'png','jepg','jpeg','img','gif']
				var isSuffix = false
				lists.forEach(item =>{
					const fileSuffix = item.name.substring(item.name.lastIndexOf('.') + 1)
					isSuffix = whiteList.indexOf(fileSuffix.toLowerCase()) === -1
				})			 
				if(isSuffix){
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

			queryEqpClass() {
				getEqpClass().then(res => {
					this.classList = res.data
					console.log(this.classList)
				})
			},
			queryEqp() {
				this.keyWord = null
				// console.log("=================")
				queryEqpList({
					pg_pagesize: 20
				}).then(res => {
					// console.log("275行:",res)
					this.eqpIdNameData = res.data
					this.eqpShowData = this.eqpIdNameData
				})
			},
			queryEqpAll() {
				queryEqpList({
					pg_pagesize: 5000,
					keyWords: this.keyWord
				}).then(res => {
					this.allEqpData = res.data
				})
			},
			//选择设备
			saveDeviceData(item) {
				console.log("0");
				// console.log("item.id",item.id);
				this.showForm.equipName = item.name
				this.requestForm.equipId = item.id
				this.showForm.faultName = item.clazzName
				this.showForm.className = item.clazzName
				this.requestForm.faultId = item.clazzId
				this.deviceShow = false
				this.pageNum = 1;
				console.log("1");
				this.queryEqp();
				console.log("2");
				this.queryRepairMans(item.number)
			},
			// 选择故障类型
			saveFaultData(item) {
				this.showForm.faultName = item.v
				this.requestForm.faultId = item.k
				this.faultShow = false
			},
			saveClassData(item) {
				this.showForm.className = item.name
				this.requestForm.classId = item.id
				this.classShow = false
				this.queryEqpByClass(item.id)
			},
			// 提交报修
			submitRepairClick() {
				this.$refs.uForm.validate().then(() => {
					console.log('验证通过');
					var para = {
						repairInfo: {},
						repairPic: [],
						faultCateId: ''
					}
					para.repairInfo = {
						eqpId: this.requestForm.equipId,
						triggerSource: '3',
						triggerTime: '',
						faultDescription: this.showForm.faultDescription
					}
					para.repairPic = this.showForm.localImages //this.requestForm.requestImages
					para.faultCateId = this.showForm.faultNames
					para.repairMan = this.selectValue
					console.log('请求参数', para)
					//报修API
					submitRepair(para).then(res => {
						let title = "设备报修"
						if (res.err_code == 10000) {
							uni.showToast({
								icon: 'none',
								title: title + '成功',
								duration: 1000
							});
							uni.navigateBack();
						} else {
							uni.showToast({
								icon: 'none',
								title: title + '失败',
								duration: 1000
							});
						}
					})
				}).catch(errors => {
					console.log(errors);
				})
			},

			//取消
			cancelClick() {
				uni.navigateBack()
			},

			//上传图片
			takePhoto() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePathsArray = chooseImageRes.tempFilePaths;
						console.log("aaa", tempFilePathsArray)
						this.showForm.localImages = this.showForm.localImages.concat(tempFilePathsArray)
						this.showForm.images = this.showForm.localImages.toString()
						for (let i = 0; i < tempFilePathsArray.length; i++) {
							uploadSingleFileCommonUrl(tempFilePathsArray[i]).then(res => {
								this.requestForm.requestImages.push(res.data.url)
							})
						}
						// console.log("requestImages:==",this.requestForm.requestImages)
						// console.log('图片368',this.showForm.localImages, this.requestForm.requestImages)
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
			queryRepairMans(id) {
				getRepairMans({
					id: id
				}).then(res => {
					this.showForm.repairMans = res.data.selectUser.map(item => {
						return item.showName
					}).join(",");
					this.transferDataInit(res.data.selectUser);
					this.transferDataInit(res.data.unSelectUser);
					this.selectValue = res.data.selectUser.map(item => {
						return item.id;
					})
					this.selectData = res.data.unSelectUser;
					if(res.data.selectUser && res.data.selectUser.length > 0){
						this.selectData.push(res.data.selectUser[0]);
					}
				})
			},
			transferDataInit(data) {
				data.forEach(item => {
					item['checked'] = false;
					item['key'] = item.id;
					item['label'] = item.showName;
				})
			},
			confirmRepairMan() {
				this.showForm.repairMans = this.selectData.filter(item => this.selectValue.includes(item.id)).map(item => {
					return item.label
				}).join(",");
				this.repairShow = false
			},
			handleScanResult(result) {
				// console.log(result)
				getEqpinfo({
					id: result
				}).then(res => {
					console.log(res)
					this.requestForm.equipId = res.data.id
					this.showForm.equipName = res.data.name
					this.showForm.className = res.data.item.clazzName
					this.requestForm.classId = res.data.item.clazzId
				})
			},
			pullDown() {
				if (!this.keyWord) {
					this.pageNum += 1;
					queryEqpList({
						pageNum: this.pageNum,
						keyWords: this.keyWord
					}).then(res => {
						this.eqpIdNameData = [...this.eqpIdNameData, ...res.data];
						this.eqpShowData = this.eqpIdNameData;
					})
				}
			}
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