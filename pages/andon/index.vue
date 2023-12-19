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
			<view v-show="showList[0]" @click="jumpTap1" class="group-warter my-item w-240 tc bg-blue">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/cf.png"></u-icon>
				<view class="group-title">
					<navigator url="caozuozhe/gongshichaxun">Andon触发</navigator>
				</view>
			</view>
			<view  v-show="showList[1]" class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap2()">
				<u-icon class="text-xl" size="60"  name="../../static/img/icon/xy.png"></u-icon>
				<view class="group-title">Andon响应</view>
			</view>
			<view  v-show="showList[2]" class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap3()">
				<u-icon class="text-xl" size="60" name="../../static/img/icon/bgwtlb.png"></u-icon>
				<view class="group-title">Andon关闭</view>
			</view>
			<view  v-show="showList[3]" class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap4()">
				<u-icon class="text-xl" size="60" name="../../static/img/icon/bgwtlb.png"></u-icon>
				<view class="group-title">班组/部门未关闭安灯</view>
			</view>
		</view>
		
		 <tabbar></tabbar> 
	</view> -->
</template>

<script>
	import { bianliShuzu } from '../../utils/quanxian.js'
	export default {
		// components: { tabbar },
		data() {
			return {
				menuList: [
					{
							code: '0703_Andon',
							name: 'Andon管理',
							show: true,
							ignoreJustice: true,//此属性用于，在菜单中没有配置此选项，此菜单只由于pad显示菜单层级结构
							bgClass: 'bg-blue',
							children: [{
								icon: '/static/img/icon/cf.png',
								code: 'pad-AndonCF2007',
								name: 'Andon触发',
								show: true,
								url: '/pages/andon/andon_002_class',
							}, {
								icon: '/static/img/icon/xy.png',
								code: 'pad-AndonXY2008',
								name: 'Andon响应',
								show: true,
								url: '/pages/andon/andon_004_responseList'
							}, {
								icon: '/static/img/icon/bgwtlb.png',
								code: 'pad-AndonLB2009',
								name: 'Andon关闭',
								show: true,
								url: '/pages/andon/andon_006_problemList'
							}, {
								icon: '/static/img/icon/bgwtlb.png',
								code: 'pad-AndonBZ2006',
								name: '班组/部门未关闭安灯',
								show: true,
								url:'/pages/andon/andon_011_clazzProblemList'
							}],
						}],
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
			jumpPath(subItem) {
				uni.navigateTo({
					url: subItem.url
				});
			}
		}
	}
</script>

<style lang="scss">
</style>
