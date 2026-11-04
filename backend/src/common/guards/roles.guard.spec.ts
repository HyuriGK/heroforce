import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '../../users/entities/user-role.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector;
  const guard = new RolesGuard(reflector);

  function createContext(role?: UserRole) {
    return {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: role
            ? {
                sub: '20e168d0-5fdb-4c58-9833-15f44fb596dc',
                email: 'hero@example.com',
                role,
              }
            : undefined,
        }),
      }),
    } as never;
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows routes with no role requirement', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    expect(guard.canActivate(createContext(UserRole.HERO))).toBe(true);
  });

  it('allows administrators on admin-only routes', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      UserRole.ADMIN,
    ]);

    expect(guard.canActivate(createContext(UserRole.ADMIN))).toBe(true);
  });

  it('rejects heroes on admin-only routes', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      UserRole.ADMIN,
    ]);

    expect(() => guard.canActivate(createContext(UserRole.HERO))).toThrow(
      ForbiddenException,
    );
  });
});
