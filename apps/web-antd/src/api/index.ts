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
  prevRow?: Recordable<any>,
) {
  let body = { ...params };
  if (prevRow) {
    for (const key in prevRow) {
      const prevVal = prevRow[key];
      const val = body[key];
      let same = prevVal === val;
      if (typeof val == 'object' && val) {
        same = JSON.stringify(val) == JSON.stringify(prevVal);
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
