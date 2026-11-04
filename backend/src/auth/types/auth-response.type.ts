import { PublicUser } from '../../users/types/public-user.type';

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  user: PublicUser;
}
