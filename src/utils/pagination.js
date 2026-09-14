const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const getPagination = (page, limit) => {
  const parsedPage = Math.max(parseInt(page, 10) || DEFAULT_PAGE, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    offset,
  };
}

const getTotalPage = (total, limit) => {
  if (limit <= 0) return 0;

  return Math.ceil(total / limit);
}

const buildPaginationMeta = (total, page, limit) => {
  return {
    page,
    limit,
    total,
    totalPage: getTotalPage(total, limit),
  };
}

module.exports = {
  getPagination,
  getTotalPage,
  buildPaginationMeta,
};
