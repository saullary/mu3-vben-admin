export * from './core';

import type { Recordable } from '@vben/types';
import { requestClient } from './request';

let adminBaseUrl = 'https://ice.qs3.fun/v1';
adminBaseUrl = 'http://localhost:6011/v1';

export function queryAdmin(table: String, query?: Recordable<any>) {
  return async (params: Recordable<any>, form: Recordable<any>) => {
    const { page, sort } = params || {};
    const body = {
      ...query,
      ...form,
    };
    if (page) {
      body._page = page.currentPage;
      body._limit = page.pageSize;
    }
    if (sort?.order) {
      body._order = `${sort.field} ${sort.order}`;
    }
    return requestClient
      .get<any>(adminBaseUrl + '/admin/list/' + table, {
        params: body,
      })
      .then((data) => {
        // 返回数据可统一处理
        console.log(data);
        return data;
      });
  };
}

export async function upsertAdmin(
  table: String,
  params: Recordable<any> | null,
  id?: any,
) {
  let body = { ...params };
  if (params) {
    body.id = id;
  } else {
    body = {
      id,
      _delete: 1,
    };
  }
  return requestClient.post<any>(adminBaseUrl + '/admin/upsert/' + table, body);
}
