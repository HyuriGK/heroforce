import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from './entities/user-role.enum';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Retorna o perfil do usuário autenticado.' })
  @ApiOkResponse({ description: 'Perfil do usuário.' })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido ou expirado.',
  })
  async me(@CurrentUser() user: JwtPayload) {
    const currentUser = await this.usersService.findById(user.sub);

    if (!currentUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.usersService.toPublicUser(currentUser);
  }

  @Get('heroes')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Lista heróis elegíveis como responsáveis.' })
  @ApiOkResponse({ description: 'Lista de heróis cadastrados.' })
  @ApiForbiddenResponse({ description: 'A operação exige um administrador.' })
  async findHeroes() {
    return this.usersService.findHeroes();
  }
}
