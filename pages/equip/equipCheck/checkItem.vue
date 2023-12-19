<template>
	<view class="content">
		<view class="hp app-containerC">
			<view class="app-containerR navbar">
				<view class="titleCls">
					设备名称:{{eqpName}};设备ID:{{eqpId}};
					使用部门:{{usingDepName}};待点检项：
				</view>
				<button class="andonButton" type="primary" size="mini" @click="andonButtonClick">Andon</button>
			</view>
			<view class="app-containerC wp table-zdy">
				<view class="th-group">
					<view class="th">步骤</view>
					<view class="th">点检项类型</view>
					<view class="th">点检名称</view>
					<view class="th">点检内容</view>
					<view class="th">点检值</view>
					<view class="th">单位</view>
					<view class="th">文字记录</view>
					<view class="th">操作</view>
					<view class="th">是否合格</view>
					<view class="th">不合格描述</view>
				</view>
				<view class="td-group" v-for="(item,index) in spotCheckItemSData" :key="item.id">
					<view class="td">{{item.step}}</view>
					<view class="td">
						<view :class="changeClass(item.itemCategory)">
							{{changeType(item.itemCategory)}}
						</view>
					</view>
					<view class="td">{{item.name}}</view>
					<view class="td">{{item.description}}</view>
					<view class="td">
						<u-input input-align="center" :disabled="item.disabled" :placeholder="item.placeholderValue"
							type="text" v-model="item.spotValue"></u-input>
					</view>
					<view class="td">{{item.unit}}</view>
					<view class="td">
						<u-input :height="40" placeholder-style="font-size: 12px;" type="textarea" v-model="item.record"
							v-if="item.needText == 1"></u-input>
					</view>
					<view class="td">
						<view class="btn app-containerC" v-if="item.needPhoto === 1" >
							<u-upload
									:fileList="fileList[index]"
									@afterRead="afterRead($event,item,index)"
									@delete="deletePic($event,item,index)"
									name="1"									
									accept = "image"
									:maxCount="1"
									:previewFullImage="true"
								></u-upload>							
						</view>
					</view>
					<view class="td">
						<radio-group @change="chan($event.detail,item)" v-model="item.isError">
							<radio value="1" :checked="item.isError == 1?true:false">是</radio>
							<radio value="2" :checked="item.isError == 2?true:false">否</radio>
						</radio-group>
					</view>
					<view class="td">
						<u-input :height="40" placeholder-style="font-size: 12px;" type="textarea"
							v-model="item.errorMsg" v-if="item.isError == 2 "></u-input>
					</view>
				</view>
			</view>

			<view class="wp app-containerR cc">
				<button type="success" class="m-20" size="mini" @click="saveData">保存数据</button>
				<button type="primary" class="m-20" size="mini" @click="submitSpotCheckClick">提交</button>
				<button class="m-20" size="mini" @click="cancelClick">取消</button>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getSpotCheckItems,
		spotCheckSubmit,
		keepCheckRec
	} from '@/https/equip/equipCheck.js'
	import { getToken, setToken } from '@/utils/auth.js';
	import uploadHttp from '@/https/_public/upload';
	import {
		$confirm
	} from '@/utils/common.js'
	import {getFileServerUrl} from '@/utils/config.js'
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	export default {
		data() {
			return {
				eqpItem: '',
				eqpId: '', //设备id
				eqpName: '',
				checkId: '', //点检配置表主键id 
				checkName: '',
				recId: '', //生成点检记录表主键id 
				spotCheckItemSData: '', //返回的点检项数据
				// 扫码相关
				scanId: '',
				usingDepName: '',
				scanShow: false,
				focus: false,
				item:{},
				fileList:[],
				rootUrl:'',
				//上传视频
				title: 'chooseVideo',
				sourceTypeIndex: 2,
				sourceType: ['拍摄', '相册', '拍摄或相册'],
				src: '',
				cameraList: [{
						value: 'back',
						name: '后置摄像头',
						checked: 'true'
					},
					{
						value: 'front',
						name: '前置摄像头'
					},
				],
				cameraIndex: 0
			}
		},
		created() {
			this.photoRec = {}
		},
		onLoad: function(option) {
			console.log("进入日常点检")
			this.spotCheckItemSData = []
			//扫描某台设备进行点检，传过来的参数
			// if (option.type == 0) { //专业点检传的参数
			// 	this.eqpItem = JSON.parse(option.eqpItem)
			// 	this.eqpId = this.eqpItem.EQPID || this.eqpItem.eqpId
			// 	this.eqpName = this.eqpItem.EQPNAME || this.eqpItem.eqpName
			// 	this.checkId = this.eqpItem.CHECKID || this.eqpItem.checkId
			// 	this.checkName = this.eqpItem.CHECKNAME || this.eqpItem.checkName
			// 	this.recId = this.eqpItem.RECID || this.eqpItem.recId
			// 	this.usingDepName = this.eqpItem.USINGDEPNAME || this.eqpItem.usingDepName
			// } else { 
			// 	//设备开工点检传的参数
			// 	// console.log("=======================")
				
			// }
			this.eqpItem = JSON.parse(option.eqpItem)
			this.eqpId = this.eqpItem.eqpId
			this.eqpName = this.eqpItem.eqpName
			this.checkId = this.eqpItem.ckOrMtcId
			this.checkName = this.eqpItem.ckOrMtcName
			this.recId = this.eqpItem.recordId
			this.usingDepName = this.eqpItem.USINGDEPNAME || this.eqpItem.usingDepName

			//获取该台设备的所有点检项内容
			const para = {
				eqpId: this.eqpId,
				checkId: this.checkId,
				recId: this.recId,
				pg_pagesize: 100,
				pg_pagenum: 1
			}
			
			getSpotCheckItems(para).then(res => {
				this.recId = res.data.recId
				this.spotCheckItemSData = res.data.item
				console.log(this.spotCheckItemSData)
				this.spotCheckItemSData.forEach(item => {
					//点检类别type、枚举 0：常规检查、是否合格 1：数据检查、填写数据
					//当点检类型为数据检查时，需要输入框输入数据，且不为空，当点检类型为常规检查时，不出现输入框，不填写
					if (item.type == 1) {
						//数据检查
						item.placeholderValue = item.lowerLimit + '|' + item.upperLimit
						item.disabled = false
					} else {
						//常规检查
						item.placeholderValue = '常规检查'
						item.disabled = true
					}
					if(item.imageToShow){
						this.fileList.push([{url: getFileServerUrl()+item.imageToShow}])
					}else{
						this.fileList.push([])
					}
				})
			})
		},
		methods: {
			//提交点检
			submitSpotCheckClick() {
				var canSubmit = true
				var noVideoStep = 0
				var noRecordStep = 0
				this.spotCheckItemSData.forEach(item => {
					if (!item.imageToShow && item.needPhoto === 1) {
						canSubmit = false
						noVideoStep = item.step
					}
					if ((item.record == '' || !item.record) && item.needText === 1) {
						canSubmit = false
						noRecordStep = item.step
					}
				})
				if (canSubmit) {
					//2.判断输入的数据是否在数据范围内
					var spotValueArray = [] //点检值合格数组
					var haveValueArray = [] //数据检查的数组
					this.spotCheckItemSData.forEach(item => {
						if (item.type == 1) { //数据检查
							haveValueArray.push(item)
						}
					})
					this.spotCheckItemSData.forEach(item => {
						if (item.type == 1) { //数据检查
							if (item.lowerLimit && item.upperLimit) {
								if (parseFloat(item.spotValue) >= parseFloat(item.lowerLimit) 
								&& parseFloat(item.spotValue) <= parseFloat(item.upperLimit)) {
									spotValueArray.push(item)
								} else {
									if (item.isError == 2) {
										spotValueArray.push(item)
									} else {
										item.isError = 2
									}
								}
							} else if (!item.lowerLimit && item.upperLimit) {
								if (parseFloat(item.spotValue) <= parseFloat(item.upperLimit)) {
									spotValueArray.push(item)
								} else {
									if (item.isError == 2) {
										spotValueArray.push(item)
									} else {
										item.isError = 2
									}
								}
							} else if (item.lowerLimit && !item.upperLimit) {
								if (parseFloat(item.spotValue) >= parseFloat(item.lowerLimit)) {
									spotValueArray.push(item)
								} else {
									if (item.isError == 2) {
										spotValueArray.push(item)
									} else {
										item.isError = 2
									}
								}
							}
						}
					})
					if (spotValueArray.length == haveValueArray.length) {
						//点检提交
						this.submitConsole()
					} else if (spotValueArray.length > 0) {
						var haveValue = false
						haveValueArray.forEach(haveItem => {
							var step = haveItem.step
							spotValueArray.forEach(item => {
								if (step == item.step) {
									haveVlue = true
									console.log('step一样', step, item.step)
								}
							})
							if (!haveValue) {
								$confirm('第' + haveItem.step + '步输入的点检值不在点检值范围内，且结果为通过，将修改结果为不通过，然后请重新提交！').then(
									res => {
										this.$forceUpdate()
								});
							}
						})
					} else {
						$confirm('点检值不正确，请输入点检值~').then(res => {});
					}
				} else {
					var msg = ''
					if (noRecordStep != 0 && noVideoStep != 0) {
						msg += '第' + noVideoStep + '步未拍摄操作照片!第' + noRecordStep + '步未填写文字说明!请核对~'
					} else if (noRecordStep == 0 && noVideoStep != 0) {
						msg += '第' + noVideoStep + '步未拍摄操作照片!请核对~'
					} else if (noVideoStep == 0 && noRecordStep != 0) {
						msg += '第' + noRecordStep + '步未填写文字说明!请核对~'
					}
					$confirm(msg).then(res => {});
				}
			},
			submitConsole() {
				var itemRecList = []
				this.spotCheckItemSData.forEach(item => {
					itemRecList.push({
						ciId: item.id,
						ciResult: item.isError,
						ciStep: item.step,
						photoPath: item.src,
						ciValue: item.spotValue || '',
						record: item.record,
						isError: item.isError,
						errorMsg: item.errorMsg
					})
				})
				// console.log("itemRecList==:",itemRecList)
				var param = {
					recId: this.recId,
					itemRecList: itemRecList
				}
				spotCheckSubmit(param).then(res => {
					console.log(res)
					uni.navigateBack()
				})
			},
			// 取消
			cancelClick() {
				uni.navigateBack()
			},
			deletePic(event,value,index) {
				value.imageToShow = ''
				this.fileList[index].splice(event.index, 1)
			},
			
			// 新增图片
			async afterRead(event,value,index) {				
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
				let fileListLen = this.fileList[index].length
				lists.map((item) => {
					this.fileList[index].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})				
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					
					if(result.status == 200){
						value.imageToShow = result.data
						let item = this.fileList[index][fileListLen]
						this.fileList[index].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result
						}))
						
						fileListLen++;
						let url = getFileServerUrl()  + result.data;
						console.log(url);
						this.fileList[index] = [{
							url
						}];
					}else{
						
						this.fileList[index].splice(fileListLen, 1)
						uni.showToast({
							title: '上传失败',
							icon: 'none',
							duration: 1000
						});
					}															
				}
			},
			
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					uploadHttp.upload({token: getToken(),filePath: url}).then(response => {
						if (response.code === 200) {
							setTimeout(() => {return resolve( {data:response.data.filePath,status: 200} )}, 150)
						}else 
						{
							return resolve({
							status: 500,
							msg: '上传失败'
							});
						}
					}).catch( ()=>{
						return resolve({
						status: 500,
						msg: '上传失败'
						});
					});
				})
			},
			
			//点击扫码按钮
			scanButtonClick() {
				this.scanShow = true
				setTimeout(() => {
					this.focus = true;
				}, 300);
			},
			// 扫码
			scanNext(e) {
				// console.log('扫码了', e.target.value)
				this.scanId = e.target.value
				this.scanShow = false
				this.chooseOneItemScan()
			},
			//扫描点检项id,到达点检位置
			chooseOneItemScan() {
				this.spotCheckItemSData.forEach(item => {
					if (item.id == this.scanId) {
						item.primary = 'primary' //到达点检位置，就'primary'
					}
				})
				this.scanId = ''
				this.focus = false;
			},

			chan(e, item) {
				//this.spotCheckItemSData[item]
				item.isError = e.value
				console.log(this.spotCheckItemSData);
			},
			//andon触发
			andonButtonClick() {
				var eqpPar = {
					type: 1,
					eqpId: this.eqpItem.eqpId,
					eqpName: this.eqpItem.eqpName,
					checkId: this.eqpItem.checkId,
					checkName: this.eqpItem.checkName,
					recId: this.eqpItem.recId
				}
				getApp().globalData.andonData = eqpPar
				uni.navigateTo({
					//传到Andon的type值:1设备、2生产、3Andon  
					url: `/pages/andon/andon_002_class?cateId=20231218173918310041000013858343&&type=8`
				})
				var dd = getApp().globalData.andonData
				console.log(dd, 'dd')
			},
			//点击图片放大预览
			previewImg(logourl) {
				console.log("logUrl", logourl)
				let _this = this;
				let imgsArray = [];
				imgsArray[0] = logourl
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});
			},

			changeType(itemCategory) {
				if (itemCategory == 0) {
					return '安全部位类'
				} else if (itemCategory == 1) {
					return '核心部位类'
				} else {
					return '其他'
				}
			},
			changeClass(itemCategory) {
				if (itemCategory == 0) {
					return 'color-0'
				} else if (itemCategory == 1) {
					return 'color-1'
				} else {
					return 'color-2'
				}
			},
			saveData() {
				var itemRecList = []
				this.spotCheckItemSData.forEach(item => {
					itemRecList.push({
						ciId: item.id,
						ciResult: item.isError,
						ciStep: item.step,
						photoPath: item.imageToShow,
						ciValue: item.spotValue || '',
						record: item.record,
						isError: item.isError,
						errorMsg: item.errorMsg
					})
				})
				// console.log("spotCheckItemSData==:",this.spotCheckItemSData)
				// console.log("itemRecList==:",itemRecList)
				var param = {
					recId: this.recId,
					itemRecList: itemRecList
				}
				// console.log("param==:",param)
				keepCheckRec(param).then(res => {
					uni.navigateBack()
				})
			}
		}
	}
</script>

<style>
	.spotCheckButtonShow {
		margin: 0;
		height: 35px;
		font-size: 14px;
	}

	.titleCls {
		color: #0081ff;
		font-size: 20px;
		margin-left: 20px;
		margin-top: 15px;
	}

	.scanButton {
		margin-bottom: 10px;
		margin-left: 3px;
		font-size: 12px;
	}

	.andonButton {
		margin-top: 15px;
		margin-right: 20px;
		font-size: 13px;
	}
	.navbar{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.td-relative {
		flex: 1;
		overflow: auto;
		border-top: 1px solid rgb(228, 231, 237);
		border-right: 1px solid rgb(228, 231, 237);
		border-left: 1px solid rgb(228, 231, 237);
		border-bottom: 1px solid rgb(228, 231, 237);
		padding: 5px;
		display: flex;
		align-items: center;
		align-content: center;
		justify-content: center;
		position: relative;
		z-index: 1;
	}

	.video {
		position: relative;
	}

	.img-cover {
		position: absolute;
		width: 30rpx;
		height: 30rpx;
		z-index: 999;
	}

	.color-0 {
		color: #ED1C24;
	}

	.color-1 {
		color: #0055ff;
	}

	.color-2 {
		color: #000000;
	}
</style>