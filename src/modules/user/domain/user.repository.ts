import { User } from './user.entity.js';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
  updateProfile(id: string, data: { username?: string; displayName?: string }): Promise<void>;
  updatePassword(id: string, passwordhash: string): Promise<void>;
  updateLastLogin(id: string): Promise<void>;
}
