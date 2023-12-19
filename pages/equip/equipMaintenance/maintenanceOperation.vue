<template>
	<view class="content">
		<view class="app-containerR navbar">
			<view class="titleCls">
				设备名称:{{deviceItem.eqpName}};
				设备ID:{{deviceItem.eqpId}};
				使用部门:{{deviceItem.usingDepName}};待点检项：
			</view>
			<button class="andonButton" type="primary" size="mini" @click="andonButtonClick">Andon</button>
		</view>
		
		<view class="app-containerC wp table-zdy">
		       <view class="th-group">
					<view class="th">步骤</view>
					<view class="th">保养项名称</view>
					<view class="th">保养描述</view>
					<!-- <view class="th">保养图示</view> -->
					<view class="th">保养记录</view>
					<view class="th">操作</view>
					<!-- <view class="th">拍摄照片</view> -->
		       </view>
		       <view class="td-group" v-for="(item,index) in maintenanceItemSData" :key="index">
					<view class="td">{{item.step}}</view>
					<view class="td">{{item.name}}</view>
					<view class="td">{{item.description}}</view>
					<!-- <view class="td">
						<image class="wp hp" :src="item.illId" @click="previewImg(item.illId)"></image>
					</view> -->
					<view class="td">
						<u-input input-align="center" :height="40" 
						placeholder-style="font-size: 12px;" type="textarea" 
						v-model="item.record" 
						v-if="item.needText === 1"></u-input>
					</view>
					<view class="td" >
						<view class="btn app-containerC" v-if="item.needPhoto === 1" >
							<u-upload v-if="item.needPhoto === 1"
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
<!-- 					<view class="td">
						<image class="wp hp" :src="item.imageToShow" @click="previewImg(item.imageToShow)"></image>
					</view> -->
		       </view>
<!-- 			   <view class="th-group">
					<view class="th">
						备件名称
					</view>
					<view class="th">
						备件编码
					</view>
					<view class="th">
						使用数量
					</view>
					<view class="th">
						库存数量
					</view>
			   </view>
			   <view class="td-group" v-for="item in selectedPart" :key="item.id">
					<view class="td">{{item.materialName}}</view>
					<view class="td">{{item.materialCode}}</view>
					<view class="td"><input type="number" v-model="item.quantity"></view>
					<view class="td">{{item.reQuantity}}</view>
			   </view> -->
		</view>
		
		<!--备件消耗弹窗-->
		<u-popup mode="bottom"  :show="dialogSparePartVisible" heigth="50%">
			<view class="content xui-reset">
				<view class="popup-btn__wrapper">
					<view style="margin-left: 10rpx;margin-bottom: 5rpx;font-size: 9rpx;">
						<u-input border clearable placeholder="备件编码" style="margin-left: 20rpx;"
						:height="formItemHeight" :custom-style="{'font-size':'9rpx'}" v-model="partNumber" @input="querySparePartTime()" />
					</view>
					<view style="margin-left: 10rpx;margin-bottom: 5rpx;font-size: 9rpx;">
						<u-input border clearable placeholder="备件名称" style="margin-left: 20rpx;"
						:height="formItemHeight" :custom-style="{'font-size':'9rpx'}" v-model="partName" @input="querySparePartTime()" />
					</view>
					<button class="mgReset" style="margin-bottom: 5px;" type="primary" @click="saveSparePartRecord">保存记录
					</button>
				</view>
				<scroll-view scroll-y="true" style="height:250rpx">
					<view class="app-containerC wp table-zdy mini-table">
						<view class="th-group">
							<view class="th">备件编码</view>
							<view class="th">备件名称</view>
							<view class="th">数量</view>
							<view class="th" style="justify-content:left">
								<u-checkbox 
									style="font-size: 16px;margin-left: 15%;" 
									@change="handleChangeAll"
									v-model="selectedAll">使用数量</u-checkbox>
							</view>
						</view>
						<view class="td-group reset-btn-class" v-for="x in sparePartData" :key="x.id">
							<view class="td">{{ x.materialCode }}</view>
							<view class="td">{{ x.materialName }}</view>
							<view class="td">{{ x.quantity }}</view>
							<view class="td" style="justify-content:left">
								<u-checkbox @change="handleChangeSingle(x)" v-model="x.checked" style="margin-left: 15%;"></u-checkbox>
								<u-input v-model="x.usedQuantity" placeholder="请输入使用数量"/>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		
		<view class="wp app-containerR cc">
<!-- 			<button type="success" class="m-20" size="mini" @click="consumptionClick">选择消耗备件</button>
			<button type="success" class="m-20" size="mini" @click="saveSparePartRecord">保存备件消耗记录</button> -->
			<button type="primary" class="m-20" size="mini" @click="keepMaintanceClick">保存数据</button>
			<button type="primary" class="m-20" size="mini" @click="submitMaintanceClick">保养完成</button>
			<button class="m-20" size="mini" @click="cancelClick">取消</button>
		</view >
	</view>
	
	
	
</template>

<script>
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	import { getDeviceMaintenceItems, maintenceSubmit,keepMaintenceRec,sparePartList,sparePartUse,sparePartUseRecord} from '@/https/equip/equipMaintenance.js'	
	import {getFileServerUrl} from '@/utils/config.js'
	import { getToken, setToken } from '@/utils/auth.js';
	import { $confirm } from '@/utils/common.js'
	import uploadHttp from '@/https/_public/upload';
	export default {
		data() {
			return {
				maintenanceItemSData:'',  //所有保养项内容
				mtcDspId:'', //保养单主键id，提交保养单的时候传给后台
				deviceItem:{}, //上个页面传过来的数据
				//上传视频
				title: 'chooseVideo',
				sourceTypeIndex: 2,
				fileList:[],
				cameraIndex: 0,
				dialogSparePartVisible:false,
				formItemHeight: 24,
				partNumber:null,
				partName:null,
				sparePartData:[],
				selectedAll:false,
				usedSparePart:'',
				selectedPart:[],
				timer:null,
			};
		},
		onLoad:function(option){
			this.maintenanceItemSData = []
			//点击某台设备进行保养，传过来的参数
			let item = JSON.parse(option.deviceItem)
			console.log(item);
			this.deviceItem.mtcId = item.ckOrMtcId
			this.deviceItem.eqpId = item.eqpId
			this.deviceItem.eqpName = item.eqpName
			this.deviceItem.usingDepName = item.usingDepName
			this.deviceItem.mtcDspId = item.recordId
			// console.log('para',this.deviceItem)
			//获取该台设备的所有保养项内容
			getDeviceMaintenceItems(this.deviceItem).then(res=>{
				this.maintenanceItemSData = res.data.items
				this.mtcDspId = res.data.mtcDspId
				this.maintenanceItemSData.forEach(item=>{
					item.illId = getFileServerUrl()+item.illId				
					item.imageToShow = item.photoPath
					if(item.imageToShow){
						this.fileList.push([{url: getFileServerUrl()+item.imageToShow}])
					}else{
						this.fileList.push([])
					}
				})
				console.log('保养项数据',res,this.maintenanceItemSData)
				// this.querySparePart()
			})
		},
		methods:{
			//暂存保养记录
			keepMaintanceClick(){
				var itemRecList = []
				this.maintenanceItemSData.forEach(item=>{
					itemRecList.push({miId:item.id, record:item.record || '',step:item.step,photoPath:item.imageToShow})
				})
				var param = {
					mtcDspId:this.mtcDspId,
					itemRecList:itemRecList
				}
				console.log('param', param)
				keepMaintenceRec(param).then(res=>{
						console.log(res)
						uni.navigateBack()
					})
			},
			//提交保养
			submitMaintanceClick(){
				var itemRecList = []
				var canSubmit = true
				var noVideoStep = 0
				var noRecordStep = 0
				this.maintenanceItemSData.forEach(item=>{
					if( !item.imageToShow && item.needPhoto === 1){					
						canSubmit = false
						noVideoStep = item.step
					}
					if((item.record =='' || !item.record) && item.needText === 1){
						canSubmit = false
						noRecordStep = item.step
					}
					itemRecList.push({miId:item.id, record:item.record || '',step:item.step,photoPath:item.imageToShow})
				})
				var param = {
					mtcDspId:this.mtcDspId,
					itemRecList:itemRecList
				}
				// console.log('param', param)
				if(canSubmit == true){
					maintenceSubmit(param).then(res=>{
						console.log(res)
						uni.navigateBack()
					})
				}else{
					var msg = ''
					if(noRecordStep != 0 && noVideoStep != 0){
						msg += '第'+noVideoStep+'步未拍摄操作照片!第'+noRecordStep+'步未填写文字说明!请核对~'	
					}else if(noRecordStep == 0 && noVideoStep != 0){
						msg += '第'+noVideoStep+'步未拍摄操作照片!请核对~'
					}else if(noVideoStep == 0 && noRecordStep != 0){
						msg += '第'+noRecordStep+'步未填写文字说明!请核对~'
					}
					console.log(msg)
					$confirm(msg).then(res =>{});	
				}
			},
			// 取消
			cancelClick(){
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
						} else {
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
			
			
			consumptionClick(){
				this.dialogSparePartVisible = true
				this.querySparePart()
			},
			querySparePartTime(){
				if(this.timer){
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(()=>{
					this.querySparePart();
				}, 800)
			},
			querySparePart(){
				console.log("start");
				sparePartList({materialCode:this.partNumber,materialName:this.partName,pageSize:1000,pageNum:1}).then(res=>{
					this.sparePartData = res.data
					this.sparePartData.forEach(item=>{
						let isSelected = false
						let usedQuantity = null
						this.selectedPart.forEach(selected=>{
							if(item.id === selected.spId){
								isSelected = selected.checked
								usedQuantity = selected.quantity
							}
						})
						item.checked = isSelected
						item.usedQuantity = usedQuantity
					})
					sparePartUseRecord({orderNum: this.mtcDspId }).then(res =>{
						if(res.data){
							let list = res.data
							console.log(res.data);
							list.forEach(item =>{
								this.sparePartData.forEach(data =>{
									if(item.materialCode == data.materialCode){
										console.log(data);
										data.checked=true
										data.usedQuantity=item.quantity
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
				this.selectedPart.forEach(item=>{
					this.usedSparePart = this.usedSparePart + item.materialName + "("+item.quantity+");"
				})
			},
			handleChangeSingle(params) {
				this.$nextTick(() => {
					let isNotAllSelected = false;
					this.sparePartData.some(item => {
						if (!item.checked) {
							isNotAllSelected = true;
							return true;
						} else {
							return false;
						}
					})
					this.selectedAll = !isNotAllSelected;
					this.sparePartData.forEach(item => {
						this.checkedPart(item)
					})
				})
			},
			checkedPart(item){
				let isSelected = false
				this.selectedPart.map((selected,i)=>{
					if(item.id === selected.spId){
						if(item.checked){
							isSelected = true
						}else{
							this.selectedPart.splice(i,1)
						}
					}
				})
				if(!isSelected && item.checked){
					this.selectedPart.push({spId:item.id,checked:item.checked,materialCode:item.materialCode,materialName:item.materialName,reQuantity:item.quantity,quantity:item.usedQuantity,usedId:this.mtcDspId,usedFrom:0})
				}
			},
			saveSparePartRecord(){
				let isNullQuantity = false
				this.sparePartData.forEach(item => {
					this.checkedPart(item)
				})
				this.selectedPart.forEach(item=>{
					if(item.quantity == null || item.quantity === 0 || item.quantity == ""){
						uni.showToast({
							title:"未输入消耗数量！"
							
						});
						isNullQuantity = true
						return;
					}
				});

				if(!isNullQuantity){
					sparePartUse({usedSparePart:this.selectedPart,orderNo:this.mtcDspId}).then(res=>{
						if(res.err_code == 10000){
							this.dialogSparePartVisible = false
						}else{
							uni.showToast({
								icon: 'error',
								title: res.err_msg,
								duration: 1000
							});
						}
					})
				}
			}
		},
	}
</script>

<style>
	.titleCls {
		color: #0081ff;
		font-size: 20px;
		margin-left: 20px;
		margin-top: 15px;
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
</style>
