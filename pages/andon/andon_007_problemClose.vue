<template>
	<view class="content">
		<view class="app-containerR bg-white cc">
			<view class="leftMax3RCon">
				<u-form :model="form" class="bg-white otherRCon">
					<u-form-item label="异常名称">
						<u-input v-model="form.abnormalName" disabled="" />
					</u-form-item>
					<u-form-item label="生产号">
						<u-input v-model="form.productNo" disabled="" placeholder="无生产号信息!"/>
					</u-form-item>
					<u-form-item label="型号" prop="productModel">
						<u-input v-model="form.productModel" disabled="" placeholder="无型号信息!" />
					</u-form-item>
					<u-form-item label="项目名称" prop="projectName">
						<u-input v-model="form.projectName" disabled="" placeholder="无项目名称信息!" />
					</u-form-item>
					<u-form-item label="异常描述">
						<u-input type="textarea"  :maxlength="2000" :rows="6" v-model="form.remarks" disabled="" placeholder="无备注信息!"/>
					</u-form-item>
					<u-form-item label="触发时间">
						<u-input v-model="form.triggerDate" disabled="" />
					</u-form-item>
					<u-form-item v-show="primaryShow&&item.name!=''" v-for="(item,index) of form.keyParameter" :label="item.objName">
						<u-input v-model="item.name" placeholder="暂无内容" disabled="" />
					</u-form-item>
					<u-form-item label="响应描述" v-if="form.status == 3">
						<u-input type="textarea"  :maxlength="2000" :rows="6" v-model="form.responseDesc" disabled="" placeholder="暂无内容" />
					</u-form-item>
					<u-form-item label="提报图片" class="upload-group" prop="picAddrValid" v-show="picShow">
						<u-button class="m-10"  type="primary" @click="clickImg(1)">查看图片</u-button>
					</u-form-item>
					<u-form-item label="解决图片" class="upload-group" prop="picAddrValid" v-show="solvepicShow">
						<u-button class="m-10"  type="primary" @click="clickImg(2)">查看图片</u-button>
					</u-form-item>
				</u-form>
				<view class="app-containerR cc">
					<button type="primary" class="btn" v-if="form.status == 3" @click="transfer()">转办</button>
					<button type="primary" class="btn" v-if="form.status == 1 || form.status == 0" @click="up()">手动升级</button>
					<button type="primary" class="btn"  @click="close">关闭异常</button>
				</view>
			</view>

		</view>

		<!--我是响应人弹窗-->
		<u-popup mode="bottom"  :show="dialogFormVisible">
			<view class="content">
				<view class="bt-white-bom p-10">
					快速响应
					<u-icon class="fr" name="close" @click="closeBtn"></u-icon>
				</view>
				<scroll-view scroll-y="true" class="p-10" style="height: 300rpx;">
					<u-form :model="form2" ref="uForm" class="bg-white otherRCon">
						<u-form-item label="账户名称">
							<u-input v-model="form2.lgnName" placeholder="请输入账户名称" />
						</u-form-item>
						<u-form-item label="账户密码">
							<u-input v-model="form2.lgnPwd"  placeholder="请选择账户密码" type="password"></u-input>
						</u-form-item>
					</u-form>
				</scroll-view>
				<view class="app-containerR cc bt-white">
					<u-button class="m-10"  type="primary" @click="submitComplaint">快速登录</u-button>
				</view>
			</view>
		</u-popup>
		
		<!-- 快速关闭弹窗 2021-06-15肖总要求关闭此按钮功能-->
		<!-- <u-popup mode="bottom" v-model="closeFlag">
			<view class="content">
				<view class="bt-white-bom p-10">
					快速关闭
					<u-icon class="fr" name="close" @click="closeBtn"></u-icon>
				</view>
				<view>
					<u-input v-model="responseDesc" placeholder="请输入响应描述" />
				</view>
				<view class="app-containerR cc bt-white">
					<u-button class="m-10"  type="primary" @click="close">快速关闭</u-button>
				</view>
			</view>
		</u-popup> -->

		<!-- 刷卡弹窗 -->
		<view>
			<u-popup v-model="show" mode="center" closeable border-radius="10">
				<view class="m-30">
					<input style="font-size: 25px;" type="text" value="请刷卡!" disabled="" />
				</view>
			</u-popup>
		</view>
		
		<!--转办弹窗-->
		<u-popup mode="bottom" :show="transferShow">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<u-form :model="form3" ref="uForm2" class="bg-white otherRCon">
						<u-form-item label="转办描述" prop="responseDesc">
							<u-input v-model="form3.responseDesc" placeholder="请输入转办描述" />
						</u-form-item>
						<!-- u-form-item label="异常项" prop="abnormalName">
							<u-input  placeholder="请选择异常项" v-model="form3.abnormalName" type="text" disabled=""></u-input>
							<u-button slot="right" type="primary"  @click="selectAbnorma">请选择</u-button>
						</u-form-item> -->
					</u-form>
				</scroll-view>
				<view class="app-containerR cc bt-white">
					<u-button class="m-10"  type="primary" @click="submitComplaint">保存</u-button>
					<u-button class="m-10"  @click="closeBtn">取消</u-button>
				</view>
			</view>
		</u-popup>
		
		<!-- <u-modal v-model="show">
			<view>
				<view class="app-containerR app-containerWrap">
					<view class="group-warter w-240 tc text bg-blue" v-for="(item,index) of classItems" 
					@click="tap(item)" :key="item.id" @tap="onNext(item)">
						<view class="group-title">{{item.cateName}}</view>
						<view class="group-bomtitle tc" v-if="item.sub && item.sub.length > 0">(分类--有下级)</view>
						<view class="group-bomtitle tc" v-else>(分类--无下级)</view>
					</view>
				</view>
				
				<view class="app-containerR app-containerWrap">
					<view class="group-warter w-240 tc text bg-orange" v-for="(item,index) of abnormalItem" 
					@click="tap(item)" :key="item.id" @tap="onTrigger(item)">
						<view class="group-title">{{item.abnormalName}}</view>
						<view class="group-bomtitle bt-orange tc" style="font-size:10upx" v-for="(responder, indes) of item.responders" :key="responder.id">
						{{responder.name}}</view>
						<view class="group-bomtitle bt-orange tc">(异常项)</view>
					</view>
				</view> 
			</view>
		</u-modal> -->
	</view>
</template>

<script>
	import {
		$message
	} from '@/utils/common.js'
	import {
		login
	} from '@/https/sys/login'
	// 单条触发问题处理信息、andon关闭
	import {
		getTriggerHandleList,
		andonTriggerClosePost,
		getPic,
		getCateList,
		getAbnormalList,
		andonTransferPost,
		andonRejectPost,
		getSolvePic,
		upLevel
	} from "@/https/andon/andon.js"
	import {getFileServerUrl} from '@/utils/config.js'
	export default {
		data() {
			return {
				border: false,
				dataList: {},
				primaryShow: false,
				picShow:false,
				urlPath:'', // 图片前缀
				form: {
					keyParameter: ''
				},
				form2: {
					lgnName: '', //用户名
					lgnPwd: '', // 密码
					tmp: 1
				},
				dialogFormVisible: false, // 我是响应人
				closeFlag: false, // 快速关闭
				rules: { // 验证
					lgnName: [{
						required: true,
						message: '请输入必填项',
						trigger: ['blur', 'change']
					}],
					lgnPwd: [{
						required: true,
						message: '请输入必填项',
						trigger: ['blur', 'change']
					}]
				},
				show: false,
				UID: '',
				responseDesc: '',
				transferShow: false,
				form3: {
					abnormalId: '', // 异常项id
					abnormalName: '', // 异常项名称
					responseDesc: '' // 转办描述
				},
				classItems: [], // andon分类集合
				abnormalItem: [], // 异常项集合
				listQuery:{
					pg_pagenum:1, // 每页显示多少条数据，默认为10条 pg_pagenum
					pg_pagesize: 1000, // 查询第几页数据，默认第一页 pg_pagesize
					cateId: ''
				},
				solvepicShow: false,
			};
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			// this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// andon关闭
			close() {
				console.log(this.form);
				andonTriggerClosePost({
					id: this.form.id,
					responseDesc: this.responseDesc
				}).then(response => {
					uni.redirectTo({
						url: './andon_006_problemList',
					})
					$message('关闭成功！')
				})
			},
			//获取图片
			getPicList(){
				getPic({triggerId:this.dataList.id}).then(res=>{
					this.dataList.localImages=res.data
					this.picShow= this.dataList.localImages.length==0?false:true
				})
				getSolvePic({triggerId:this.dataList.id}).then(res=>{
					this.dataList.solveImages=res.data
					this.solvepicShow= this.dataList.solveImages.length==0?false:true
				})
			},
			// 放大预览图片
			clickImg(item) {
				var urls = [];
				var imageList = [];
				if(item == 1){/** 查看触发提交的图片*/
					imageList = this.dataList.localImages
				}else if(item == 2){/** 查看解决提交的图片*/
					imageList = this.dataList.solveImages
				}
				imageList.forEach(item=>{
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

			// 关闭弹窗
			closeBtn() {
				this.dialogFormVisible = false
				this.closeFlag = false
				this.transferShow = false
			},
			// 我是响应人
			submit() {
				this.dialogFormVisible = true
			},
			// 快速登录
			submitComplaint() {
				if (this.form2.lgnName == '' || this.form2.lgnPwd == '') {
					$message('用户名密码不能为空！')
					return false
				}
				login(this.form2).then(res => {
					uni.redirectTo({
						url: '/pages/andon/andon_005_response?item=' + JSON.stringify(this.form) + '&tmptoken=' + res.data.token +'&type=1'
					});
				})
			},
			quickClose(){
				this.closeFlag = true
			},
			transfer(){
				this.transferShow = true
			},
			// 选择转办
			selectAbnorma() {
				this.onQuery()
				this.show = true
			},
			onQuery() {
				// 查询andon分类
				getCateList().then(res => {
					this.classItems = res.data
				})
			},
			onNext(item) {
				this.listQuery.cateId = item.id
				// 异常项查询
				getAbnormalList(this.listQuery).then(response =>{
					this.abnormalItem = response.data
					if(item.sub && item.sub.length > 0) {
						this.classItems = item.sub
					}else{
						// 判断有没有异常项
						if(this.abnormalItem.length > 0) {
							this.classItems = []
						}
					}
				})
			},
			// 选择异常项
			onTrigger(item){
				this.form3.abnormalId = item.id // 异常项id
				this.form3.abnormalName = item.abnormalName // 异常项名称
				this.show = false
			},
			// 转办提交
			submitComplaint() {
				const req = {}
				req.recordId = this.form.id // 主键id
				// req.abnormalId = this.form3.abnormalId // 转办至的异常主键id
				req.rejectReason = this.form3.responseDesc // 转办描述,最大长度2000
				andonRejectPost(req).then(response =>{
					uni.redirectTo({
						url:'./andon_006_problemList',
					})
					$message('转办成功！')
					return
				})
			},
			// 手动升级
			up(){
				const req={}
				req.id = this.form.id
				upLevel(req).then(res=>{
					$message('手动升级成功！')
					return
				})
			}
		},
		onLoad(options) {
			this.dataList = JSON.parse(options.item)
			this.getPicList()
			getTriggerHandleList({
				id: this.dataList.id
			}).then(response => {
				this.form = response.data
				this.form.keyParameter = JSON.parse(this.form.keyParameter)
				this.form.abnormalTag = JSON.parse(this.form.abnormalTag) // 标签
				console.log(this.form.status)
				// this.form.responseDesc = this.form.responseDesc // 响应描述
			})

			this.urlPath = getFileServerUrl()
		}
	}
</script>

<style lang="scss">
	.btn-margin {
		margin: 0 10px;
	}
	.btn{
		margin: 10px;
	}
</style>
