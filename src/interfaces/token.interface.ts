import { Document } from 'mongoose';
import { TokenTypes } from '../config/tokenTypes.enum';
import { UserInterface } from './user.interface';

export interface TokenInterface extends Document {
  token: string;
  user: UserInterface;
  enum: TokenTypes[];
  expires: Date;
  blacklisted: boolean;
}
