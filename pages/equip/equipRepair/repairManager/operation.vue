<template>
	<view class="content" style="height: 100%;">
		<view class="hp app-containerR" style="justify-content: center;">
			<view class="app-containerC">
				<button type="primary" class="m-20" size="mini" @click="repairStartClick"
					:disabled="whiteStstus.indexOf(status) === -1 ">维修开始</button>
				<button type="primary" class="m-20" size="mini" @click="completeRepair">维修结束</button>
				<button type="primary" class="m-20" size="mini" @click="waitStartClick">等待开始</button>
				<button type="primary" class="m-20" size="mini" @click="waitEndClick">等待结束</button>
<!-- 				<button type="success" class="m-20" size="mini" @click="consumptionClick">消耗备件记录</button>
				<button type="success" class="m-20" size="mini" @click="saveSparePartRecord">保存消耗备件记录</button> -->
			</view>
			<view class="app-containerR bg-white cc">
				<view style="width: 900px;">
					<u-form labelWidth="150px" labelAlign="center" class="myform" :rules="rules" :model="showForm"
						ref="uForm">
						<u-form-item label="维修单号">
							<u-input v-model="orderNum" type="text" disabled=""></u-input>
						</u-form-item>
						<u-form-item label="设备编号">
							<u-input v-model="eqpId" type="text" disabled=""></u-input>
						</u-form-item>
						<u-form-item label="设备名称">
							<u-input v-model="eqpName" type="text" disabled=""></u-input>
						</u-form-item>
						<u-form-item label="状态">
							<u-input v-model="status" type="text" disabled=""></u-input>
						</u-form-item>
						<u-form-item label="维修开始时间">
							<u-input v-model="repStartTime" type="text" disabled=""></u-input>
						</u-form-item>
						<u-form-item label="故障现象及部位">
							<u-input placeholder="请输入故障现象及部位" v-model="locationText" type="text"></u-input>
						</u-form-item>
						<u-form-item label="维修过程分析描述">
							<u-input placeholder="请输入维修过程分析描述" v-model="analysisText" type="text"></u-input>
						</u-form-item>
<!-- 						<u-form-item label="备品备件消耗">
							<view style="width: 100%; margin-right: 10%;">
								<view>
									<button type="success" size="mini" @click="consumptionClick">添加</button>
									<button type="success" class="ml-10" size="mini"
										@click="saveSparePartRecord">保存</button>
								</view>
								<uni-table border stripe>
									<uni-tr>
										<uni-th>备件名称</uni-th>
										<uni-th>备件编码</uni-th>
										<uni-th>使用数量</uni-th>
									</uni-tr>
									<uni-tr v-for="item in selectedPart" :key="item.id">
										<uni-td>{{item.materialName }}</uni-td>
										<uni-td>{{ item.materialCode }}</uni-td>
										<uni-td><input type="number" border v-model="item.usedQuantity"></uni-td>
									</uni-tr>
								</uni-table>
							</view>
						</u-form-item> -->
						<u-form-item label="设备故障类型" prop="faultCateId">
							<u-checkbox-group ref="checkGroup" v-model="showForm.faultCateId">
								<u-checkbox :size="'18px'" :label-size="'14px'" v-for="(item, index) in faultCateData"
									:key="item.k" :label="item.v" :name="item.k"></u-checkbox>
							</u-checkbox-group>
						</u-form-item>
						<u-form-item label="设备故障因素" prop="faultFactorName">
							<u-input placeholder="请选择设备故障因素" v-model="showForm.faultFactorName" type="text"
								disabled=""></u-input>
							<button class="myButonCls" slot="right" type="primary" size="mini"
								@click="faultFactorShow = true">请选择</button>
						</u-form-item>
						<u-form-item label="维修人" prop="repairMans">
							<u-input placeholder="请选择设维修责任人" v-model="showForm.repairMans" type="text"
								:disabled="true"></u-input>
							<button class="myButonCls" slot="right" type="primary" size="mini"
								@click="repairShow = true">请选择</button>
						</u-form-item>
						<u-form-item label="上传图片" class="upload-group" prop="compPic">
							<view v-for="(item,index) in showForm.localImages" :key="index" width="200px" height="200px"
								class="img" @longpress="touchstart(index)" @tap="previewPictures(item)">
								<u-image :src="item" width="200px" height="200px" class="img"></u-image>
							</view>
							<view class="btn app-containerC" @click="takePhoto">
								<u-icon name="plus" size="40"></u-icon>
								<view>选择图片</view>
							</view>
						</u-form-item>

					</u-form>
					<view class="wp app-containerR cc">
						<button type="primary" class="m-20" size="mini" @click="repairSave">保存</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 开始等待 -->
		<u-popup :show="show" :round="10" @close="close" mode="center">
			<view class="popup">
				<u-input width="300px" type="text" v-model="reasonsForWaiting" placeholder="输入等待原因" />
				<text>*点击空白部分返回</text>
				<button type="primary" size="mini" @click="waitStartClick2">等待</button>
			</view>
		</u-popup>

		<!--选择故障因素弹窗-->
		<u-popup mode="bottom" @close="close" :show="faultFactorShow">
			<scroll-view scroll-y="true" style="height: 300rpx;">
				<view class="app-containerC wp table-zdy">
					<view class="th-group">
						<view class="th">故障因素名称</view>
						<view class="th">操作</view>
					</view>
					<view class="td-group" v-for="x in faultFactorData" :key="x.k">
						<view class="td">{{x.v}}</view>
						<view class="td">
							<button size="mini" type="primary" @click="saveFaultFactorData(x)">确认</button>
						</view>
					</view>
				</view>
			</scroll-view>
		</u-popup>
		<u-modal @close="close" :show="repairShow" title="用户选择" :show-cancel-button="true" :show-title="false"
			:confirm-style="{'margin': '-20px','font-size':'20px'}" :closeOnClickOverlay="true"
			:cancel-style="{'margin': '-20px','font-size':'20px'}" style="height: 70%;" @confirm="confirmRepairMan"
			@cancel="close" :mask-close-able="true">
			<cv-transfer v-model="selectValue" :data="selectData" :titles="titles"></cv-transfer>
		</u-modal>

		<!--备件消耗弹窗-->
		<u-popup mode="bottom" @close="close" :show="dialogSparePartVisible" heigth="50%">
			<view class="content xui-reset">
				<view class="popup-btn__wrapper">
					<view>
						<u-input clearable placeholder="备件编码" :height="formItemHeight"
							:custom-style="{'font-size':'14px'}" v-model="partNumber" />
					</view>
					<view>
						<u-input clearable placeholder="备件名称" :height="formItemHeight"
							:custom-style="{'font-size':'14px'}" v-model="partName" />
					</view>
					<button style="margin-left: 5px;margin-right:5px; margin-bottom: 5px;" type="primary" size="mini"
						@click="querySparePartTime">查询
					</button>
					<button class="mgReset" style="margin-left: 5px;margin-right:5px; margin-bottom: 5px;"
						type="primary" size="mini" @click="saveSparePartRecord">保存记录
					</button>
				</view>
				<view style="margin: 5px;">当前已选择：{{usedSparePart}}</view>
				<scroll-view scroll-y="true" style="height:250rpx">
					<uni-table border stripe type="selection" ref="uTableRef" @selection-change="handleChangeSingle">
						<uni-tr>
							<uni-th>备件编码</uni-th>
							<uni-th>备件名称</uni-th>
							<uni-th>数量</uni-th>
							<uni-th>使用数量</uni-th>
						</uni-tr>
						<uni-tr v-for="x in sparePartData" :key="x.id">
							<uni-td>{{ x.materialCode }}</uni-td>
							<uni-td>{{ x.materialName }}</uni-td>
							<uni-td>{{ x.quantity }}</uni-td>
							<uni-td><u-input v-model="x.usedQuantity" placeholder="请输入使用数量" /></uni-td>
						</uni-tr>
					</uni-table>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getDoRepairInit,
		waitSt,
		waitEd,
		repairSubmit,
		repairSt,
		repairSave
	} from '@/https/equip/equipRepair.js'
	import {
		sparePartList,
		sparePartUse,
		sparePartUseRecord
	} from '@/https/equip/equipMaintenance.js'
	import {
		getRepairMans
	} from '@/https/equip/equipReport.js'
	import {
		uploadSingleFileCommonUrl
	} from '@/https/_public/common.js'
	import cvTransfer from "@/uni_modules/cv-transfer/components/cv-transfer/cv-transfer.vue"
	export default {
		data() {
			return {
				border: false,
				reasonsForWaiting: '',
				show: false,
				repairmgtId: '', //传过来的设备维修单id
				eqpName: '', //设备名称
				repStartTime: '', //维修开始时间
				orderNum: '', //维修单号
				status: '', //状态
				eqpId: '', //设备编号
				faultCateData: [], //故障类别:k是id,v是名称{k:'',v:''}
				faultCateShow: false,
				faultFactorData: [], //故障因素：k是id,v是名称
				faultFactorShow: false,
				locationText: '',
				analysisText: '',
				//展示给用户看的form
				showForm: {
					faultCateId: [],
					faultFactorName: '',
					localImages: [],
					images: '',
					repairMans: ''
				},
				requestForm: { //上传给后台的form
					faultFactorId: '',
					requestImages: [],
				},
				repairShow: false,
				selectData: [],
				selectValue: [],
				titles: ['可选用户', '已选用户'],
				whiteStstus: ['响应检测中', '可继续使用、待二次维修'],
				rules: {
					faultCateId: [{
						type: 'array',
						min: 1,
						required: true,
						message: '请选择故障类型',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur'],
					}],
					faultFactorName: [{
						required: true,
						message: '请选择设备故障因素',
						trigger: ['change', 'blur'],
					}],
					images: [{
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
				dialogSparePartVisible: false,
				formItemHeight: 24,
				partNumber: null,
				partName: null,
				sparePartData: [],
				selectedAll: false,
				usedSparePart: '',
				selectedPart: [],
				timer: null,
				repairMan: []
			}
		},
		components: {
			cvTransfer,
		},
		// 必须要把验证放在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad: function(option) {
			// console.log(option);
			this.faultCateData = []
			this.faultFactorData = []
			this.repairmgtId = option.repairId
			this.rePairInit();

		},
		methods: {
			rePairInit() {
				//维修操作界面初始化
				getDoRepairInit({
					id: this.repairmgtId
				}).then(res => {

					this.repStartTime = res.data.repStartTime
					this.eqpName = res.data.eqpName
					this.orderNum = res.data.orderNum
					// this.
					this.status = res.data.status
					this.eqpId = res.data.eqpId
					this.locationText = res.data.repairInfo.phenomenon
					this.analysisText = res.data.repairInfo.analysisDesc
					let faultCateId = [];
					res.data.faultCate.forEach(item => {
						if (res.data.repairInfo.faultCateId.indexOf(item.k) >= 0) {
							item['checked'] = true;
							faultCateId.push(item.k);
						} else item['checked'] = false;
					})

					if (res.data.faultCate.length > 0) {
						this.faultCateData = res.data.faultCate
					}

					if (res.data.faultFactor.length > 0) {
						this.faultFactorData = res.data.faultFactor
					}
					this.showForm.faultCateId = faultCateId;
					this.showForm.faultFactorName = res.data.repairInfo.faultFactorName
					this.requestForm.faultFactorId = res.data.repairInfo.faultFactorId
					this.queryRepairMans(res.data.eqpId, this.repairmgtId)
					this.querySparePart()
				})
			},
			// 选择故障因素
			saveFaultFactorData(item) {
				this.showForm.faultFactorName = item.v
				this.requestForm.faultFactorId = item.k
				this.faultFactorShow = false
			},
			close() {
				this.dialogSparePartVisible = false
				this.repairShow = false
				this.faultCateShow = false
				this.faultFactorShow = false
				this.show = false
			},
			// 待件开始
			waitStartClick() {
				this.show = true
				return
			},
			waitStartClick2() {
				waitSt({
					repairmgtId: this.repairmgtId,
					waitReason: this.reasonsForWaiting
				}).then(res => {
					// console.log('待件开始',res)
					uni.showToast({
						title: '待件开始',
						success() {
							uni.navigateBack()
						}
					})
				})
			},
			// 待件结束
			waitEndClick() {
				waitEd({
					id: this.repairmgtId
				}).then(res => {
					// console.log('待件结束',res)
					uni.showToast({
						icon: 'none',
						title: '待件结束'
					})
				})
			},
			// 维修完成
			completeRepair() {
				this.$refs.uForm.validate().then(() => {
					var param = {
						repSubmitInfo: {
							id: this.repairmgtId,
							analysisDesc: this.analysisText,
							phenomenon: this.locationText
						},
						cateId: this.showForm.faultCateId,
						factorId: this.requestForm.faultFactorId,
						compPic: this.requestForm.requestImages
					}
					repairSubmit(param).then(res => {
						if (res.err_code == 10000) {
							uni.showToast({
								icon: 'none',
								title: '维修结束',
								duration: 1000
							});
							uni.navigateBack();
						} else {
							uni.showToast({
								icon: 'none',
								title: res.err_msg,
								duration: 1000
							});
						}
					})
				}).catch(errors => {
					console.log(errors);
					uni.$u.toast('校验失败')
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
						this.requestForm.requestImages = this.showForm.localImages
						// for (let i = 0; i < tempFilePathsArray.length; i++) {
						// 	this.requestForm.requestImages.push(tempFilePathsArray[i])
						// }
						// console.log('图片',this.showForm.localImages, this.requestForm.requestImages)
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
			queryRepairMans(id, repairmgtId) {
				console.log(repairmgtId);
				getRepairMans({
					id: id,
					repId: repairmgtId
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
					this.selectData.push(res.data.selectUser[0]);
				})
			},
			confirmRepairMan() {
				this.showForm.repairMans = this.selectData.filter(item => this.selectValue.includes(item.id)).map(item => {
					return item.label
				}).join(",");
				let chosedMan = this.selectData.filter(item => this.selectValue.includes(item.id))
				this.repairMan = []
				chosedMan.forEach(item => {
					this.repairMan.push(item.id)
				})
			},
			transferDataInit(data) {
				data.forEach(item => {
					item['checked'] = false;
					item['key'] = item.id;
					item['label'] = item.showName;
				})
			},
			repairStartClick() {
				repairSt({
					id: this.repairmgtId
				}).then(res => {
					let that = this;
					uni.showToast({
						icon: 'none',
						title: '开始维修',
						success() {
							that.faultCateData = []
							that.faultFactorData = []
							that.rePairInit();
						}
					})
				})
			},
			repairSave() {
				let data = {
					repSubmitInfo: {
						id: this.repairmgtId,
						analysisDesc: this.analysisText,
						phenomenon: this.locationText
					},
					cateId: this.showForm.faultCateId,
					factorId: this.requestForm.faultFactorId,
					compPic: this.requestForm.requestImages,
					repairMan: this.repairMan
				}
				repairSave(data).then(res => {
					this.rePairInit();
					
					uni.showToast({
						icon: 'none',
						title: '保存成功'
					})
					uni.navigateBack()
				})
			},
			consumptionClick() {
				this.dialogSparePartVisible = true
				this.querySparePart()
			},
			querySparePartTime() {
				if (this.timer) {
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(() => {
					this.querySparePart();
				}, 800)
			},
			querySparePart() {
				sparePartList({
					materialCode: this.partNumber,
					materialName: this.partName,
					pageSize: 1000,
					pageNum: 1
				}).then(res => {
					this.sparePartData = res.data
					sparePartUseRecord({
						orderNum: this.orderNum
					}).then(res => {
						this.sparePartData.forEach(item => {
							let isSelected = false
							let usedQuantity = null
							this.selectedPart.forEach(selected => {
								if (item.id === selected.spId) {
									isSelected = selected.checked
									usedQuantity = selected.quantity
								}
							})
							item.checked = isSelected
							item.usedQuantity = usedQuantity
						})
						if (res.data) {
							let list = res.data
							console.log(res.data);
							list.forEach(item => {
								this.sparePartData.forEach(data => {
									if (item.materialCode == data
										.materialCode) {
										console.log(data);
										data.checked = true
										data.usedQuantity = item.quantity
										this.checkedPart(data)
									}
								})
							})
						}
					})

				})

			},
			//全选操作
			handleChangeAll(params) {
				this.usedSparePart = ''
				this.sparePartData.forEach(item => {
					item.checked = params.value;
					this.checkedPart(item)
				})
				this.selectedPart.forEach(item => {
					this.usedSparePart = this.usedSparePart + item.materialName + "(" + item.quantity + ");"
				})
			},
			handleChangeSingle(params) {
				console.log(params);
				this.selectedPart = [];
				var index = params.detail.index
				index.forEach(i => {
					this.selectedPart.push(this.sparePartData[i])
				})
			},
			checkedPart(item) {
				let isSelected = false
				this.selectedPart.map((selected, i) => {
					if (item.id === selected.spId) {
						if (item.checked) {
							isSelected = true
						} else {
							this.selectedPart.splice(i, 1)
						}
					}
				})
				if (!isSelected && item.checked) {
					this.selectedPart.push({
						spId: item.id,
						checked: item.checked,
						materialCode: item.materialCode,
						materialName: item.materialName,
						usedQuantity: item.usedQuantity,
						usedId: this.repairmgtId,
						usedFrom: 1
					})
				}
			},
			saveSparePartRecord() {
				let selectedPart = [];
				let index = this.$refs.uTableRef.backIndexData;
				index.forEach(i => {
					let item = this.sparePartData[i];
					selectedPart.push({
						spId: item.id,
						checked: item.checked,
						materialCode: item.materialCode,
						materialName: item.materialName,
						usedQuantity: item.usedQuantity,
						usedId: this.repairmgtId,
						usedFrom: 1
					})
				})
				this.selectedPart = selectedPart;
				let isNullQuantity = false
				for (let item of this.selectedPart) {
					if (item.quantity == null || item.quantity === 0 || item.quantity == "") {
						uni.showToast({
							icon: 'none',
							title: "未输入消耗数量！"

						});
						isNullQuantity = true
						return;
					}
				}
				if (!isNullQuantity) {
					sparePartUse({
						usedSparePart: this.selectedPart,
						orderNo: this.orderNum
					}).then(res => {
						if (res.err_code == 10000) {
							this.dialogSparePartVisible = false
						} else {
							uni.showToast({
								icon: 'none',
								title: res.err_msg,
								duration: 1000
							});
						}
					})
				}
			},
			touchstart(index) {
				let that = this
				uni.showModal({
					title: '删除',
					content: '请问要删除本条消息吗？',
					success: function(res) {
						if (res.confirm) {
							that.requestForm.requestImages.splice(index, 1)
							that.showForm.localImages.splice(index, 1)
							uni.showToast({
								icon: 'none',
								title: '删除成功',
								duration: 2000
							})
						} else if (res.cancel) {
							uni.showToast({
								icon: 'none',
								title: '取消成功',
								duration: 2000
							})
						}
					}
				});
			},



		},
	}
</script>


<style>
	.titleCls {
		color: #0081ff;
		font-size: 15px;
		margin-left: 20px;
	}

	.u-form-item .u-input {
		margin-right: 10%;
	}

	.u-checkbox {
		margin-right: 20%;
	}

	.popup {
		display: flex !important;
		flex-direction: column !important;
		width: 300px;
		padding: 10%;
	}

	.myButonCls {
		margin-right: 20px;
	}
</style>