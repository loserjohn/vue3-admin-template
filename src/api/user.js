/*
 * @Author       : xh
 * @Date         : 2022-05-12 17:58:34
 * @LastEditors  : xh
 * @LastEditTime : 2022-05-12 20:23:44
 * @FilePath     : \vue3-admin-template\src\api\user.js
 */
import request from '@/utils/axiosReq'

export function loginReq(data) {
  return request({
    url: '/login',
    data,
    method: 'post',
    bfLoading: false,
    isParams: true,
    isAlertErrorMsg: false,
    isNeedUpdateToken:true
  })
}

export function getInfoReq() {
  return request({
    url: '/userInfo',
    bfLoading: false,
    method: 'post',
    isAlertErrorMsg: false
  })
}

export function logoutReq() {
  return request({
    url: '/loginOut',
    method: 'get'
  })
}
