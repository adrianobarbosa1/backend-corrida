import { Document } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  strategy: string;
  role?: string;
  isEmailVerified: boolean;
  deletado: boolean;
}

export type IUserRequest = Pick<UserInterface, 'name' | 'email' | 'password'>;
