import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userCredential: CreateUserDto) {
    const candidate = await this.userService.findUserForAuth(
      userCredential.username,
    );

    if (candidate) {
      throw new HttpException(
        "Користувач з таким користувацьким ім'ям вже існує.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(userCredential.password, 5);

    await this.userService.createUser({
      ...userCredential,
      password: hashPassword,
    });

    return 'Користувач зареєстрованний.';
  }

  async generateToken(user: User) {
    const payload = {
      username: user.username,
      roles: user.roles.map((role) => role.roleName),
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userCredential: CreateUserDto) {
    const user = await this.userService.findUserForAuth(
      userCredential.username,
    );

    if (!user) {
      throw new UnauthorizedException({
        message: 'Неправильний логін або пароль.',
      });
    }

    const passwordEquals = await bcrypt.compare(
      userCredential.password,
      user.password,
    );

    if (!passwordEquals) {
      throw new UnauthorizedException({
        message: 'Неправильний логін або пароль.',
      });
    }

    return user;
  }
}
