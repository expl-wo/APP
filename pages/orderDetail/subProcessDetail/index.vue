<template>
  <view class="subProcess-detail-root">
    <van-nav-bar
      title="子工序详情"
      left-arrow
      @tap-left="handleBack"
      class="nav-bar"
    />
    <view class="subProcess-content">
      <view class="subProcess-info">
        <view class="subProcess-name title">
          <view>{{ productionName }}</view>
          <view class="operate-icon">
            <text class="tip" @tap="showTipModal">工序要求</text>
            <image
              src="@/assets/image/add-issue-icon.png"
              alt=""
              @tap="handleAddIssue"
            />
          </view>
        </view>
        <Info :fieldMapText="fieldMapText" :infoObj="subProcessDetailInfo" />
        <van-tabs
          v-model="activeTab"
          line-width="12"
          line-height="4"
          @change="handleChangeTab"
        >
          <van-tab :title="tab.label" v-for="tab in tabList" :key="tab.value">
            <List :listData="listData" @skip="skipSubProcessDetail">
              <view class="progress">
                <Progress />
              </view>
            </List>
          </van-tab>
        </van-tabs>
      </view>
    </view>
    <view class="btn-box">
      <view class="pre-btn"></view>
      <view class="next-btn"></view>
    </view>
  </view>
</template>

<script>
import Progress from "@/components/common/progress.vue";
import Info from "@/components/info.vue";
import List from "@/components/list.vue";
// import { Dialog } from "vant";
export default {
  name: "ProcessDetail",
  components: {
    Progress,
    Info,
    List,
  },
  data() {
    return {
      // 工序详情id
      productionId: "",
      // 字段与文本映射
      fieldMapText: {
        code: { label: "工序编码", iconName: "photo" },
        groupPerson: { label: "组长", iconName: "photo" },
        subGroupPerson: { label: "副组长", iconName: "photo" },
        member: { label: "成员", iconName: "photo" },
        planTime: { label: "计划开工/完工时间", iconName: "photo" },
        realTime: { label: "实际开工/完工时间", iconName: "photo" },
      },
      productionName: "工序名称",
      // 工序详情信息
      subProcessDetailInfo: {
        groupPerson: "司马懿",
        subGroupPerson: "干酒",
        member: "成员",
      },
      // 工序列表数据
      listData: [
        {
          subProcessName: "子工序名称",
          proveStatus: 0,
          percentage: 50,
        },
        {
          subProcessName: "子工序名称",
          proveStatus: 1,
          percentage: 50,
        },
      ],
      // 当前选中的tab
      activeTab: "",
      tabList: [
        {
          label: "全部",
          value: 0,
        },
        {
          label: "未完工",
          value: 1,
        },
        {
          label: "未复核",
          value: 2,
        },
        {
          label: "已完成",
          value: 3,
        },
      ],
      // 工序标准
      tip: "这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准这是标准",
    };
  },
  mounted() {
    this.getProcessId();
  },
  activated() {
    this.getProcessId();
  },
  methods: {
    /**
     * @method getProcessId 获取工序详情id
     **/
    getProcessId() {
      const { id } = this.$route.params;
      if (id || this.productionId) {
        this.productionId = id;
        this.getDetailInfoById();
      } else {
        // 返回上一级路由
        // window.history.go(-1);
      }
    },
    /**
     * @method getDetailInfoById 获取详情信息
     **/
    getDetailInfoById() {
      // 调用接口获取详情及列表数据
    },
    /**
     * @method handleBack 处理导航返回
     **/
    handleBack() {
      window.history.go(-1);
    },
    /**
     * @method getIconByKey 根据字段key获取图标
     * @param {String} 字段key
     **/
    getIconByKey(key) {
      return this.fieldMapText[key].iconName || "";
    },
    /**
     * @method getLabelByKey 根据字段获取label
     * @param {String} 字段key
     **/
    getLabelByKey(key) {
      return this.fieldMapText[key].label || "";
    },
    handleChangeTab(name, title) {
      console.log(name, title, "nam");
      this.getListDataByType();
    },
    showTipModal() {
      // Dialog.alert({
      //   message: this.tip || "暂无内容",
      //   theme: "round-button",
      //   confirmButtonColor: "#3a62d7",
      //   width: "80%",
      // }).then(() => {
      //   console.log("确认");
      // });
    },
    handleAddIssue() {
      // 切换到新增问题页面
    },
    // 获取到列表数据
    getListDataByType() {},
    skipSubProcessDetail(id) {
      this.$router.push({
        name: "subProcessDetail",
        params: { id },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.subProcess-detail-root {
  height: calc(100% - 83rpx);
  background: linear-gradient(
    282deg,
    rgba(209, 225, 246, 0.1) 0%,
    rgba(209, 225, 246, 0.8) 70%
  );
  position: relative;
  .nav-bar {
    background: unset;
  }
  .subProcess-content {
    height: calc(100% - 83rpx);
    margin: 20rpx 16rpx 0rpx;
    background-color: #fff;
    border-radius: 10rpx;
    overflow: hidden;
    .subProcess-info {
      /deep/.van-tabs__line {
        background-color: #3a62d7;
        border-radius: 10rpx;
      }
      .subProcess-name {
        display: flex;
        justify-content: space-between;
        margin: 16rpx 16rpx 12rpx;
        .operate-icon {
          display: flex;
          align-items: center;
          .tip {
            margin-right: 15rpx;
            font-size: 14rpx;
            color: #3a62d7;
            cursor: pointer;
          }
          image {
            cursor: pointer;
          }
        }
      }
    }
  }
  .btn-box {
    position: absolute;
    left: 0;
    bottom: 100rpx;
    width: 100%;
    text-align: center;
    view {
      display: inline-block;
      width: 40rpx;
      height: 40rpx;
      border-radius: 8rpx;
    }
    .disable-btn {
      border: solid 1rpx rgba(58, 98, 215, 0.5);
    }
    .enable-btn {
      background-color: #e3ebfb;
    }
  }
}
</style>
