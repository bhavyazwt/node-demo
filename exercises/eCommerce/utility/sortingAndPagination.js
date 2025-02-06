function getPaginationAndSorting(query) {
  const limit = Number(query.limit) ?? null;
  const page = Number(query.page) ?? null;
  const sort = query.sort ?? null;
  const sortType = query.sortType ?? "ASC";

  return {
    ...(limit && { limit }),
    ...(page && limit && { offset: limit * (page - 1) }),
    ...(sort && { order: [[sort, sortType]] }),
  };
}

module.exports = { getPaginationAndSorting };
