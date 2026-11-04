import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../users/entities/user-role.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectFilterDto } from './dto/project-filter.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ProjectResponse } from './types/project-response.type';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    private readonly usersService: UsersService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<ProjectResponse> {
    const responsible = await this.requireHero(createProjectDto.responsibleId);
    const project = await this.projectsRepository.save(
      this.projectsRepository.create({
        ...createProjectDto,
        responsible,
      }),
    );

    return this.findResponseById(project.id);
  }

  async findAll(
    filters: ProjectFilterDto,
    currentUser: JwtPayload,
  ): Promise<ProjectResponse[]> {
    const query = this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.responsible', 'responsible')
      .orderBy('project.updatedAt', 'DESC');

    this.applyAccessFilter(query, filters, currentUser);

    const projects = await query.getMany();

    return projects.map((project) => this.toResponse(project));
  }

  async findOne(id: string, currentUser: JwtPayload): Promise<ProjectResponse> {
    const project = await this.findEntityById(id);

    if (
      currentUser.role === UserRole.HERO &&
      project.responsibleId !== currentUser.sub
    ) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return this.toResponse(project);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    const project = await this.findEntityById(id);

    if (
      updateProjectDto.responsibleId &&
      updateProjectDto.responsibleId !== project.responsibleId
    ) {
      project.responsible = await this.requireHero(
        updateProjectDto.responsibleId,
      );
    }

    Object.assign(project, updateProjectDto);
    await this.projectsRepository.save(project);

    return this.findResponseById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.projectsRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Projeto não encontrado.');
    }
  }

  calculateProgress(project: Project): number {
    const total =
      project.agility +
      project.enchantment +
      project.efficiency +
      project.excellence +
      project.transparency +
      project.ambition;

    return Math.round(total / 6);
  }

  private applyAccessFilter(
    query: SelectQueryBuilder<Project>,
    filters: ProjectFilterDto,
    currentUser: JwtPayload,
  ): void {
    if (currentUser.role === UserRole.HERO) {
      if (filters.responsibleId && filters.responsibleId !== currentUser.sub) {
        throw new ForbiddenException(
          'Heróis só podem consultar os próprios projetos.',
        );
      }

      query.andWhere('project.responsibleId = :responsibleId', {
        responsibleId: currentUser.sub,
      });
    } else if (filters.responsibleId) {
      query.andWhere('project.responsibleId = :responsibleId', {
        responsibleId: filters.responsibleId,
      });
    }

    if (filters.status) {
      query.andWhere('project.status = :status', { status: filters.status });
    }
  }

  private async findResponseById(id: string): Promise<ProjectResponse> {
    return this.toResponse(await this.findEntityById(id));
  }

  private async findEntityById(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: { responsible: true },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return project;
  }

  private async requireHero(id: string): Promise<User> {
    const user = await this.usersService.findById(id);

    if (!user || user.role !== UserRole.HERO) {
      throw new BadRequestException(
        'O responsável deve ser um herói cadastrado.',
      );
    }

    return user;
  }

  private toResponse(project: Project): ProjectResponse {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      goals: {
        agility: project.agility,
        enchantment: project.enchantment,
        efficiency: project.efficiency,
        excellence: project.excellence,
        transparency: project.transparency,
        ambition: project.ambition,
      },
      progress: this.calculateProgress(project),
      responsible: this.usersService.toPublicUser(project.responsible),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
