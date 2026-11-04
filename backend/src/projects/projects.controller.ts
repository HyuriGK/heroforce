import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../users/entities/user-role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectFilterDto } from './dto/project-filter.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@ApiBearerAuth('access-token')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista projetos visíveis ao usuário autenticado.' })
  @ApiOkResponse({ description: 'Lista de projetos, com filtros opcionais.' })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido ou expirado.',
  })
  async findAll(
    @Query() filters: ProjectFilterDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.projectsService.findAll(filters, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalha um projeto permitido ao usuário.' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID do projeto.' })
  @ApiOkResponse({ description: 'Projeto encontrado.' })
  @ApiNotFoundResponse({
    description: 'Projeto não encontrado ou não permitido.',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.projectsService.findOne(id, currentUser);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria um projeto heroico.' })
  @ApiCreatedResponse({ description: 'Projeto criado com sucesso.' })
  @ApiForbiddenResponse({ description: 'A operação exige um administrador.' })
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualiza um projeto heroico.' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID do projeto.' })
  @ApiOkResponse({ description: 'Projeto atualizado com sucesso.' })
  @ApiForbiddenResponse({ description: 'A operação exige um administrador.' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Exclui um projeto heroico.' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID do projeto.' })
  @ApiNoContentResponse({ description: 'Projeto excluído com sucesso.' })
  @ApiForbiddenResponse({ description: 'A operação exige um administrador.' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(id);
  }
}
