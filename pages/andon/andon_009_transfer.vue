<template>
	<view class="content">
		<view class="app-containerR bg-white cc">
			<view class="leftMax3RCon">
				<u-form :model="form" ref="uForm">
					<u-form-item label="提报人">
						<u-input v-model="form.triggerName" disabled="" />
					</u-form-item>
					<u-form-item label="提报时间">
						<u-input v-model="form.triggerDate" disabled="" />
					</u-form-item>
					<u-form-item label="项目">
						<u-input v-model="form.projectName" disabled="" placeholder="无项目信息"/>
					</u-form-item>
					<u-form-item label="描述">
						<u-input v-model="form.remarks" disabled="" />
					</u-form-item>
					<u-form-item label="转异常项" prop="abnormalName">
						<u-input  placeholder="请选择异常项" v-model="form.abnormalName" type="text" disabled=""></u-input>
						<u-button slot="right" type="primary"  @click="selectAbnormal()">请选择</u-button>
					</u-form-item>
					<u-form-item label="转响应人" prop="abnormalName">
						<u-input  placeholder="请选择响应人" v-model="form.asResponderName" type="text" disabled=""></u-input>
						<u-button slot="right" type="primary"  @click="selectResponder()">请选择</u-button>
					</u-form-item>
					<u-form-item label="转办描述" prop="responseDesc">
						<u-input type="textarea"  :maxlength="2000" :rows="6" v-model="form.responseDesc" value="" placeholder="转办描述" style="font-size: 15rpx;"/>
					</u-form-item>
				</u-form>
				<view class="app-containerR cc">
					<button type="primary" class="uni-btn" @click="submit">提交</button>
				</view>
			</view>
		</view>
		
		<!--分类弹窗-->
		<u-popup mode="bottom" @close="close" :show="dialogCateFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">分类名称</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in classItems" :key="x.id">
							<view class="td">{{x.cateName}}</view>
							<view class="td">
								<u-button  type="primary" @click="saveCateData(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<!--异常项弹窗-->
		<u-popup mode="bottom" @close="close" :show="dialogAbnormalVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">异常项名称</view>
							<view class="th">响应人名称</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in abnormalItems" :key="x.id">
							<view class="td">{{x.abnormalName}}</view>
							<view class="td">{{x.responders}}</view>
							<view class="td">
								<u-button  type="primary" @click="saveAbnormalData(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<!--响应人弹窗-->
		<u-popup mode="bottom" @close="close" :show="dialogResponderFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">响应人名称</view>
							<view class="th">响应人电话</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in respondersDate" :key="x.id">
							<view class="td">{{x.name}}</view>
							<view class="td">{{x.number}}</view>
							<view class="td">
								<u-button  type="primary" @click="saveResponder(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { $message } from '@/utils/common.js'
	import {getCateList, getAbnormalList,andonTransferPost,getAbnormalResponderList,findAbnormalByAdID} from "@/https/andon/andon.js"
	import { getToken} from '@/utils/auth.js'
	export default {
		data() {
			return {
				border: false,
				form:{},
				dialogCateFormVisible: false, // 分类弹框显隐
				dialogAbnormalVisible:false, // 异常项弹框显隐
				classItems:{}, // 分类集合
				abnormalItems:{}, // 异常项集合
				responders:[], // 异常项响应人
				type:'',
				dialogResponderFormVisible:false,
				respondersDate:[],
				rules: { // 验证
					responseDesc: [
						{
							required: true,
							message: '请输入必填项',
							trigger: ['blur', 'change']
						}
					],
					cateName: [
						{
							required: true,
							message: '请输入必填项',
							trigger: ['blur', 'change']
						}
					],
					abnormalName: [
						{
							required: true,
							message: '请输入必填项',
							trigger: ['blur', 'change']
						}
					]
				}
			}
		},
		methods: {
			selectCate(){ // 选择安灯分类
				this.dialogCateFormVisible = true
				getCateList().then(res => {
					this.classItems = res.data
				})
			},
			saveCateData(item){ // 安灯分类确认
				this.form.cateName = item.cateName
				this.form.cateId = item.id
				this.form.abnormalName = ''
				this.form.abnormalId = ''
				this.form.asResponderId = ''
				this.form.asResponderName = ''
				this.form.asResponderTel = ''
				this.dialogCateFormVisible = false
			},
			close(){
				this.dialogCateFormVisible = false
				this.dialogAbnormalVisible = false
				this.dialogResponderFormVisible= false
			},
			selectAbnormal() { // 选择异常项
				if(this.form.id) {
					this.dialogAbnormalVisible = true
					this.abnormalItems = []
					let id = this.form.id
					findAbnormalByAdID({'id': id}).then(response =>{
						this.abnormalItems = response.data
						this.abnormalItems.forEach(item => {
							let repsonder = ''
							item.responders.forEach(x => {
								repsonder += "【" + x.name + "】"
							})
							item.responders = repsonder
						})
					})
				}else{
					$message('请重新选择转办!')
				}
			},
			saveAbnormalData(item){ // 异常项确认
				this.form.abnormalName = item.abnormalName
				this.form.abnormalId = item.id
				this.form.asResponderId = ''
				this.form.asResponderName = ''
				this.form.asResponderTel = ''
				this.dialogAbnormalVisible = false
			},
			// 查询响应人
			selectResponder(){
				if(!this.form.abnormalId){
					$message('请先选择异常项')
					return
				}
				this.dialogResponderFormVisible = true
				this.respondersDate = []
				getAbnormalResponderList({abnormalId: this.form.abnormalId}).then(res =>{
					this.respondersDate = res.data
				})
			},
			// 确认响应人
			saveResponder(item) {
				this.form.asResponderId = item.id,
				this.form.asResponderName = item.name
				this.form.asResponderTel = item.number
				this.form.responderDepartment  = item.minor
				this.dialogResponderFormVisible = false
			},
			// 转办提交
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						const req = {}
						req.id = this.form.id // 主键id
						req.cateId = this.form.cateId
						req.abnormalId = this.form.abnormalId // 转办至的异常主键id
						req.responseDesc = this.form.responseDesc // 转办描述,最大长度2000
						req.asResponderId = this.form.asResponderId
						req.asResponderName = this.form.asResponderName
						req.asResponderTel = this.form.asResponderTel
						req.responderDepartment = this.form.responderDepartment
						req.tmptoken = getToken()
						if(this.type==1){req.tmptoken = this.tmptoken}
						andonTransferPost(req).then(response =>{
							if(this.type==1){
								uni.redirectTo({
										url:'./andon_006_problemList',
									})
								$message('转办成功！')
								return
							}else{
								uni.redirectTo({
									url:'./andon_004_responseList',
								})
								$message('转办成功！')
								return
							}
						})
					}else {
						$message('请填写必填项！')
					}
				})
			},
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(options) {
			this.form = JSON.parse(options.data)
			console.log(this.form)
			this.form.abnormalName = ''
			let andonData = getApp().globalData.andonData
			this.type = andonData.type//1设备 2 生产
		}
	}
</script>

<style>
	.u-button{
		margin-left: 5px;
	}
</style>
