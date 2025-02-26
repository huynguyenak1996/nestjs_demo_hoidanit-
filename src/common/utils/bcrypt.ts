import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';
const saltRounds = 10;
export const hashPasswordUtils = async (password: string) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('Password hashing error:', error); // Log lỗi
    throw new InternalServerErrorException('Failed to create user.'); // Lỗi server
  }
};
