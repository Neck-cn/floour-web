/*
包含n个接口请求函数的模块
函数的返回值: promise对象
 */
import ajax from './ajax'
// const BASE_URL = 'http://localhost:4000'
const BASE_URL = 'http://collar.fun:1234'

// 1.获取所有商铺信息
export const reqFindShops = (currentPage, pageSize, search) => {
  return ajax(`${BASE_URL}/shops/findShops/${currentPage}/${pageSize}`, {search}, 'POST', 'application/x-www-form-urlencoded')
};
// 2.添加商铺
export const reqAddShop = (name, image, place) => {
  return ajax(`${BASE_URL}/shops/addShops`, {name, image, place}, 'POST')
};
// 3.删除商铺
export const reqDeleteShop = (sid) => {
  return ajax(`${BASE_URL}/shops/deleteShops`, {sid}, 'POST', 'application/x-www-form-urlencoded')
};
// 4.修改商铺信息
export const reqModifyShop = (sid, name, image, place) => {
  return ajax(`${BASE_URL}/admin/answer/add`, {sid, name, image, place}, 'POST')
};
// 5.根据sid获取商铺信息
export const reqGetShopBySid = (sid) => {
  return ajax(`${BASE_URL}/shops/getShopsinfoBySid`, {sid}, 'POST', 'application/x-www-form-urlencoded')
};
// 6.添加送货记录
export const reqAddGoodsRecord = (sid, sname, time, price, goods, quantity, account, type) => {
  return ajax(`${BASE_URL}/goodsRecord/addGoodsRecord`, {
    sid,
    sname,
    time,
    price,
    goods,
    quantity,
    account,
    type
  }, 'POST')
};
// 7.根据店铺id查询送货记录
export const reqFindGoodsRecord = (sid, page, pageSize) => {
  return ajax(`${BASE_URL}/goodsRecord/getGoodsRecord/${page}/${pageSize}`, {sid}, 'POST', 'application/x-www-form-urlencoded')
};
// 8.根据送货记录id修改送货记录
export const reqModifyGoodsRecord = (gid, sid, sname, time, price, goods, quantity, account) => {
  return ajax(`${BASE_URL}/goodsRecord/modifyGoodsRecord`, {
    gid,
    sid,
    sname,
    time,
    price,
    goods,
    quantity,
    account
  }, 'POST')
};
// 9.根据送货记录id删除送货记录
export const reqDeleteGoodsRecord = (gid) => {
  return ajax(`${BASE_URL}/goodsRecord/modifyGoodsRecord`, {gid}, 'POST', 'application/x-www-form-urlencoded')
};
// 10.根据送货时间查询送货记录
export const reqGetGoodsRecordByTime = (start_time, end_time, type, page, pageSize) => {
  return ajax(`${BASE_URL}/goodsRecord/getGoodsRecordByTime/${page}/${pageSize}`, {
    start_time,
    end_time,
    type
  }, 'POST', 'application/x-www-form-urlencoded')
};
// 11.根据送货时间查询送货记录总数
export const reqGetGoodsRecordCountByTime = (start_time, end_time, type) => {
  return ajax(`${BASE_URL}/goodsRecord/getGoodsRecordCountByTime`, {
    start_time,
    end_time,
    type
  }, 'POST', 'application/x-www-form-urlencoded')
};
//todo 12.文件上传
export const reqUploadFile = () => {
  return ajax(`${BASE_URL}/admin/appErr/appError/clear`, {}, 'POST', 'application/x-www-form-urlencoded')
};







