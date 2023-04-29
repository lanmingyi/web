// import { request } from "@/utils/service"
import  request  from "@/utils/axios/index"
import type * as Login from "./types/login"

/** 获取登录验证码 */
export function getLoginCodeApi(param: any){
  let url = `/sys/randomImage/${param}`
  return request.get<Login.LoginCodeResponseData>({url: url,})
}

/** 登录并返回 Token 、用户信息、部门、字典*/
export function loginApi(data: Login.LoginRequestData) {
  return request.post<Login.LoginResponseData>({url: "sys/login", data})
}

/** 获取用户权限 */
export function getUserPermissionByToken() {
  return request.get<Login.UserPermissionResponseData>({url: "sys/permission/getUserPermissionByToken"})
}
