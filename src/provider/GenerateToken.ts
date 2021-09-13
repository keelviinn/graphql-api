import { sign } from 'jsonwebtoken';

const appSecret: any = process.env.APP_SECRET

class GenerateToken {
  generate(userDetails: any, userId: string): string | any {
    try {
      return sign({...userDetails }, appSecret, { subject: userId.toString(), expiresIn: 60 * 15 });      
    } catch (error) {
      console.error(error)
    }
  }
}

export { GenerateToken }