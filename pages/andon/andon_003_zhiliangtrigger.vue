<template>
	<!--andon触发-->
	<view class="content">
		<view class="app-containerR bg-white cc">
			<view class="leftMax3RCon">
				<u-form :model="form" ref="uForm">
					<u-form-item label="异常分类" v-if="!hasInteractiveCheck.interactiveCheck">
						<u-input  placeholder="请选择异常分类" v-model="form.classIteml1" type="text"
							disabled=""></u-input>
						<u-button slot="right" type="primary" @click="selectClassIteml1()">可选择</u-button>
					</u-form-item>
					<u-form-item label="异常项">
						<u-input v-model="form.name" disabled="" />
						<u-button v-show="button1" slot="right" type="primary"
							@click="selectClassIteml2()">可选择</u-button>
					</u-form-item>
					<u-form-item label="响应人" >
						<u-input  placeholder="请选择响应人" v-model="form.asResponderName" type="text"
							disabled=""></u-input>
						<u-button v-show="button1" slot="right" type="primary" @click="selectResponder()">可选择</u-button>
					</u-form-item>
					<u-form-item label="生产号">
						<u-input  placeholder="请选择生产号" v-model="form.productNo" type="text"
							:disabled="!hasInteractiveCheck.interactiveCheck"></u-input>
						<u-button slot="right" type="primary" @click="selectProductNo()"
							:disabled="!hasInteractiveCheck.interactiveCheck">可选择</u-button>
					</u-form-item>
					<u-form-item label="型号" >
						<u-input  placeholder="型号" v-model="form.productModel" type="text"
							v-show="modelShow" disabled=""></u-input>
					</u-form-item>
					<u-form-item label="项目名称" >
						<u-input  placeholder="项目名称" v-model="form.projectName" type="text"
							:disabled="!hasInteractiveCheck.interactiveCheck"></u-input>
					</u-form-item>
					<u-form-item label="工序节点">
						<u-input  placeholder="请选择工序节点" v-model="form.productNodeName" type="text"
							:disabled="hasInteractiveCheck.interactiveCheck"></u-input>
						<u-button slot="right" type="primary" @click="productNodeInfo">请选择</u-button>
					</u-form-item>
					<u-form-item label="工序名称">
						<u-input  placeholder="请选择工序" v-model="form.opName" type="text"
							:disabled="hasInteractiveCheck.interactiveCheck"></u-input>
						<u-button slot="right" type="primary" @click="selectOp">请选择</u-button>
					</u-form-item>
					<u-form-item label="描述" prop="remarks">
						<u-input type="textarea" :maxlength="2000" :rows="6" v-model="form.remarks" value=""
							placeholder="详细描述异常现状(必填)" style="font-size: 15rpx;" />
					</u-form-item>
					<u-form-item label="产线">
						<u-input  placeholder="请选择产线" v-model="form.productName" type="text"
							disabled=""></u-input>
						<u-button slot="right" type="primary" @click="selectProduct">请选择</u-button>
					</u-form-item>
					<u-form-item label="工位" >
						<u-input  placeholder="请选择工位" v-model="form.workspaceName" type="text"
							disabled=""></u-input>
						<u-button slot="right" type="primary" @click="selectStation">请选择</u-button>
					</u-form-item>
					<u-form-item label="设备" v-if="father.item.andonCate==8">
						<u-input  placeholder="请选择设备" v-model="form.eqpName" type="text"
							disabled=""></u-input>
						<u-button v-show="andonCate!=1" slot="right" type="primary"
							@click="selectEquip()">请选择</u-button>
					</u-form-item>
					<u-form-item label="图号">
						<u-input  placeholder="请输入图号" v-model="form.drawingNo" type="text"
							:disabled="!hasInteractiveCheck.interactiveCheck"></u-input>
					</u-form-item>
					<u-form-item v-show="type==2" label="物料名称">
						<u-input  placeholder="请选择物料" v-model="form.materialName" type="text"></u-input>
						<u-button slot="right" type="primary" @click="selectWuliao">请选择</u-button>
					</u-form-item>
					<u-form-item v-show="form.materialName" label="物料编号">
						<u-input  disabled="" placeholder="请输入物料编号" v-model="form.materialNo"
							type="text"></u-input>
					</u-form-item>
					<u-form-item label="上传" class="upload-group" >
						<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" accept="image"
							multiple :maxCount="3" :previewFullImage="true"></u-upload>
					</u-form-item>
				</u-form>
				<view class="app-containerR cc">
					<button type="primary" class="uni-btn" @click="submit">提交</button>
				</view>
			</view>
		</view>
		<!--标签弹窗-->
		 <u-popup @close="close" mode="bottom" :show="dialogTapFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 200rpx;">
					<u-checkbox-group @change="checkboxGroupChange">
						<u-checkbox @change="checkboxChange" v-model="item.checked"
							v-for="(item, index) in tableTapData" :key="item.id"
							:name="item.tagName">{{item.tagName}}</u-checkbox>
					</u-checkbox-group>
				</scroll-view>
			</view>
		</u-popup>

		<!--设备弹窗-->
		 <u-popup @close="close" mode="bottom" :show="dialogFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="input-view">
						<u-form-item label="设备编号">
							<u-input placeholder="设备编号" v-model="eqpNum" @blur="searchEquip()" />
						</u-form-item>
						<u-form-item label="设备名称">
							<u-input placeholder="设备名称" v-model="eqpName" @blur="searchEquip()" />
						</u-form-item>
					</view>
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">设备名称</view>
							<view class="th">设备编号</view>
							<view class="th">型号规格</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in tableEquipData" :key="x.id">
							<view class="td">{{x.name}}</view>
							<view class="td">{{x.id}}</view>
							<view class="td">{{x.number}}</view>
							<view class="td">
								<u-button type="primary" @click="saveEquipData(x)">确认</u-button>
							</view>
						</view>
					</view>
					<!-- <view class="more-link" @click="selectEquip('more')">查看更多 ></view> -->
				</scroll-view>
			</view>
		</u-popup>

		<!--产线弹窗-->
		 <u-popup @close="close" mode="bottom" :show="dialogProductFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">产线名称</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in tableProductData" :key="x.id">
							<view class="td">{{x.name}}</view>
							<view class="td">
								<u-button type="primary" @click="saveProductData(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<!--物料弹窗-->
		 <u-popup @close="close" mode="bottom" :show="dialogWuliaoVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">物料名称</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in tableWuliaoData" :key="x.id">
							<view class="td">{{x.partName}}</view>
							<view class="td">
								<u-button type="primary" @click="saveWuliao(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<!--工位弹窗-->
		 <u-popup @close="close" mode="bottom" :show="dialogStationFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">产线名称</view>
							<view class="th">工位名称</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in tableStationData" :key="x.workspaceId">
							<view class="td">{{x.productLineName}}</view>
							<view class="td">{{x.workspaceName}}</view>
							<view class="td">
								<u-button type="primary" @click="saveStationData(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<!--响应人弹窗-->
		 <u-popup @close="close" mode="bottom" :show="dialogResponderFormVisible">
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
								<u-button type="primary" @click="saveResponder(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<!-- 生产号弹窗 -->
		 <u-popup @close="close" mode="bottom" :show="dialogProductNoFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="input-view">
						<u-form-item label="生产号">
							<u-input class="input-border" placeholder="请输入生产号" v-model="searchKey"
								@input="debouncedSearchProductNo()" />
						</u-form-item>
					</view>
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">生产号</view>
							<view class="th">项目名称</view>
							<view class="th">型号</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in productNoDate" :key="x.id">
							<view class="td">{{x.productNoFull}}</view>
							<view class="td">{{x.projectName}}</view>
							<view class="td">{{x.productModel}}</view>
							<view class="td">
								<u-button type="primary" @click="saveProductNo(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<!-- 工序节点弹窗 -->
		 <u-popup @close="close" mode="bottom" :show="dialogProductNodeFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">节点名称</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in productNodeDate" :key="x.id">
							<view class="td">{{x.name}}</view>
							<view class="td">
								<u-button type="primary" @click="saveNode(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<!-- 工序弹窗 -->
		 <u-popup @close="close" mode="bottom" :show="dialogOpFormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">工序名称</view>
							<view class="th">工序别名</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in productOpDate" :key="x.id">
							<view class="td">{{x.opName}}</view>
							<view class="td">{{x.opAlias}}</view>
							<view class="td">
								<u-button type="primary" @click="saveOp(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<!-- 异常分类弹窗 -->
		 <u-popup @close="close" mode="bottom" :show="dialogClassIteml1FormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">Andon分类名</view>
							<view class="th">Andon分类描述</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in AndonClassIteml1Date" :key="x.id">
							<view class="td">{{x.cateName}}</view>
							<view class="td">{{x.cateDesc}}</view>
							<view class="td">
								<u-button type="primary" @click="saveAndonClassIteml1(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<!--异常项弹窗-->
		 <u-popup @close="close" mode="bottom" :show="dialogClassIteml2FormVisible">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">异常名称</view>
							<view class="th">异常描述</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in abnormalItem" :key="x.id">
							<view class="td">{{x.abnormalName}}</view>
							<view class="td">{{x.abnormalDesc}}</view>
							<view class="td">
								<u-button type="primary" @click="saveAbnormalItem(x)">确认</u-button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	// 设备查询、标签查询、产线、工位、andon触发、查询设备
	import {
		getAbnormalResponderList,
		getEqpLedgerinfoList,
		getProductLineList,
		getWorkspaceAndExamList,
		andonTriggerPost,
		getProductNo,
		productNode,
		getOp,
		getAllEquipList,
		andonInteractiveCheck
	} from "@/https/andon/andon.js"
	import {
		$message
	} from '@/utils/common.js'
	// import {lingbujianBianma} from '@/https/andon/production.js'
	// 上传文件、文件前缀
	import uploadHttp from '@/https/_public/upload';
	import {
		debounce
	} from 'lodash'
	import {
		getCateList,
		getAbnormalList
	} from "@/https/andon/andon.js"
	import {
		getCommonUrlStore,
		getCommonUrl
	} from '@/https/_public/common.js'

	export default {
		name: 'andonTriggerPage',
		data() {
			return {
				hasInteractiveCheck: {
					interactiveCheck: true,
					taskExecutionId: ''
				},
				border: false,
				type: '', // 1 设备  2 生产
				// 上个页面传的异常项id、name
				father: {
					item: '',
					cateId: ''
				},
				responder: '', //异常响应人
				button1: true,
				eqpNum: "", // 查询设备参数
				eqpName: "", // 查询设备参数
				form: {
					affectedCount: 1,
					name: '', // 异常项
					eqpName: '', // 设备名称
					eqpId: '', // 设备id
					opName: '', //工序名称
					opCode: '',
					drawingNo: '', //图号,
					productNo: '', //生产号
					abnormalTag: [], // 标签组
					abnormalTagValid: '', // 作为标签验证
					productId: '', // 产线id
					productName: '', // 产线名称
					workspaceId: '', // 工位id
					workspaceName: '', // 工位名称
					localImages: [], // 本地访问地址
					picAddr: [], // 后台需要地址
					picAddrValid: '', // 作为图片验证
					remarks: '',
					guiCode: '',
					projectName: '',
					productModel: '',
					asResponderId: '', // 指定响应人id
					asResponderName: '', // 指定响应人姓名
					asResponderTel: '', // 指定响应人电话
					orderId: '', // 查询工序用的工单ID
					opId: '', // 工序计划id
					responderDepartment: '', // 响应人部门信息
					productNodeId: '', //工序节点id
					productNodeName: '', //工序节点名称
					classIteml1Id: '', //一级异常分类ID
					classIteml2Id: '', //二级异常分类ID
				},
				fileList:[],
				dialogTapFormVisible: false, // 标签
				dialogFormVisible: false, // 设备
				dialogResponderFormVisible: false, // 响应人
				dialogProductNoFormVisible: false, // 生产号
				dialogClassIteml1FormVisible: false, // 一级异常分类
				dialogClassIteml2FormVisible: false, // 二级异常分类
				dialogOpFormVisible: false, // 工序
				dialogProductNodeFormVisible: false, // 工序
				listQuery: {
					pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
					pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
					name: '', // 设备名称
					number: '', // 设备编号
					usingDepartment: '', // 使用部门
					status: '' // 使用状态，枚举
				},
				tableTapData: [], // 标签集合
				tableEquipData: [], // 设备集合
				andonCate: '', //是否显示设备
				dialogProductFormVisible: false, // 产线
				tableProductData: [], // 产线数据
				dialogStationFormVisible: false, // 工位
				dialogWuliaoVisible: false, //物料
				tableWuliaoData: [],
				tableStationData: [], // 工位数据
				respondersDate: [], // 响应人数据
				productNoDate: [], // 生产号数据
				productNodeDate: [], // 工序节点数据
				productOpDate: [], // 工序数据
				searchKey: '', // 查询生产号条件
				urlPath: '', // 文件前缀
				modelShow: false, // 型号显影
				AndonClassIteml1Date: [], //异常分类数据
				abnormalItem: [], //二级异常分类数据
				rules: { // 验证
					remarks: [{
						required: true,
						message: '请输入必填项',
						trigger: ['blur', 'change']
					}],

				}
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		computed: {
			debouncedSearchProductNo() {
				return debounce(this.searchProductNo, 1000)
			},
		},
		methods: {
			deletePic(event) {
				// value.imageToShow = ''
				this.fileList.splice(event.index, 1)
				this.form.picAddr.splice(event.index, 1)
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
						this.form.picAddr.push(result.data)
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

			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				// console.log(e, '===vvvvvvvv==');
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				this.form.abnormalTag = []
				if (e && e.length > 0) {
					e.forEach(item => {
						if (this.tableTapData) {
							this.tableTapData.forEach(item2 => {
								if (item == item2.tagName) {
									this.form.abnormalTag.push(item2)
									this.form.abnormalTagValid = this.form.abnormalTag.toString()
								}
							})
						}

					})
				}
			},
			ok() {
				this.dialogTapFormVisible = false
			},
			// 选择设备
			selectEquip() {
				this.dialogFormVisible = true
				this.searchEquip()
			},
			// 查询设备
			searchEquip() {
				let req = {}
				req.eqpNum = this.eqpNum
				req.eqpName = this.eqpName
				this.tableEquipData = []
				getAllEquipList(req).then(res => {
					this.tableEquipData = res.data
				})

			},
			// 确认设备
			saveEquipData(item) {
				this.form.eqpName = item.name
				this.form.eqpId = item.id
				this.dialogFormVisible = false
			},
			// 查询响应人
			selectResponder() {
				this.dialogResponderFormVisible = true
				this.respondersDate = []
				getAbnormalResponderList({
					abnormalId: this.father.item.id
				}).then(res => {
					this.respondersDate = res.data
				})
			},
			// 确认响应人
			saveResponder(item) {
				this.form.asResponderId = item.id,
					this.form.asResponderName = item.name
				this.form.asResponderTel = item.number
				this.form.responderDepartment = item.minor
				this.dialogResponderFormVisible = false
			},
			// 查询生产号
			selectProductNo() {
				this.dialogProductNoFormVisible = true
			},
			searchProductNo() {
				const req = {
					searchKey: this.searchKey
				}
				getProductNo(req).then(res => {
					this.productNoDate = res.data
					this.modelShow = true
				})
			},
			saveProductNo(item) {
				this.form.productNo = item.productNoFull
				this.form.orderId = item.id
				this.form.projectName = item.projectName
				this.form.productModel = item.productModel
				this.form.opName = ""
				this.dialogProductNoFormVisible = false
			},
			// 查询工序节点
			productNodeInfo() {
				if(this.form.productNo){
					const req = {
						productNo: this.form.productNo
					}
					productNode(req).then(res => {
						this.productNodeDate = res.data
						if (res.err_code != 10000) {
							$message(res.err_msg)					
						}else{
							this.dialogProductNodeFormVisible = true
						}
					})
				}else{
					$message('请选择生产号！')
				}
			},
			saveNode(item) {
				this.form.productNodeId = item.id
				this.form.productNodeName = item.name
				this.dialogProductNodeFormVisible = false
			},
			// 查询工序
			selectOp() {
				if(this.form.orderId){
					const req = {
						orderId: this.form.orderId,
						productPlanNodeId: this.form.productNodeId
					}
					getOp(req).then(res => {
						this.productOpDate = res.data
						if (res.err_code != 10000) {
							$message(res.err_msg)
						}else{
							this.dialogOpFormVisible = true
						}
					})
				}else{
					$message('请选择工序节点！')
				}
			},
			saveOp(item) {
				this.form.opId = item.id
				this.form.opName = item.opName
				if (item.opAlias != '' && null != item.opAlias) {
					this.form.opName += '(' + item.opAlias + ')'
				}
				this.dialogOpFormVisible = false
			},
			init() {
				const req = {
					searchKey: this.searchKey
				}
				getProductNo(req).then(res => {
					this.form.orderId = res.data[0].id
				})
			},
			// 查询产线
			selectProduct() {
				this.dialogProductFormVisible = true
				this.tableProductData = []
				getProductLineList().then(response => {
					this.tableProductData = response.data
				})
			},
			// 产线确认
			saveProductData(item) {
				this.form.productName = item.name
				this.form.productId = item.id
				this.dialogProductFormVisible = false
			},
			// 查询工位
			selectStation() {
				if (this.form.productId) {
					this.dialogStationFormVisible = true
					this.tableStationData = []
					getWorkspaceAndExamList({
						productLineId: this.form.productId
					}).then(response => {
						this.tableStationData = response.data
					})
				} else {
					$message('请先选择产线')
				}
			},
			//物料确认
			saveWuliao(x) {
				this.form.materialNo = x.partNumber
				this.form.materialName = x.partName
				this.dialogWuliaoVisible = false
			},
			//物料查询
			selectWuliao() {
				lingbujianBianma({
					opPlanId: this.form.opPlanId
				}).then(res => {
					this.tableWuliaoData = res.data
				})
				this.dialogWuliaoVisible = true
			},
			// 工位确认
			saveStationData(item) {
				this.form.workspaceName = item.workspaceName
				this.form.workspaceId = item.workspaceId
				this.dialogStationFormVisible = false
			},
			//获取第一级异常分类
			//todo
			selectClassIteml1() {
				this.dialogClassIteml1FormVisible = true
				this.AndonClassIteml1Date = []
				getCateList().then(res => {
					this.AndonClassIteml1Date = res.data
				})
			},
			//一级分类确认
			saveAndonClassIteml1(item) {
				this.form.classIteml1 = item.cateName
				this.form.classIteml1Id = item.id
				this.dialogClassIteml1FormVisible = false
				this.father.item = item
			},
			//获取第二级分类
			selectClassIteml2() {
				if (this.form.classIteml1) {
					this.dialogClassIteml2FormVisible = true
					this.abnormalItem = []
					this.listQuery.cateId = this.form.classIteml1Id
					// 异常项查询
					getAbnormalList(this.listQuery).then(response => {
						this.abnormalItem = response.data
						console.log(this.abnormalItem)
					})
				} else {
					$message('请先选择异常分类')
				}
			},
			//二级分类确认
			saveAbnormalItem(item) {
				this.form.name = item.abnormalName
				this.form.asResponderName = item.responders[0].name
				this.father.item.id = item.id
				this.father.cateId = item.cateId
				this.form.classIteml2Id = item.id
				this.form.asResponderId = item.responders[0].id
				this.dialogClassIteml2FormVisible = false
			},
			// andon触发提交
			submit() {
				this.$refs.uForm.validate().then((valid) => {
					if (valid) {
						let obj = {
							eqpName: this.form.eqpName, // 设备名称
							eqpId: this.form.eqpId, // 设备id
							productLineId: this.form.productId, // 产线id
							productLineName: this.form.productName, // 产线名称
							workspaceId: this.form.workspaceId, // 工位id
							workspaceName: this.form.workspaceName, // 工位名称
							opId: this.form.opId, //工序ID
							opName: this.form.opName == null || this.form.opName == '' ? this.form
								.productNodeName : this.form.opName, //工序名称
							drawingNo: this.form.drawingNo, //图号
							materialNo: this.form.materialNo, //物料编码
							materialName: this.form.materialName //物料名称
						}
						obj = JSON.stringify(obj)
						if (this.hasInteractiveCheck.interactiveCheck) {
							const req = {
								"triRec": {
									"cateid": this.father.cateId,
									"abnormalId": this.father.item.id, // 异常项id
									"abnormalTag": JSON.stringify(this.form.abnormalTag), // 标签
									"affectedCount": this.form.affectedCount, // 影响人数，默认1
									"remarks": this.form.remarks,
									"keyParameter": obj,
									"projectName": this.form.projectName,
									"productNo": this.form.productNo,
									"asResponderId": this.form.asResponderId, // 指定响应人id
									"asResponderName": this.form.asResponderName, // 指定响应人姓名
									"asResponderTel": this.form.asResponderTel, // 指定响应人电话
									"opId": this.form.opId, // 指定工序ID
									"responderDepartment": this.form.responderDepartment, // 响应人部门ID
									"productModel": this.form.productModel,
									"productNodeId": this.form.productNodeId,
								},
								"picAddr": this.form.picAddr
							}
							andonTriggerPost(req).then(response => {
								if (response.err_code === 10000) {
									uni.redirectTo({
										url: "./index"
									})
									$message('触发成功！')
								} else {
									$message(response.err_msg)
								}
							})
						} else {
							const req = {
								"record": {
									"cateid": this.father.cateId,
									"abnormalId": this.father.item.id, // 异常项id
									"abnormalTag": JSON.stringify(this.form.abnormalTag), // 标签
									"affectedCount": this.form.affectedCount, // 影响人数，默认1
									"remarks": this.form.remarks,
									"keyParameter": obj,
									"projectName": this.form.projectName,
									"productNo": this.form.productNo,
									"asResponderId": this.form.asResponderId, // 指定响应人id
									"asResponderName": this.form.asResponderName, // 指定响应人姓名
									"asResponderTel": this.form.asResponderTel, // 指定响应人电话
									"opId": this.form.opId, // 指定工序ID
									"responderDepartment": this.form.responderDepartment, // 响应人部门ID
									"productModel": this.form.productModel,
									"productNodeId": this.form.productNodeId,
								},
								"workerId": this.form.asResponderId,
								"taskExecutionId": this.hasInteractiveCheck.taskExecutionId
							}
							andonInteractiveCheck(req).then(response => {
								if (response.err_code === 10000) {
									$message('触发成功！')
									this.reSetForm()
								} else {
									$message(response.err_msg)
								}
							})
						}
					} else {
						$message('请填写必填项！')
					}
				});
			},
			reSetForm() {
				this.form.remarks = ''
				this.picAddrValid = ''
				this.$emit('onQuery')
			},
			initLoad(item) {
				this.hasInteractiveCheck.interactiveCheck = item.interactiveCheck;
				this.hasInteractiveCheck.taskExecutionId = item.taskExecutionId;
				if (!this.hasInteractiveCheck.interactiveCheck) {
					this.searchKey = item.projectNo
					this.form.productNo = item.projectNo
					this.form.productModel = item.productModel
					this.form.projectName = item.projectName
					this.form.drawingNo = item.drawingNo
					this.modelShow = true
				}
				// 获取工序信息
				if (this.searchKey != "" && this.searchKey != null && this.searchKey != undefined) {
					this.init()
				}

			}
		},
		onLoad(options) {
			// this.father.item.andonCate 0未知  1设备问题  2工艺问题  3生产问题
			this.father.item = JSON.parse(options.item) // 上个页面传过来异常项数据
			this.form.name = this.father.item.abnormalName
			this.father.cateId = options.fcateId // 最里面andon分类id
			let andonData = getApp().globalData.andonData
			this.searchKey = andonData.productNo
			this.type = andonData.type //1设备 2 生产
			if (andonData.type == 2) {
				this.form.productId = andonData.productLineId
				this.form.productName = andonData.productLineName
				this.form.workspaceName = andonData.workspaceName
				this.form.workspaceId = andonData.workspaceId
				this.form.opId = andonData.opPlanId
				this.form.opName = andonData.opName
				this.form.opPlanId = andonData.opPlanId
				this.form.drawingNo = andonData.drawingNo
				this.form.productNo = andonData.productNo
				this.form.projectName = andonData.projectName
				this.form.guiCode = andonData.gui_code
				this.form.productModel = andonData.productModel
				this.modelShow = true
			} else if (andonData.type == 1) {
				this.andonCate = 1
				this.form.eqpName = andonData.eqpName
				this.form.eqpId = andonData.eqpId
			}
			// this.respondersDate = []
			var datas = []
			getAbnormalResponderList({
				abnormalId: this.father.item.id
			}).then(res => {
				datas = res.data
				if (datas.length != 0) {
					this.form.asResponderId = datas[0].id
					this.form.asResponderName = datas[0].name
					this.form.asResponderTel = datas[0].number
					this.form.responderDepartment = datas[0].minor
				}
				if (datas.length == 1) {
					this.button1 = false
				}
			})
			// 文件前缀
			this.urlPath = getCommonUrlStore()
			// 获取工序信息
			if (this.searchKey != "" && this.searchKey != null && this.searchKey != undefined) {
				this.init()
			}

		}
	}
</script>

<style lang="scss">
	.input-border {
		border: 1px solid #ccc;
	}
</style>