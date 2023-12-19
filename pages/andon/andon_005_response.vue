<template>
	<view class="content">
		<view class="app-containerR bg-white cc">
			<view class="leftMax3RCon">
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

					<view  v-if="form.typeid === 'unqualifiedProductDeal'">
						<u-form-item label="产品名称">
							<u-input v-model="form.productName" placeholder="请填写产品名称"  />
						</u-form-item>
						<u-form-item label="问题产品数量">
							<u-input type='number' v-model="form.quantity" placeholder="请填写问题产品数量"  />
						</u-form-item>
						<u-form-item label="责任部门">
							<u-input  placeholder="请选择责任部门" v-model="form.responsibleDepartment" type="text" disabled=""></u-input>
							<u-button slot="right" type="primary"  @click="selectDepartment()">可选择</u-button>
						</u-form-item>
						<u-form-item label="问题程度">
							<u-input  placeholder="请选择问题程度" v-model="form.level" type="text" disabled=""></u-input>
							<u-button slot="right" type="primary"  @click="selectProblemLevel()">可选择</u-button>
						</u-form-item>
						<u-form-item label="原因分析">
							<u-input type="textarea" :maxlength="2000" :rows="6" v-model="form.reasonAnalysis"
								placeholder="请填写原因分析" style="font-size: 15rpx;" />
						</u-form-item>
					</view>

					<u-form-item label="问题描述">
						<u-input type="textarea" :maxlength="2000" :rows="6" v-model="form.remarks"
							placeholder="详细描述异常现状(必填)" style="font-size: 15rpx;" disabled />
					</u-form-item>
					<u-form-item label="触发时间">
						<u-input v-model="form.triggerDate" disabled="" />
					</u-form-item>
					<u-form-item label="影响人数">
						<u-input v-model="form.affectedCount" placeholder="请输入人数" disabled="" />
					</u-form-item>
					<u-form-item v-show="primaryShow&&item.name!=''" v-for="(item,index) of form.keyParameter"
						:label="item.objName">
						<u-input v-model="item.name" placeholder="暂无内容" disabled="" />
					</u-form-item>
					<u-form-item label="图片" class="upload-group" prop="picAddrValid" v-show="picShow">
						<u-button class="m-10"  type="primary" @click="clickImg()">查看图片</u-button>
					</u-form-item>

				</u-form>
				<view class="app-containerR cc">
					<button type="primary" class="btn" @click="submit">响应</button>
					<button type="primary" class="btn" @click="assign">指派</button>
					<button type="warn" class="btn" @click="complaint">转办</button>
				</view>
			</view>
		</view>
		<u-popup mode="bottom" @close="dialogProblemTypeFormVisible = false" :show="dialogProblemTypeFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">问题类型</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in ProblemTypeList" :key="x.value">
							<view class="td">{{x.label}}</view>
							<view class="td">
								<u-button  type="primary" @click="saveProblemType(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<u-popup mode="bottom" @close="dialogProblemLevelFormVisible = false"  :show="dialogProblemLevelFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">问题程度</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in problemLevelList" :key="x.value">
							<view class="td">{{x.label}}</view>
							<view class="td">
								<u-button  type="primary" @click="saveProblemLevel(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<u-popup mode="bottom" @close="dialogDepartmentFormVisible = false" :show="dialogDepartmentFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">部门/车间</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in orgList" :key="x.id">
							<view class="td">{{x.name}}</view>
							<view class="td">
								<u-button  type="primary" @click="saveDepartment(x)">确认</u-button>
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
		$message
	} from '@/utils/common.js'
	import {getFileServerUrl} from '@/utils/config.js'
	// 响应、单条触发问题处理查询、Andon分类查询、异常项查询、转办
	import {
		andonResponsePost,
		getTriggerHandleList,
		getCateList,
		getAbnormalList,
		andonTransferPost,
		getPic,
		getOrgInfo
	} from "@/https/andon/andon.js"
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		getToken,
		getUserToken,
		setToken,
		setUserToken
	} from '@/utils/auth.js'
	export default {
		data() {
			return {
				touchData: {}, //滑动事件数据
				border: false,
				focus: false,
				tmptoken: '',
				urlPath: '',
				primaryShow: false,
				picShow: false,
				form: {},
				type: 0, // 1 快速响应
				form2: {
					abnormalId: '', // 异常项id
					abnormalName: '', // 异常项名称
					responseDesc: '' // 转办描述
				},
				listQuery: {
					pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
					pg_pagesize: 1000, // 查询第几页数据，默认第一页 pg_pagesize
					cateId: ''
				},
				dialogFormVisible: false, // 转办弹窗
				show: false,
				classItems: [], // andon分类集合
				abnormalItem: [], // 异常项集合
				rules: { // 验证
					responseDesc: [{
						required: true,
						message: '请输入必填项',
						trigger: ['blur', 'change']
					}]
				},
				dialogProblemTypeFormVisible: false,
				dialogProblemLevelFormVisible: false,
				dialogDepartmentFormVisible: false,
				orgList: [],
				ProblemTypeList: [{
						value: 'normal',
						label: '普通安灯'
					},
					{
						value: 'unqualifiedProductDeal',
						label: '不合格品处理'
					},
					{
						value: 'processReview',
						label: '过程评审'
					},
					{
						value: 'interactiveCheck',
						label: '工序交接'
					},
					{
						value: 'appearanceReview',
						label: '外观评审'
					}
				],
				problemLevelList: [{
						value: 'slight',
						label: '轻微'
					},
					{
						value: 'normal',
						label: '一般'
					},
					{
						value: 'critical',
						label: '严重'
					}
				]
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
				this.$refs.uForm.validate().then((valid) => {
					if (valid) {
						const req = {
							id: this.form.id,
							responseDesc: this.form.responseDesc,
							problemType: this.form.typeid,
							responsibleDepartment: this.form.responsibleDepartment,
							responsibleDepartmentId: this.form.responsibleDepartmentId,
							productName: this.form.productName,
							quantity: this.form.quantity,
							level: this.form.level,
							reasonAnalysis: this.form.reasonAnalysis
						}
						andonResponsePost(req, this.tmptoken).then(response => {
							if (this.type == 1) {
								uni.redirectTo({
									url: './andon_006_problemList',
								})
								$message('提交成功！')
								return
							} else {
								uni.redirectTo({
									url: './andon_004_responseList',
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
			// 放大预览图片
			clickImg() {
				var urls = [];
				this.form.imageList.forEach(item => {
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
			// 转办
			complaint() {
				let data = JSON.stringify(this.form)
				uni.redirectTo({
					url: "./andon_009_transfer?data=" + data
				})
			},
			// 指派
			assign() {
				let data = JSON.stringify(this.form)
				uni.redirectTo({
					url: "./andon_010.assign?data=" + data
				})
			},
			getPicList() {
				getPic({
					triggerId: this.form.id
				}).then(res => {
					this.form.imageList = res.data
					console.log(111)
					console.log(res.data.length)
					this.picShow = this.form.imageList.length == 0 ? false : true
				})
			},
			selectProblemType() {
				this.dialogProblemTypeFormVisible = true
			},
			selectProblemLevel() {
				this.dialogProblemLevelFormVisible = true
			},
			selectDepartment() {
				this.dialogDepartmentFormVisible = true
			},
			saveProblemType(item) {
				this.form.type = item.label
				this.form.typeid = item.value
				this.dialogProblemTypeFormVisible = false
			},
			saveProblemLevel(item) {
				this.form.level = item.label
				this.dialogProblemLevelFormVisible = false
			},
			saveDepartment(item) {
				this.form.responsibleDepartmentId = item.id
				this.form.responsibleDepartment = item.name
				this.dialogDepartmentFormVisible = false
			}
		},
		onLoad(options) {
			this.type = options.type || 0
			this.form = JSON.parse(options.item)
			let triggerName = this.form.triggerName
			this.tmptoken = this.type ? options.tmptoken : getToken() // 快速登录tmptoken有值，否则没值
			
			getTriggerHandleList({
				id: this.form.id,
				tmptoken: this.tmptoken
			}).then(response => {
				this.form = response.data
				if (!this.form.productNo) {
					this.form.productNo = '未填生产号'
				}
				this.form.keyParameter = JSON.parse(this.form.keyParameter)
				this.form.abnormalTag = JSON.parse(this.form.abnormalTag) // 标签
				this.form.responseDesc = '' // 响应描述
				this.form.triggerName = triggerName
			})
			this.getPicList()
			this.orgList = []
			getOrgInfo({
				name: '车间'
			}).then(response => {
				this.orgList = response.data
				this.orgList.push({id:'25',name:'采购管理部'})
			})
			this.urlPath = getFileServerUrl()
			
		}
	}
</script>

<style lang="scss">
	.u-button{
		margin-left: 5px;
	}
	.btn{
		margin: 10px;
	}
</style>