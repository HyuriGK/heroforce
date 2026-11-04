import * as bcrypt from 'bcrypt';

import dataSource from '../data-source';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/entities/user-role.enum';

interface AdminSeedInput {
  name: string;
  email: string;
  password: string;
  character: string;
}

function readAdminSeedInput(): AdminSeedInput {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const character = process.env.ADMIN_CHARACTER?.trim();

  if (!name || !email || !password || !character) {
    throw new Error(
      'Defina ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD e ADMIN_CHARACTER antes de executar o seed.',
    );
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD deve ter pelo menos 8 caracteres.');
  }

  return { name, email, password, character };
}

async function bootstrap(): Promise<void> {
  const input = readAdminSeedInput();
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

  await dataSource.initialize();

  try {
    const usersRepository = dataSource.getRepository(User);
    const existingUser = await usersRepository.findOne({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error(
        'Já existe um usuário com o e-mail de administrador informado.',
      );
    }

    const passwordHash = await bcrypt.hash(input.password, saltRounds);
    await usersRepository.save(
      usersRepository.create({
        name: input.name,
        email: input.email,
        passwordHash,
        character: input.character,
        role: UserRole.ADMIN,
      }),
    );

    console.log(`Administrador criado para ${input.email}.`);
  } finally {
    await dataSource.destroy();
  }
}

void bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Erro desconhecido.';
  console.error(`Falha ao criar administrador: ${message}`);
  process.exitCode = 1;
});
