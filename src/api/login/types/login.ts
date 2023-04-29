export interface LoginRequestData {
    /** admin 或 editor */
    username: "admin" | "editor"
    /** 密码 */
    password: string
    /** 验证码 */
    captcha: string,
    checkKey: number
}

export type LoginCodeResponseData = ApiResponseData<string>

export type LoginResponseData = ApiResponseData<{ token: string, username: string, userInfo: Record<string, any> }>

export type UserPermissionResponseData = ApiResponseData<{ menu: string[]; roles: string[] }>
