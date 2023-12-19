<template>
	<view class="content">
		<view class="app-containerR bg-white cc">
			<view class="myform leftMax3RCon">
				<u-form :model="form" ref="uForm" class="bg-white otherRCon">
					<u-form-item label="编号">
						<u-input v-model="form.andonNumber" disabled="" placeholder="无" />
					</u-form-item>
					<u-form-item label="异常名称">
						<u-input v-model="form.abnormalName" disabled="" />
					</u-form-item>
					<u-form-item label="提报人">
						<u-input v-model="form.triggerName" disabled="" />
					</u-form-item>
					<u-form-item label="生产号">
						<u-input v-model="form.productNo" disabled="" />
					</u-form-item>
					<u-form-item label="型号" prop="productModel">
						<u-input v-model="form.productModel" disabled=""></u-input>
					</u-form-item>
					<u-form-item label="项目名称">
						<u-input v-model="form.projectName" disabled="" />
					</u-form-item>
					<u-form-item label="问题描述">
						<u-input type="textarea"  :maxlength="2000" :rows="6" v-model="form.remarks" style="font-size: 15rpx;" disabled/>
					</u-form-item>
					<u-form-item label="触发时间">
						<u-input v-model="form.triggerDate" disabled="" />
					</u-form-item>
					<u-form-item label="影响人数">
						<u-input v-model="form.affectedCount" placeholder="请输入人数" disabled="" />
					</u-form-item>
					<u-form-item label="图片" class="upload-group" prop="picAddrValid" v-show="picShow">
						<u-button class="m-10"   type="primary" @click="clickImg()">查看图片</u-button>
					</u-form-item>
					<u-form-item label="异常预计解决时间" prop="resolutionTime">
						<uni-datetime-picker  ref="datetimePicker" width="120px" type="datetime"
							v-model="form.resolutionTime"></uni-datetime-picker>
					</u-form-item>
					<u-form-item label="处置意见" prop="responseDesc">
						<u-input type="textarea"  :maxlength="2000" :rows="6" v-model="form.responseDesc" value="" placeholder="请输入处置意见" style="font-size: 15rpx;"/>
					</u-form-item>
					<u-form-item label="上传" class="upload-group" prop="picAddrValid">
						<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" accept="image"
							multiple :maxCount="3" :previewFullImage="true"></u-upload>
					</u-form-item>
				</u-form>
				<view class="app-containerR cc">
					<button type="primary" class="uni-btn" @click="submit">解决</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { $message} from '@/utils/common.js'
	// 响应、单条触发问题处理查询、Andon分类查询、异常项查询、转办
	import { andonSolvePost,andonResponsePost, getTriggerHandleList, getCateList, getAbnormalList, andonTransferPost , getPic} from "@/https/andon/andon.js"
	import { mapState, mapMutations } from 'vuex'
	import { getToken, getUserToken, setToken, setUserToken} from '@/utils/auth.js'
	// 上传文件、文件前缀
	import uploadHttp from '@/https/_public/upload';
	import {getFileServerUrl} from '@/utils/config.js'
	export default {
		data() {
			return {
				border: false,
				focus:false,
				tmptoken: '',
				urlPath:'',
				primaryShow:false,
				picShow: false,
				localImages: [], // 本地访问地址
				picAddr: [], // 后台需要地址
				picAddrValid: '', // 作为图片验证
				fileList:[],
				//时间日期选择器
				timeParams: {year: true,month: true,day: true,hour: true,minute: true, second: false},
				timeShow: false,
				form: {
					name: '', // 异常项
					eqpName: '', // 设备名称
					eqpId: '', // 设备id
					opName:'',//工序名称
					opCode:'',
					drawingNo:'',//图号,
					productNo:'',//生产号
					abnormalTag: [], // 标签组
					abnormalTagValid: '', // 作为标签验证
					productId: '', // 产线id
					productName: '', // 产线名称
					workspaceId: '', // 工位id
					workspaceName: '', // 工位名称
					remarks: '',
					guiCode: '',
					projectName: '',
					resolutionTime:'',
				},
				type:0,// 1 快速响应
				form2: {
					abnormalId: '', // 异常项id
					abnormalName: '', // 异常项名称
					responseDesc: '' // 转办描述
				},
				listQuery:{
					pg_pagenum:1, // 每页显示多少条数据，默认为10条 pg_pagenum
					pg_pagesize: 1000, // 查询第几页数据，默认第一页 pg_pagesize
					cateId: ''
				},
				dialogFormVisible: false, // 转办弹窗
				show: false,
				classItems: [], // andon分类集合
				abnormalItem: [], // 异常项集合
				rules: { // 验证
					responseDesc: [
						{
							required: true,
							message: '请输入必填项',
							trigger: ['blur', 'change']
						}
					],
					resolutionTime:[
						{
							required: true,
							message: '请输入必填项',
							trigger: ['blur', 'change']
						}
					]
						
					
				},
				urlPath: '', // 文件前缀
			};
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		computed: mapState(['lgn']),
		methods: {
			// 响应
			submit() {
				this.$refs.uForm.validate().then(valid => {
					if (valid) {
						const date = new Date(this.form.resolutionTime);
						const formattedDate =
							`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
						const req = {
							"tRec":{
								"id":this.form.id,
								"responseDesc": this.form.responseDesc,
								"resolutionTime":formattedDate,
							},
							"picAddr":this.picAddr
						}
						andonSolvePost(req,this.tmptoken).then(response =>{
							if(this.type==1){
								uni.redirectTo({
									url:'./andon_006_problemList',
								})
							$message('提交成功！')
							return
							}else{
								uni.redirectTo({
									url:'./andon_004_responseList',
								})
								$message('提交成功！')
								return
							}
						})
					} else {
							$message('请填写必填项！')
					}
				});
			},
			//关键信息

			// 放大预览图片
			clickImg() {
				var urls = [];
				this.form.imageList.forEach(item=>{
					var url = this.urlPath + item.pictureAddr
					urls.push(url)
				})
				wx.previewImage({
					urls: urls, //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
					current: '', // 当前显示图片的http链接，默认是第一个
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
			},
			getPicList(){
				getPic({triggerId:this.form.id}).then(res=>{
					this.form.imageList=res.data
					this.picShow = this.form.imageList.length==0?false:true
				})
			},
			// 上传图片

			deletePic(event) {
				// value.imageToShow = ''
				this.fileList.splice(event.index, 1)
				this.picAddr.splice(event.index, 1)
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
					
					if(result.status == 200){
						this.picAddr.push(result.data)
						let item = this.fileList[fileListLen]
						this.fileList.splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result
						}))
						
						fileListLen++;
					}else{				
						this.fileList.splice(fileListLen, 1)
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
		},
		onLoad(options) {
			this.type= options.type||0
			this.form = JSON.parse(options.item)
			let triggerName = this.form.triggerName
			this.tmptoken =this.type ? options.tmptoken : getToken()// 快速登录tmptoken有值，否则没值
			getTriggerHandleList({id: this.form.id, tmptoken: this.tmptoken}).then(response =>{
				this.form = response.data
				if(!this.form.productNo){
					this.form.productNo = '未填生产号'
				}
				this.form.keyParameter = JSON.parse(this.form.keyParameter)
				
				this.form.abnormalTag = JSON.parse(this.form.abnormalTag) // 标签
				this.form.responseDesc = '' // 响应描述
				this.form.triggerName = triggerName
			})
			this.getPicList()
			// 文件前缀
			this.urlPath = getFileServerUrl()
			this.form.localImages = []
			console.log(this.form.keyParameter)
		}
	}
</script>

<style lang="scss">
</style>
