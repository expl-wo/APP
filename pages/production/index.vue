<template>
	<view class="content">
		<view class="app-containerC app-containerWrap " style="margin-left: 10px;" v-if="item.show"
			v-for="item in menuList">
			<label class="label" style="font-size: 20px;margin-top: 6px;margin-bottom: 6px;">{{item.name}}</label>
			<view class="app-containerR app-containerWrap">
				<view class="group-warter  tc" :class="subItem.bgClass || item.bgClass" style="width: 200px;"
					@tap="jumpPath(subItem)" v-for="subItem in item.children" :key="subItem.code" v-if="subItem.show">
					<view class="xui-menu-item">
						<u-icon class="text-xl" size="50px" :name="subItem.icon"></u-icon>
						<text class="xui-menu-item__text">{{subItem.name}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
	<!-- <view class="content">
		<view class="app-containerR app-containerWrap">
			<view v-show="showList[0]" @click="tap1" class="group-warter my-item w-240 tc bg-blue">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/gscx.png"></u-icon>
				<view class="group-title">
					<navigator url="caozuozhe/gongshichaxun">工时查询</navigator>
				</view>
			</view>
			<view v-show="showList[1]" @click="tap2" class="group-warter w-240 tc my-item bg-blue">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/scrw.png"></u-icon>
				<view class="group-title">
					生产任务
				</view>
			</view>
			<view v-show="showList[8]" @click="tap9" class="group-warter w-240 tc my-item bg-blue">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/scrw.png"></u-icon>
				<view class="group-title">
					兼检任务
				</view>
			</view>
			<view v-show="showList[2]" @click="tap3" class="group-warter my-item w-240 tc bg-blue">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/ryzp.png"></u-icon>
				<view class="group-title">
					<navigator url="./banzuzhang/zhipaichanxian">人员指派</navigator>
				</view>
			</view>
			<view v-show="showList[3]" @click="tap4" class="group-warter my-item w-240 tc bg-blue">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/jjrw.svg"></u-icon>
				<view class="group-title">
					兼检任务
				</view>
			</view>
			<view v-show="showList[4]" @click="tap5" class="group-warter my-item w-240 tc bg-blue">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/rwck.png"></u-icon>
				<view class="group-title">
					<navigator url="./banzuzhang/renwuchakan">任务查看</navigator>
				</view>
			</view>
			<view v-show="showList[5]" @click="tap6" class="group-warter my-item w-240 tc bg-blue">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/gswcbl.png"></u-icon>
				<view class="group-title">
					<navigator url="./banzuzhang/gongshiwanchengbili">工时完成比率</navigator>
				</view>
			</view>
			<view v-show="showList[6]" @click="tap7" class="group-warter w-240 tc my-item bg-blue">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/scrw.png"></u-icon>
				<view class="group-title">
					发货报工
				</view>
			</view>
			<view v-show="showList[7]" @click="tap8" class="group-warter w-240 tc my-item bg-blue">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/scrw.png"></u-icon>
				<view class="group-title">
					电阻配平
				</view>
			</view>
		</view>
	</view> -->
</template>

<script>
	import {
		lineWork
	} from "@/https/production/proudction.js"
	export default{
		data(){
			return {
				menuList: [{
							code: '0702_production',
							name: '生产管理',
							show: true,
							bgClass: 'bg-cyan',
							children: [{
								icon: '/static/img/icon/scrw.png',
								code: '070201_opTask',
								name: '生产任务',
								show: false,
								url: '/pages/production/opTask/index',
							}, {
								icon: '/static/img/icon/zjrw.png',
								code: '070202_initCheckTask',
								name: '兼检任务',
								show: false,
								url: '/pages/production/opTask/index?opType=' + this.$constants.qualityCheckType.InitialCheck,
							}
							// , {
							// 	icon: '/static/img/icon/em_qtdj.svg',
							// 	code: '070203_resistanceTrim',
							// 	name: '电阻配平',
							// 	show: false,
							// 	url: '/pages/production/resistanceTrim/resistanceTrim'
							// },
							],
						}],
				needWorkSpaceJusticeCode: ['070201_opTask', '070202_initCheckTask'],
			};
		},
		onShow(options) {
			if (process.env.NODE_ENV !== 'development') {
				//正式环境下，加入权限控制显示或隐藏菜单
				// updateMenuVisible(this.menuList);
				
			}
			// uni.getStorageSync("hb_dq_app_menu").sp
			let perm = JSON.parse(uni.getStorageSync("hb_dq_app_menu") || '[]')
			console.log(perm);
			perm.forEach( item =>{
				this.menuList.forEach(it =>{
					it.children.forEach(i =>{
						if(item.code == i.code){
							i.show = true
							it.show = true
						}
					})
				})
			})
		},
		methods :{
			jumpPath(item){
				//生产和兼检任务需要先选择工位
				if(this.needWorkSpaceJusticeCode.indexOf(item.code) >=0){
					lineWork().then(response =>{
					  if (response.data.id==null){
						uni.navigateTo({
							url: '/pages/production/opTask/selectWorkSpace'
						});
					  } else {
					    uni.navigateTo({
					    	url: item.url
					    })
					  }
					})
				}else{
					uni.navigateTo({
						url: item.url
					})
				}
			},
		}
	}
</script>

<style lang="scss">
</style>