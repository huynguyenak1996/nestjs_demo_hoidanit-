import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/modules/users/schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Headers('x-custom-lang') lang: string) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; //Re-throw BadRequestException để trả về response với message lỗi
      }
      throw new BadRequestException(error);
    }
  }
  @Get()
  async findAll(@Query() query: string, @Query('page') page: number, @Query('limit') limit: number) {
    return await this.usersService.findAll(query, page, limit);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
