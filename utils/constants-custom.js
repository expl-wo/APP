//检修工单对应的状态
const ORDER_STATUS_MAP = [{
		text: '创建工单'
	}, {
		text: '审批完成',
		backgroundColor: '#e3ebfb',
		color: '#3a62d7'
	},
	{
		text: '指派项目经理'
	},
	{
		text: '指派组员'
	},
	{
		text: '现场勘查'
	},
	{
		text: '勘查报告',
		backgroundColor: '#e3ebfb',
		color: '#3a62d7'
	},
	{
		text: '报告审批',
		backgroundColor: '#e3ebfb',
		color: '#3a62d7'
	},
	{
		text: '工序执行',
	},
	{
		text: '竣工报告',
		backgroundColor: '#fbefe9',
		color: "#f64930",
	},
	{
		text: '竣工报告审批',
		backgroundColor: '#e3ebfb',
	},
	{
		text: '返厂检修现场拆解',
	},
	{
		text: '返厂检修厂内拆解'
	},
	{
		text: '厂内生产',
	},
	{
		text: '试验',
	},
	{
		text: '检修报告',
		backgroundColor: '#e3ebfb',
		color: "#3a62d7",
	},
	{
		text: '结束',
		backgroundColor: '#e9ecee ',
		color: "#485b70"
	},
	{
		text: '暂停',
		backgroundColor: '#e9ecee ',
		color: "#485b70",
	},
];


// 勘查、检修卡片展示字段
const CARD_FIELD_MAP = {
	prodNumber: {
		label: "生产号",
		iconName: "photo"
	},
	projManagerName: {
		label: "项目经理",
		iconName: "photo"
	},
	planStartTime: {
		label: "计划开始时间",
		iconName: "photo"
	},
	planEndTime: {
		label: "计划结束时间",
		iconName: "photo"
	},
}

// 问题卡片展示字段
const ISSUE_FILED_MAP = {
	issue: {
		label: "异常项",
		iconName: "photo"
	},
	issueType: {
		label: "问题分类",
		iconName: "photo"
	},
	notifyPerson: {
		label: "通知人",
		iconName: "photo"
	},
	handlePerson: {
		label: "问题处理人",
		iconName: "photo"
	},
	createTime: {
		label: "问题提交时间",
		iconName: "photo"
	},
	memo: {
		label: "问题描述",
		iconName: "photo"
	},
}
// 工单详情信息展示字段
const ORDER_DETAIL_FIELD_MAP = {
	productNo: {
		label: "生产号",
		iconName: "photo"
	},
	projManagerName: {
		label: "项目经理",
		iconName: "photo"
	},
	prodCategory: {
		label: "产品大类",
		iconName: "photo"
	},
	voltageLevel: {
		label: "电压等级",
		iconName: "photo"
	},
	orderStatus: {
		label: "工作状态",
		iconName: "photo"
	},
	planTime: {
		label: "计划开工/完工时间",
		iconName: "photo"
	},
	actualTime: {
		label: "实际开工/完工时间",
		iconName: "photo"
	},
}
// 工单详情信息展示字段
const PROCESS_DETAIL_FIELD_MAP = {
	code: {
		label: "工序编码",
		iconName: "photo"
	},
	groupPerson: {
		label: "组长",
		iconName: "photo"
	},
	subGroupPerson: {
		label: "副组长",
		iconName: "photo"
	},
	member: {
		label: "成员",
		iconName: "photo"
	},
	planTime: {
		label: "计划开工/完工时间",
		iconName: "photo"
	},
	realTime: {
		label: "实际开工/完工时间",
		iconName: "photo"
	},
}

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
	PROCESS_DETAIL_FIELD_MAP
};