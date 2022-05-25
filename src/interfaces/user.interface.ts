import { Document } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  foto?: Array<object>;
  strategy: string;
  registered: boolean;
  role?: string;
  isEmailVerified: boolean;
  deletado: boolean;
}

export type IUserRequest = Pick<UserInterface, 'name' | 'email' | 'password'>;
