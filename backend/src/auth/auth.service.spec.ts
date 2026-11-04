import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserRole } from '../users/entities/user-role.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  const user = {
    id: 'fcb0f085-92cf-4bb2-9fb1-22059298d3c1',
    name: 'Carol Danvers',
    email: 'carol@example.com',
    passwordHash: 'hashed-password',
    character: 'Capitã Marvel',
    role: UserRole.HERO,
    createdAt: new Date('2026-11-04T00:00:00.000Z'),
    updatedAt: new Date('2026-11-04T00:00:00.000Z'),
  } as User;
  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    character: user.character,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  const usersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    findById: jest.fn(),
    toPublicUser: jest.fn(),
  } as unknown as UsersService;
  const jwtService = {
    sign: jest.fn(),
  } as unknown as JwtService;
  const configService = {
    get: jest.fn((_key: string, defaultValue: number) => defaultValue),
  } as unknown as ConfigService;
  const bcryptHash = jest.mocked(bcrypt.hash);
  const bcryptCompare = jest.mocked(bcrypt.compare);
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(usersService, jwtService, configService);
    (usersService.toPublicUser as jest.Mock).mockReturnValue(publicUser);
    (jwtService.sign as jest.Mock).mockReturnValue('signed-token');
  });

  it('registers a hero with a hashed password and returns a JWT', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    bcryptHash.mockResolvedValue('hashed-password' as never);
    (usersService.create as jest.Mock).mockResolvedValue(user);

    await expect(
      authService.register({
        name: 'Carol Danvers',
        email: 'carol@example.com',
        password: 'secure-password',
        character: 'Capitã Marvel',
      }),
    ).resolves.toEqual({
      accessToken: 'signed-token',
      tokenType: 'Bearer',
      user: publicUser,
    });

    expect(bcryptHash).toHaveBeenCalledWith('secure-password', 12);
    expect(usersService.create).toHaveBeenCalledWith({
      name: 'Carol Danvers',
      email: 'carol@example.com',
      passwordHash: 'hashed-password',
      character: 'Capitã Marvel',
      role: UserRole.HERO,
    });
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: UserRole.HERO,
    });
  });

  it('rejects duplicated e-mails during registration', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(user);

    await expect(
      authService.register({
        name: 'Carol Danvers',
        email: user.email,
        password: 'secure-password',
        character: user.character,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('does not reveal whether invalid login credentials belong to a user', async () => {
    (usersService.findByEmailWithPassword as jest.Mock).mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'unknown@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('authenticates valid credentials and returns a JWT', async () => {
    (usersService.findByEmailWithPassword as jest.Mock).mockResolvedValue(user);
    bcryptCompare.mockResolvedValue(true as never);

    await expect(
      authService.login({
        email: user.email,
        password: 'secure-password',
      }),
    ).resolves.toMatchObject({
      accessToken: 'signed-token',
      user: publicUser,
    });
  });
});
