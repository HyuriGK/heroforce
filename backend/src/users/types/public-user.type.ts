import { UserRole } from '../entities/user-role.enum';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  character: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
