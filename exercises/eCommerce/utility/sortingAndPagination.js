function getPaginationAndSorting(query) {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const sort = query.sort ?? null;
  const sortType = query.sortType ?? "ASC";
  console.log(page, "hereeee");
  console.log(limit, "hereeee");

  return {
    ...(limit && { limit }),
    ...(page && limit && { offset: limit * (page - 1) }),
    ...(sort && { order: [[sort, sortType]] }),
  };
}

module.exports = { getPaginationAndSorting };
