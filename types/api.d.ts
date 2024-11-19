/** 所有 api 接口的响应数据都应该准守该格式 */
interface ApiResponseData<T> {
  code: number
  data: T  // data、result应该只保留一个
  result: T
  message: string,
}
