import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../users/usuario.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AccessLogsService } from '../access-logs/access-logs.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usersRepository: Repository<Usuario>,
    private jwtService: JwtService,
    private accessLogsService: AccessLogsService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // ✅ ENCRIPTAR CONTRASEÑA CON BCRYPT
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Crear usuario con contraseña encriptada
    const user = this.usersRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    // Generar token JWT
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);

    // Devolver usuario sin contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Usuario registrado exitosamente',
      access_token,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
      // Cambiamos el select a un objeto, o mejor aún, simplemente quítalo por ahora
      // para ver si el campo 'role' aparece solo.
    });

    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    // DEBUG: Imprime el usuario completo para ver qué propiedades tiene
    console.log('Usuario encontrado:', JSON.stringify(user, null, 2));

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciales incorrectas');
    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Inicio de sesión exitoso',
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      user: userWithoutPassword,
    };
  }
  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
