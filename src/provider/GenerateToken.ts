import { AuthenticationError } from 'apollo-server-express';
import { add } from 'date-fns';
import { sign, verify } from 'jsonwebtoken';

const appSecret: any = process.env.APP_SECRET

class GenerateToken {
  generate(userDetails: any, userId: string): string {
    return sign({...userDetails }, appSecret, { subject: userId.toString(), expiresIn: 60 * 15 });
  }
}

export { GenerateToken }