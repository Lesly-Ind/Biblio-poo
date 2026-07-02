import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { correo, rolId } = createUsuarioDto;

    // 1. Verificar correo duplicado
    const existeUsuario = await this.prisma.usuario.findUnique({
      where: { correo },
    });

    if (existeUsuario) {
      throw new ConflictException('El correo ya está registrado');
    }

    // 2. Verificar que el rol exista
    const rolExiste = await this.prisma.rol.findUnique({
      where: { id: rolId },
    });

    if (!rolExiste) {
      throw new NotFoundException('El rol no existe');
    }

    // 3. Crear usuario
    return this.prisma.usuario.create({
      data: createUsuarioDto,
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        correo: true,
        estado: true,
        rolId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      orderBy: { id: 'asc' },
      include: {
        rol: true,
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { rol: true },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no existe`);
    }

    return usuario;
  }
}