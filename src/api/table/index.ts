import  request  from "@/utils/axios/index"
import type * as Table from "./types/table"
import * as Login from "@/api/login/types/login";

/** 增 */
export function createTableDataApi(data: Table.CreateTableRequestData) {
  return request.post({url: "table", data})
}

/** 删 */
export function deleteTableDataApi(id: string) {
  return request.delete({url: `table${id}`})
}

/** 改 */
export function updateTableDataApi(data: Table.UpdateTableRequestData) {
  return request.put({url: "table", data})
}

/** 查 */
export function getTableDataApi(params: Table.GetTableRequestData) {
  return request.get({url: "table", params})
}
