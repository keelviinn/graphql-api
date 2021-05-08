export const Upload = `
  scalar Upload
`

export const UploadFile = `
  type UploadFile {
    url: String
  }
`;

export const uploadFile = `
  uploadFile (
    file: Upload
    documentType: String
  ): UploadFile
`

export const fileTypeDefs = `
  ${Upload}
  ${UploadFile}
`;

export const fileMutationsTypeDefs = `
  ${uploadFile}
`;
