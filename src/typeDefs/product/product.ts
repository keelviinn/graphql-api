export const Product = `
  type Product {
    _id: String
    name: String
    price: Float
    coverURL: String
    createdAt: String
    updatedAt: String
  }
`;

export const ProductResult = `
  type ProductResult {
    list: [Product]
    totalPages: Int
    totalCount: Int
  }
`;

export const products = `
  products: ProductResult
`

export const product = `
  product(_id: String): Product
`

export const addProduct = `
  addProduct(
    name: String
    price: Float
    coverURL: String
  ): Product
`

export const updateProduct = `
  updateProduct(
    _id: String
    name: String
    price: Float
    coverURL: String
  ): Product
`

export const removeProduct = `
  removeProduct(_id: String): Boolean
`

export const productTypeDefs = `
  ${Product}
  ${ProductResult}
`;

export const productQueries = `
  ${products}
  ${product} 
`;

export const productMutations = `
  ${addProduct}
  ${updateProduct}
  ${removeProduct}
`;