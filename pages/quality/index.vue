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
	<!-- <view class="content ">
		<view v-show="showList[0]" class="app-containerR app-containerWrap">
			<view class="group-warter w-240 my-item tc bg-cyan" @tap="jumpTap1()">
				<u-icon class="text-xl" size="30"  name="../../static/img/icon/zjrw.png"></u-icon>
				<view class="group-title">专检任务</view>
				<!--  -->
	
</template>
<script>
	import {
		lineWork
	} from "@/https/production/proudction.js"
	import {
		bianliShuzu
	} from '../../utils/quanxian.js'
	export default {
		data() {
			return {
				menuList: [{
					code: '070401_specialCheckTask',
					name: '专检',
					show: false,
					ignoreJustice: true,//此属性用于，在菜单中没有配置此选项，此菜单只由于pad显示菜单层级结构
					bgClass: 'bg-mauve',
					children: [{
						icon: '/static/img/icon/zjrw.png',
						code: '070401_specialCheckTask',
						name: '专检任务',
						show: false,
						url: '/pages/production/opTask/index?opType=SpecialCheck',
					}],
				}],
				needWorkSpaceJusticeCode: ['070401_specialCheckTask'],
				// codeList:['pad-zhuanJianRW2014','pad-shiYanRW2015','pad-shengChanHaoCT2016','pad-jianYanCJ2017','pad-jianYanZhaoPianSC2018'],
			};
		},
		onShow(options) {
			if (process.env.NODE_ENV !== 'development') {
				//正式环境下，加入权限控制显示或隐藏菜单
				// updateMenuVisible(this.menuList);
			}
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
		methods: {
			jumpPath(item) {
				if (this.needWorkSpaceJusticeCode.indexOf(item.code) >= 0) {
					lineWork().then(response => {
						if (response.data.id == null) {
							uni.navigateTo({
								url: '/pages/production/opTask/selectWorkSpace?opType=SpecialCheck'
							});
						} else {
							uni.navigateTo({
								url: item.url
							})
						}
					})
				} else {
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