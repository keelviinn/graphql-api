export const Showcase = `
  type Showcase {
    _id: String
    name: String
    products: [Product]
    percent: Int
    coverURL: String
    createdAt: String
    updatedAt: String
  }
`;

export const ShowcaseResult = `
  type ShowcaseResult {
    list: [Showcase]
    totalPages: Int
    totalCount: Int
  }
`;

export const showcases = `
  showcases: ShowcaseResult
`

export const showcase = `
  showcase(_id: String): Showcase
`

export const addShowcase = `
  addShowcase(
    name: String
    products: [String]
    percent: Float
    coverURL: String
  ): Showcase
`

export const updateShowcase = `
  updateShowcase(
    _id: String
    name: String
    products: [String]
    percent: Float
    coverURL: String
  ): Showcase
`

export const removeShowcase = `
  removeShowcase(_id: String): Boolean
`

export const showcaseTypeDefs = `
  ${Showcase}
  ${ShowcaseResult}
`;

export const showcaseQueries = `
  ${showcases}
  ${showcase} 
`;

export const showcaseMutations = `
  ${addShowcase}
  ${updateShowcase}
  ${removeShowcase}
`;