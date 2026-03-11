export function getDataUrl(
  baseUrl: string,
  endpoint: string,
  page?: number,
  pageSize?: number,
  searchFields?: string,
  search?: string
) {
  let url = `${baseUrl}${endpoint}?`;

  if (page) {
    url = url.concat(`page=${page}&`);
  }

  if (pageSize) {
    url = url.concat(`pagesize=${pageSize}&`);
  }

  if (searchFields) {
    url = url.concat(`searchfields=${searchFields}&`);
  }

  if (search) {
    url = url.concat(`search=${search}&`);
  }

  const dataUrl = url.substring(0, url.length - 1);

  return dataUrl;
}
