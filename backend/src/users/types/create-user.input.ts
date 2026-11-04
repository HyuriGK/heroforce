import { UserRole } from '../entities/user-role.enum';

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  character: string;
  role: UserRole;
}
