import constants from "./constants";

//检修工单对应的状态
const ORDER_STATUS_MAP = [
  {
    text: "创建工单",
  },
  {
    text: "审批完成",
    backgroundColor: "#e3ebfb",
    color: "#3a62d7",
  },
  {
    text: "指派项目经理",
  },
  {
    text: "指派组员",
  },
  {
    text: "现场勘查",
  },
  {
    text: "勘查报告",
    backgroundColor: "#e3ebfb",
    color: "#3a62d7",
  },
  {
    text: "报告审批",
    backgroundColor: "#e3ebfb",
    color: "#3a62d7",
  },
  {
    text: "工序执行",
  },
  {
    text: "竣工报告",
    backgroundColor: "#fbefe9",
    color: "#f64930",
  },
  {
    text: "竣工报告审批",
    backgroundColor: "#e3ebfb",
  },
  {
    text: "返厂检修现场拆解",
  },
  {
    text: "返厂检修厂内拆解",
  },
  {
    text: "厂内生产",
  },
  {
    text: "试验",
  },
  {
    text: "检修报告",
    backgroundColor: "#e3ebfb",
    color: "#3a62d7",
  },
  {
    text: "结束",
    backgroundColor: "#e9ecee ",
    color: "#485b70",
  },
  {
    text: "暂停",
    backgroundColor: "#e9ecee ",
    color: "#485b70",
  },
];

// 勘查、检修卡片展示字段
const CARD_FIELD_MAP = {
  prodNumber: {
    label: "生产号",
    iconName: "file-text-fill",
  },
  projManagerName: {
    label: "项目经理",
    iconName: "account-fill",
  },
  planStartTime: {
    label: "计划开始时间",
    iconName: "calendar",
  },
  planEndTime: {
    label: "计划结束时间",
    iconName: "calendar",
  },
};

// 问题卡片展示字段
const ISSUE_FILED_MAP = {
  abnormalName: {
    label: "异常项",
    iconName: "list",
  },
  cateName: {
    label: "问题分类",
    iconName: "list",
  },
  notifierName: {
    label: "通知人",
    iconName: "account-fill",
  },
  reporterName: {
    label: "问题处理人",
    iconName: "account-fill",
  },
  reporterDate: {
    label: "问题提交时间",
    iconName: "calendar",
  },
  problemDesc: {
    label: "问题描述",
    iconName: "edit-pen-fill",
  },
};
// 工单详情信息展示字段
const ORDER_DETAIL_FIELD_MAP = {
  productNo: {
    label: "生产号",
    iconName: "file-text-fill",
  },
  projManagerName: {
    label: "项目经理",
    iconName: "account-fill",
  },
  prodCategory: {
    label: "产品大类",
    iconName: "list",
  },
  voltageLevel: {
    label: "电压等级",
    iconName: "warning-fill",
  },
  orderStatus: {
    label: "工作状态",
    iconName: "server-man",
  },
  planTime: {
    label: "计划开工/完工时间",
    iconName: "calendar",
  },
  actualTime: {
    label: "实际开工/完工时间",
    iconName: "calendar",
  },
};
// 工单详情信息展示字段
const PROCESS_DETAIL_FIELD_MAP = {
  code: {
    label: "工序编码",
    iconName: "file-text-fill",
  },
  groupPerson: {
    label: "组长",
    iconName: "account-fill",
  },
  subGroupPerson: {
    label: "副组长",
    iconName: "account-fill",
  },
  member: {
    label: "成员",
    iconName: "account-fill",
  },
  planTime: {
    label: "计划开工/完工时间",
    iconName: "calendar",
  },
  realTime: {
    label: "实际开工/完工时间",
    iconName: "calendar",
  },
};

// 标准工序详情
const WORK_ORDER_FIELD_MAP = {
  code: {
    label: "工序编码",
    iconName: "file-text-fill",
  },
  groupPerson: {
    label: "组长",
    iconName: "account-fill",
  },
  subGroupPerson: {
    label: "副组长",
    iconName: "account-fill",
  },
  member: {
    label: "成员",
    iconName: "account-fill",
  },
};
// 工序状态
const WORK_STATUS_MAP = {
  0: {
    label: "未派工",
    color: "#f60000",
  },
  1: {
    label: "未开工",
    color: "#f64930",
  },
  2: {
    label: "已开工",
    color: "#3a62d7",
  },
  5: {
    label: "已完工",
    color: "#17aa81",
  },
};
const UPLOAD_LIMIT = {
  image: {
    label: "图片",
    maxSize: 20 * 1024 * 1024,
    acceptType: ["image/jpg", "image/jpeg", "image/png"],
  },
  video: {
    label: "视频",
    maxSize: 200 * 1024 * 1024,
  },
};
const BOM_STATUS = {
  0: "待入库",
  1: "已入库",
};
const MESSAGE_TYPE = {
  1: "任务通知",
  2: "超时通知",
};
const CLOCKIN_STATUS = [
  {
    name: "在公司",
    value: 1,
  },
  {
    name: "休假中",
    value: 2,
  },
  {
    name: "去现场",
    value: 3,
  },
  {
    name: "现场",
    value: 4,
  },
  {
    name: "返程中",
    value: 5,
  },
];

const WORK_ORDER_STATUS = {
  0: "未派工",
  1: "已开工",
  2: "未开工",
  3: "已完工",
};
export {
  //检修工单对应的状态
  ORDER_STATUS_MAP,
  // 检修、勘查卡片展示字段
  CARD_FIELD_MAP,
  // 问题卡片展示字段
  ISSUE_FILED_MAP,
  // 工单详情展示字段
  ORDER_DETAIL_FIELD_MAP,
  // 工单详情信息展示字段
  PROCESS_DETAIL_FIELD_MAP,
  // 标准工序详情
  WORK_ORDER_FIELD_MAP,
  // 工序状态
  WORK_STATUS_MAP,
  // 图片、视频大小限制
  UPLOAD_LIMIT,
  // BOM状态
  BOM_STATUS,
  // 消息类型
  MESSAGE_TYPE,
  // 打卡状态
  CLOCKIN_STATUS,
  // 工单状态
  WORK_ORDER_STATUS,
};