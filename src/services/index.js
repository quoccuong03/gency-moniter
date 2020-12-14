import requestService from './request'

export const all = (
  path,
  { page = 1, perPage = 10, sortBy = 'created_at', orderBy = 'desc' },
  filter = {}
) => {
  const input = {
    order_by: `${sortBy}-${orderBy}`,
    limit: perPage,
    page,
  }

  if (filter && !filter.status) {
    filter.status = 'all'
  }

  return requestService.send({
    method: 'get',
    path,
    query: { ...input, ...filter },
  })
}

export const view = (path) => {
  return requestService.send({
    method: 'get',
    path,
  })
}

export const add = (path, data , query={}) => {
  return requestService.send({
    method: 'post',
    path,
    data,
    query
  })
}

export const update = (path, data , query={}) => {
  return requestService.send({
    method: 'put',
    path,
    data,
    query,
  })
}

export const remove = (path) => {
  return requestService.send({
    method: 'delete',
    path,
  })
}


