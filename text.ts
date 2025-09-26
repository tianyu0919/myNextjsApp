// 定义公共参数类型
interface CommonParams {
  id_list?: string;
  id_type?: string;
  page_index?: string;
  page_size?: string;
}

/**
 * 定义可选参数的基础类型
 */
type OptionalParams = {
  book_id?: string;
  book_name?: string;
  compass_id?: string;
  roles?: string;
};

/**
 * 创建必须提供特定字段的类型辅助函数
 */
type RequireExactlyOne<T, K extends keyof T> = {
  [P in K]: Required<Pick<T, P>> & Partial<Omit<T, P>>;
}[K];

/**
 * GetCidListParams 类型定义
 * 必须提供以下四个参数中的任意一个：book_id、book_name、compass_id、roles
 */
export type GetCidListParams = RequireExactlyOne<OptionalParams, 'book_id' | 'book_name' | 'compass_id' | 'roles'> & CommonParams;

type RequestP = (method: string, url: string, params: any) => Promise<any>;

const requestP: RequestP = (method, url, params) => {
  return fetch(url, {
    method,
    body: JSON.stringify(params),
  });
};

export const getCidList = (params: GetCidListParams) => {
  return requestP("get", "/cid/list", params);
};
