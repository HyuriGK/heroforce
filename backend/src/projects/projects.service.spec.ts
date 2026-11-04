import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserRole } from '../users/entities/user-role.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Project } from './entities/project.entity';
import { ProjectStatus } from './entities/project-status.enum';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  const hero = {
    id: '20e168d0-5fdb-4c58-9833-15f44fb596dc',
    name: 'Carol Danvers',
    email: 'carol@example.com',
    character: 'Capitã Marvel',
    role: UserRole.HERO,
    createdAt: new Date('2026-11-04T00:00:00.000Z'),
    updatedAt: new Date('2026-11-04T00:00:00.000Z'),
  } as User;
  const project = {
    id: '1be1d4af-1e01-4ee5-8774-7b3fa8ebf09c',
    name: 'Portal HeroForce',
    description: 'Portal de gestão heroica.',
    status: ProjectStatus.IN_PROGRESS,
    agility: 80,
    enchantment: 60,
    efficiency: 70,
    excellence: 90,
    transparency: 40,
    ambition: 60,
    responsibleId: hero.id,
    responsible: hero,
    createdAt: new Date('2026-11-04T00:00:00.000Z'),
    updatedAt: new Date('2026-11-04T00:00:00.000Z'),
  } as Project;
  const projectsRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  } as unknown as Repository<Project>;
  const usersService = {
    findById: jest.fn(),
    toPublicUser: jest.fn(),
  } as unknown as UsersService;
  let service: ProjectsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProjectsService(projectsRepository, usersService);
    (usersService.toPublicUser as jest.Mock).mockReturnValue({
      id: hero.id,
      name: hero.name,
      email: hero.email,
      character: hero.character,
      role: hero.role,
      createdAt: hero.createdAt,
      updatedAt: hero.updatedAt,
    });
  });

  it('calculates overall progress as the rounded average of the six goals', () => {
    expect(service.calculateProgress(project)).toBe(67);
  });

  it('creates a project only when its responsible user is a hero', async () => {
    (usersService.findById as jest.Mock).mockResolvedValue(hero);
    (projectsRepository.create as jest.Mock).mockReturnValue(project);
    (projectsRepository.save as jest.Mock).mockResolvedValue(project);
    (projectsRepository.findOne as jest.Mock).mockResolvedValue(project);

    await expect(
      service.create({
        name: project.name,
        description: project.description,
        status: project.status,
        responsibleId: hero.id,
        agility: project.agility,
        enchantment: project.enchantment,
        efficiency: project.efficiency,
        excellence: project.excellence,
        transparency: project.transparency,
        ambition: project.ambition,
      }),
    ).resolves.toMatchObject({
      id: project.id,
      progress: 67,
      responsible: { id: hero.id },
    });
  });

  it('rejects an administrator as a project responsible', async () => {
    (usersService.findById as jest.Mock).mockResolvedValue({
      ...hero,
      role: UserRole.ADMIN,
    });

    await expect(
      service.create({
        name: project.name,
        description: project.description,
        status: project.status,
        responsibleId: hero.id,
        agility: project.agility,
        enchantment: project.enchantment,
        efficiency: project.efficiency,
        excellence: project.excellence,
        transparency: project.transparency,
        ambition: project.ambition,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('does not expose a project assigned to another hero', async () => {
    (projectsRepository.findOne as jest.Mock).mockResolvedValue({
      ...project,
      responsibleId: '13a0c4b1-34ff-45ad-bf5f-d98a90aa551d',
    });

    await expect(
      service.findOne(project.id, {
        sub: hero.id,
        email: hero.email,
        role: UserRole.HERO,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
