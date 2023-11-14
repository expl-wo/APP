/**
 * Created by fp on 2018/8/30.
 */
import dictHttp from "@/https/sys/dict";
import request from '@/utils/request.js'
const cacheMap = {};

// 翻译，根据key value 翻译得到text  如 把 0 翻译成男
export const transformDictDetail = async function (key, value, reload=false) {
  if (value === undefined || value === null) {
    return ''
  }
  value = value.toString();
  let retValue = ''
  let dictList = await getDictListByKey(key, value, reload)
  if (dictList && dictList.length > 0) {
    if (value.toString().indexOf(',') !== -1) {
      let valArr = value.split(',')
      let lenOfValArr = valArr && valArr.length ? valArr.length : 0
      let lenOfDictList = dictList && dictList.length ? dictList.length : 0
      for (let j = 0; j < lenOfValArr; j++) {
        for (let i = 0; i < lenOfDictList; i++) {
          const item = dictList[i]
          if (item.code == valArr[j]) {
            retValue += item.name
            break
          }
        }
        retValue += (j !== lenOfValArr - 1 ? ',' : '')
      }
    } else {
      for (let i = 0, len = dictList.length; i < len; i++) {
        const item = dictList[i]
        if (item.code == value) {
          retValue = item.name
          break
        }
      }
    }
  }
  if(retValue === ''){
    retValue = value;
  }
  return retValue
};

// 根据key 获取列表
export const getDictListByKey = async function (key, clone=false, reload=false) {
	if(reload){//是否重新加载
		delete cacheMap[key];
	}
  if (!cacheMap[key]) {
    cacheMap[key] = await getDict(key)
  }
  if(clone){
    let sourceData =  cacheMap[key] ? cacheMap[key] : [];
    return uni.$u.deepClone(sourceData);
  }else{
    return cacheMap[key] ? cacheMap[key] : []
  }
}

export const deleteDictItem = function (itemCode) {
  delete cacheMap[itemCode];
};


async function  getDict(key) {
  if (dictData[key]) {
    return dictData[key]
  }
  let response = await request({
  	url: dictHttp.url.queryDictItems,
  	method: 'post',
  	//部署后要删除此行
  	data: {
      itemCode: key
    }
  })
  return response.data;
}

// 前端写死的字典数据
const dictData = {}

dictData['yn'] = [
  {
    code: 'y',
    name: '是'
  },
  {
    code: 'n',
    name: '否'
  }]
