import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: any) {
    return req.user;
  }
}