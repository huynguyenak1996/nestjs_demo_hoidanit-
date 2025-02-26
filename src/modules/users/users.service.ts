import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { hashPasswordUtils } from '@/common/utils/bcrypt';
import { Model, Types } from 'mongoose';
import aqp from 'api-query-params'; // Đảm bảo đã cài đặt: npm install api-query-params
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, phoneNumber } = createUserDto;
    // 1. Kiểm tra username, email, và phoneNumber đã tồn tại chưa
    const existingUser = await this.userModel
      .findOne({ $or: [{ username }, { email }, { phoneNumber }] })
      .exec();
    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException(`Username '${username}' already exists.`);
      } else if (existingUser.email === email) {
        throw new ConflictException(`Email '${email}' already exists.`);
      } else {
        throw new ConflictException(
          `Phone number '${phoneNumber}' already exists.`,
        );
      }
    }
    // 2. Hash password
    const hashPassword = await hashPasswordUtils(password);
    // 3. Tạo user
    try {
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashPassword,
      });
      await createdUser.save();
      createdUser.set('password', undefined); // Thay vì delete, set thành undefined
      return createdUser.toObject({ versionKey: false });
    } catch (error) {
      console.error('Error save user', error);
      throw new InternalServerErrorException('Failed to create user.');
    }
  }
  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;
    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);
    return { results, totalItems, totalPages };
  }
  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(`Invalid user ID: ${id}`, HttpStatus.BAD_REQUEST); // Thay 404 bằng 400 Bad Request
    }
    const user = await this.userModel.findById(id).exec(); // Thêm .exec() để rõ ràng hơn
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
