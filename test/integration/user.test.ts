// import User from '../../src/models/user/user.schema';
// import { clearDatabase, closeDatabase, connect } from '../db';
// import startServer from '@src/config/apolloServer';

// beforeAll(async () => await connect());
// afterEach(async () => await clearDatabase());
// afterAll(async () => await closeDatabase());

// describe('addUser resolver', () => {
//   const ADD_USER = `
//     mutation addUser($addUserName: String, $addUserEmail: String, $addUserPassword: String) {
//       addUser(name: $addUserName, email: $addUserEmail, password: $addUserPassword) {
//         _id
//         name
//         email
//       } 
//     }
//   `;
  
//   it('Should add user in DB if args are correct', async () => {
//     const variables = { addUserName: "Kelvin", addUserEmail: "teste@teste.com.br", addUserPassword: "123456" }
//     const result = await (await startServer()).server.executeOperation({ query: ADD_USER, variables })

//     expect(result.errors).toBeUndefined();
//     expect(result?.data?.addUser?.name).toEqual(variables.addUserName)
//     expect(result?.data?.addUser?.email).toEqual(variables.addUserEmail)
//   });

//   it('Should return error if email already exists in DB', async () => {
//     const variables = { addUserName: "Kelvin", addUserEmail: "teste@teste.com.br", addUserPassword: "123456" }
//     const user = new User({ name: variables.addUserName, email: variables.addUserEmail });
//     await user.save();
//     const result = await (await startServer()).server.executeOperation({ query: ADD_USER, variables });

//     expect(result.errors?.[0].message).toMatch('User already exists!');
//   });

//   it('Should return error if password wasn`t provided', async () => {
//     const variables = { addUserName: "Kelvin", addUserEmail: "teste@teste.com.br" }
//     const result = await (await startServer()).server.executeOperation({ query: ADD_USER, variables });

//     expect(result.errors?.[0].message).toMatch("Password wasn`t provided!");
//   });
// });

// describe('updateUser resolver', () => {
//   const UPDATE_USER = `
//     mutation updateUser($updateUserId: String, $updateUserName: String) {
//       updateUser(_id: $updateUserId, name: $updateUserName) {
//         _id
//         name
//         email
//       }
//     }
//   `;
  
//   it('Should return error if client doesn`t provide _id', async () => {
//     const variables = { updateUserName: "Client teste" }

//     const user = new User({ name: "Kelvin", email: "teste@teste.com.br", password: "123456" });
//     await user.save();

//     const result = await (await startServer()).server.executeOperation({ query: UPDATE_USER, variables })

//     expect(result.errors?.[0].message).toMatch("_id must be provided!");
//   });

//   it('Should return error if user doesn`t exists', async () => {
//     const variables = { updateUserName: "Client teste", _id: "1213414141" }

//     const user = new User({ name: "Kelvin", email: "teste@teste.com.br", password: "123456" });
//     await user.save();

//     const result = await (await startServer()).server.executeOperation({ query: UPDATE_USER, variables })

//     expect(result.errors?.[0].message).toMatch("user not found");
//   });
// });