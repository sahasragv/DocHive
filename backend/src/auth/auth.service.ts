import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: any) {

    const existingUser =
      await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(dto.password, 10);

    const user =
      await this.usersService.create({
        ...dto,
        password: hashedPassword,
      });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async login(dto: any) {
  const user = await this.usersService.findByEmail(dto.email);
 
  if (!user) {
    throw new Error('Invalid credentials');
  }
 
  const isMatch = await bcrypt.compare(dto.password, user.password);
 
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
 
  const payload = {
    sub: user._id,
    email: user.email,
  };
 
  const accessToken = this.jwtService.sign(payload);
 
  console.log('==============================');
  console.log('LOGIN CALLED');
  console.log(
    JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString(),
    ),
  );
  console.log('==============================');
 
  return { accessToken };
  }}