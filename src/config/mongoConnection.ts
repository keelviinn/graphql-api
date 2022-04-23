import mongoose from 'mongoose';

const 
	ENVIRONMENT = process.env.ENVIRONMENT,
	DB: any = process.env.ENVIRONMENT == 'production' ? process.env.DATABASE_PROD : process.env.DATABASE_DEV;

export default async function startMongoConnection() {  
  await mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log(`Connection to database successful on ${ENVIRONMENT} enviroment`))
    .catch((err) => console.error(err));
}