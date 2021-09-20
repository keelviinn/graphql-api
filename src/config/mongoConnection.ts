import mongoose from 'mongoose';

const 
	ENVIRONMENT = process.env.NODE_ENV,
	DB: any = process.env.NODE_ENV == 'production' ? process.env.DATABASE_PROD : process.env.DATABASE_DEV;

export default async function startMongoConnection() {  
  await mongoose.connect(DB, { useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log(`Connection to database successful on ${ENVIRONMENT} enviroment`))
    .catch((err) => console.error(err));
}