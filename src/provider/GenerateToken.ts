import { sign } from 'jsonwebtoken';

const appSecret: any = process.env.APP_SECRET

class GenerateToken {
  execute(userDetails: any, userId: string): string {
    console.log(userDetails)
    return sign({...userDetails}, appSecret, { subject: userId.toString(), expiresIn: '7d' });
  }
}

export { GenerateToken }