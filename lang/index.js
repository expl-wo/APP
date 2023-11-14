// 国际化 json 文件，文件内容详见下面的示例
import zh from './zh.js'
const messages = {
	'zh': zh,
}

let i18nConfig = {
  locale: 'zh',// 获取已设置的语言
  messages,
  silentTranslationWarn: true
}

export default i18nConfig