export * from './core';

import type { Recordable } from '@vben/types';
import { requestClient } from './request';

export const isDev = /localhost/.test(location.host);

let adminBaseUrl = 'https://ice.qs3.fun/v1';
if (isDev) {
  adminBaseUrl = 'http://localhost:6011/v1';
}
adminBaseUrl += '/admin/auth';

export function queryAdmin(table: String, query?: Recordable<any>) {
  return async (params: Recordable<any>, form: Recordable<any>) => {
    const { page, sort } = params || {};
    const body = {
      ...query,
      ...form,
    };
    for (const key in body) {
      if (body[key] === '') delete body[key];
    }
    if (page) {
      body._page = page.currentPage;
      body._limit = page.pageSize;
    }
    if (sort?.order) {
      body._order = `${sort.field} ${sort.order}`;
    }
    return listAdmin(table, body);
  };
}

export async function listAdmin(table: String, params: Recordable<any> | null) {
  return requestClient
    .get<any>(adminBaseUrl + '/list/' + table, {
      params,
    })
    .then((data) => {
      // 返回数据可统一处理
      // console.log(data);
      return data;
    });
}

export async function upsertAdmin(
  table: String,
  params: Recordable<any> | null,
  id?: any,
  oldRow?: Recordable<any>,
) {
  let body = { ...params };
  if (oldRow) {
    for (const key in oldRow) {
      const oldVal = oldRow[key];
      const val = body[key];
      let same = oldVal === val;
      if (typeof val == 'object' && val) {
        same = JSON.stringify(val) == JSON.stringify(oldVal);
      }
      if (same) delete body[key];
    }
  }
  if (params) {
    body.id = id;
  } else {
    body = {
      id,
      _delete: 1,
    };
  }
  return requestClient.post<any>(adminBaseUrl + '/upsert/' + table, body);
}
