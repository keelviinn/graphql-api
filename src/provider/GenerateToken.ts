import { sign } from 'jsonwebtoken';

const appSecret: any = process.env.APP_SECRET

class GenerateToken {
  execute(userId: string): string {
    return sign({}, appSecret, { subject: userId.toString(), expiresIn: '7d' });
  }
}

export { GenerateToken }