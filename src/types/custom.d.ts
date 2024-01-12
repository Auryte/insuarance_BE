import { Token } from './auth';

declare global {
  namespace Express {
    interface Request {
      ctx: Token;
    }
  }
}
