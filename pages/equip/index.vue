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

	<!-- 	<view class="content">
		<view class="app-containerR app-containerWrap">
			<view v-show="showList[2]" class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap3()">
				<u-icon class="text-xl" size="60" name="../../static/img/icon/em_dj.svg"></u-icon>
				<view class="group-title">设备点检</view>
			</view>
			 	<view v-show="showList[0]" class="group-warter w-240 tc my-item bg-blue" @tap="jumpTap1()">
				<u-icon class="text-xl" size="60" name="../../static/img/icon/em_003.svg"></u-icon>
				<view class="group-title">设备保养</view>
			</view> 
			<view v-show="showList[1]" class="group-warter w-240 my-item tc bg-blue" @tap="jumpTap2()">
				<u-icon class="text-xl" size="60" name="../../static/img/icon/em_004.svg"></u-icon>
				<view class="group-title">设备维修</view>
			</view> 
						<view v-show="showList[3]" class="group-warter w-240 my-item tc bg-blue" @tap="jumpTap4()">
				<u-icon class="text-xl" size="60" name="../../static/img/icon/em_004.svg"></u-icon>
				<view class="group-title">设备鉴定</view>
			</view> 
		</view>
	</view> -->
</template>

<script>
	import {
		bianliShuzu
	} from '@/utils/quanxian.js'
	export default {
		data() {
			return {
				menuList: [{
						code: '070101_check',
						name: '设备点检',
						show: false,
						bgClass: 'bg-purple',
						children: [{
							icon: '/static/img/icon/em_qtdj.svg',
							code: '07010101_dailyCheck',
							show: false,
							name: '日常点检',
							url: '/pages/equip/equipCheck/dailyCheck',
						}, {
							icon: '/static/img/icon/zydj.svg',
							code: '07010102_proCheck',
							name: '专业点检',
							show: false,
							url: '/pages/equip/equipCheck/specialityCheck',
						}],
					}, 
					{
						code: '070102_maintenance',
						name: '设备保养',
						show: false,
						bgClass: 'bg-blue',
						children: [{
							icon: '/static/img/icon/em_qtdj.svg',
							code: '07010201_dailyMaintenance',
							name: '日常保养',
							show: false,
							url: '/pages/equip/equipMaintenance/maintenanceTask?type=2&isAccept=0',
						}, {
							icon: '/static/img/icon/zydj.svg',
							code: '07010202_proMaintenance',
							name: '定期保养',
							show: false,
							url: '/pages/equip/equipMaintenance/maintenanceTask?type=1&isAccept=0',
						}, {
							icon: '/static/img/icon/syrw.png',
							code: '07010203_maintenanceApply',
							name: '保养验收',
							show: false,
							url: '/pages/equip/equipMaintenance/maintenanceTask?type=1&isAccept=1',
						}],
					}, 
					{
						code: '070103_equipRepair',
						name: '设备维修',
						show: false,
						bgClass: 'bg-cyan',
						children: [{
							icon: '/static/img/icon/bxrgl.svg',
							code: '07010301_report',
							name: '报修管理',
							show: false,
							url: '/pages/equip/equipRepair/reportManager/index',
						}, {
							icon: '/static/img/icon/wxrgl.svg',
							code: '07010302_repair',
							name: '维修管理',
							show: false,
							url: '/pages/equip/equipRepair/repairManager/index',
						}],
					},
					{
						code: '070104_identification',
						name: '设备鉴定',
						show: false,
						bgClass: 'bg-blue',
						children: [
							{
								icon: '/static/img/icon/zydj.svg',
								code: '07010401_integrityAppraisalTask',
								name: '鉴定任务',
								show: false,
								url: '/pages/equip/equipIntegrityAppraisal/IntegrityAppraisalTask',
							}
						],
					},
				],
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