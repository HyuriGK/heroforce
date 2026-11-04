import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from './entities/user-role.enum';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: JwtPayload) {
    const currentUser = await this.usersService.findById(user.sub);

    if (!currentUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.usersService.toPublicUser(currentUser);
  }

  @Get('heroes')
  @Roles(UserRole.ADMIN)
  async findHeroes() {
    return this.usersService.findHeroes();
  }
}
