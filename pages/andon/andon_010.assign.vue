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
						<u-input type="textarea"  :maxlength="2000" :rows="6" v-model="form.remarks" disabled="" />
					</u-form-item>
					<u-form-item label="指派人" prop="assignName">
						<u-input  placeholder="请选择指派人" v-model="personInfo.name" type="text" disabled=""></u-input>
						<u-button slot="right" type="primary"  @click="selectPerson()">请选择</u-button>
					</u-form-item>
					<u-form-item label="指派描述" prop="responseDesc">
						<u-input type="textarea"  :maxlength="2000" :rows="6" v-model="form.responseDesc" value="" placeholder="指派描述" style="font-size: 15rpx;"/>
					</u-form-item>
				</u-form>
				<view class="app-containerR cc">
					<button type="primary" class="uni-btn" @click="submit">提交</button>
				</view>
			</view>
		</view>
		
		<!-- 指派人员弹窗 -->
		<u-popup mode="bottom" @close="dialogAssignFormVisible = false" :show="dialogAssignFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="input-view">
						<u-form-item label="姓名" >
							<u-input placeholder="输入姓名查询" style="width: 300px;" v-model="searchKey" @blur="" />
							<u-button class="m-10" style="width: 300px;" type="primary" @click="queryPersonInfo()">查询</u-button>
						</u-form-item>
					</view>
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">姓名</view>
							<view class="th">电话</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in personData" :key="x.id">
							<view class="td">{{x.name}}</view>
							<view class="td">{{x.number}}</view>
							<view class="td">
								<u-button type="primary" @click="confirmPerson(x)">确认</u-button>
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
	import { findDepartmentPersons,assign} from "@/https/andon/andon.js"
	import { getToken} from '@/utils/auth.js'
	export default {
		data() {
			return {
				border: false,
				rules: { // 验证
					responseDesc: [
						{
							required: true,
							message: '请输入指派原因',
							trigger: ['blur', 'change']
						}
					]
				},
				personData:[],
				searchKey:"",
				dialogAssignFormVisible:false,
				personInfo:{
					id:"",
					name:"",
					number:""
				},
			}
		},
		methods: {
			selectPerson(){
				this.dialogAssignFormVisible = true
				this.searchKey=""
				this.personData = []
				this.queryPersonInfo()
			},
			queryPersonInfo(){
				findDepartmentPersons({searchKey:this.searchKey}).then(res=>{
					this.personData = res.data
				})
			},
			confirmPerson(x){
				this.personInfo = x
				this.dialogAssignFormVisible = false
			},
			// 指派提交
			submit() {
				this.$refs.uForm.validate().then((valid) => {
					if (valid) {
						const req = {}
						req.andonId = this.form.id
						req.assignDesc = this.form.responseDesc
						req.personInfo = this.personInfo
						assign(req).then(response =>{
							uni.redirectTo({
									url:'./andon_004_responseList',
								})
							$message('指派成功！')
							return
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
