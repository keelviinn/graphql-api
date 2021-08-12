const PaginateProps = `
  type PaginateProps {
    totalDocs: Int
    totalPages: Int
    page: Int
    pagingCounter: Int
    limit: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
    prevPage: Int
    nextPage: Int
    hasMore: Boolean
  }
`;

export const paginatePropsTypeDefs = `
  ${PaginateProps}
`;