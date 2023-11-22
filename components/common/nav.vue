<template>
  <van-tabbar v-model="activeIndex" @change="handleNavChange">
    <van-tabbar-item
      :icon="item.iconName"
      :key="index"
      v-for="(item, index) in navList"
    >
      {{ item.label }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: "Nav",
  data() {
    return {
      // 导航列表
      navList: [
        {
          name: "home",
          label: "首页",
          iconName: "wap-home-o",
        },
        {
          name: "staging",
          label: "工作台",
          iconName: "comment",
        },
        {
          name: "userCenter",
          label: "我的",
          iconName: "manager",
        },
      ],
      // 当前选中导航下标
      activeIndex: 0,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        // 根据路由反选中导航栏
        const navNameList = this.navList.map((item) => item.name);
        const idx = navNameList.indexOf(route.name);
        this.activeIndex = idx > -1 ? idx : 1;
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * @method handleNavChange 处理导航切换
     * @param {Object} 导航对应下标
     **/
    handleNavChange(index) {
      const route = this.navList[index];
      this.$router.push({ name: route.name || "home" });
    },
  },
};
</script>

<style lang="less" scoped>
.van-tabbar {
  height: 83px;
  background-color: #fff;
  box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.05);
}
</style>
