import {
  BadRequestException,
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
import aqp from 'api-query-params';
import { I18nCustomService } from '@/common/i18n/i18n.service';
import * as moment from 'moment-timezone';

@Injectable()
export class UsersService {
  constructor(
    private readonly i18n: I18nCustomService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, phoneNumber } = createUserDto;
    // 1. Kiểm tra username, email, và phoneNumber đã tồn tại chưa
    const existingUser = await this.userModel.findOne({ $or: [{ username }, { email }, { phoneNumber }] }).exec();
    if (existingUser) {
      if (existingUser.username === username) {
        throw new BadRequestException(this.i18n.translate('users.username_exists.translation', { args: { username } }));
      } else if (existingUser.email === email) {
        throw new BadRequestException(this.i18n.translate('users.email_exists.translation', { args: { email } }));
      } else if (existingUser.phoneNumber === phoneNumber) {
        throw new BadRequestException(this.i18n.translate('users.phone_exists.translation', { args: { phoneNumber } }));
      } else {
        throw new BadRequestException(
          this.i18n.translate('users.phone_email_exists.translation', { args: [email, phoneNumber] }),
        );
      }
    }
    // 2. Hash password
    const hashPassword = await hashPasswordUtils(password);
    // 3. Tạo user
    try {
      const createdUser = new this.userModel({ ...createUserDto, password: hashPassword });
      await createdUser.save();
      createdUser.set('password', undefined);
      return createdUser.toObject({ versionKey: false });
    } catch (error) {
      console.error('Error save user', error);
      throw new InternalServerErrorException('Failed to create user.');
    }
  }
  async findAll(query: string, page: number, limit: number) {
    const { filter, sort, population, projection } = aqp(query); // Lấy tất cả các tham số
    // Loại bỏ current và pageSize từ filter, vì chúng ta xử lý riêng
    delete filter.page;
    delete filter.limit;
    // Validate and set default values for page and limit
    const currentPage = Math.max(1, page); // Đảm bảo page >= 1
    const pageSize = Math.max(1, limit); // Đảm bảo limit >= 1
    const skip = (currentPage - 1) * pageSize;
    const [results, totalItems] = await Promise.all([
      this.userModel
        .find(filter)
        .limit(pageSize)
        .skip(skip)
        .sort(sort as any)
        .select(projection) // Áp dụng projection (chọn các trường)
        .populate(population) // Nếu có yêu cầu populate (nếu dùng relationship)
        .exec(), // Thêm .exec() để thực thi query
      this.userModel.countDocuments(filter).exec(),
    ]);
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      data: results,
      metadata: {
        pagination: {
          total: totalItems,
          page: currentPage,
          limit: pageSize,
          totalPages,
        },
      },
    };
  }
  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(`Invalid user ID: ${id}`, HttpStatus.BAD_REQUEST); // Thay 404 bằng 400 Bad Request
    }
    const user = await this.userModel.findById(id).exec(); // Thêm .exec() để rõ ràng hơn
    if (!user) {
      throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }
  async update(updateUserDto: UpdateUserDto): Promise<User> {
    // 1. Kiểm tra xem có ID trong DTO không.  Nếu không có, không thể xác định user để update.
    if (!updateUserDto._id) {
      throw new BadRequestException('Thiếu ID người dùng.');
    }
    // 2. Tìm user theo ID.  Sử dụng findById để tìm.
    const existingUser = await this.userModel.findById(updateUserDto._id).exec();
    // 3. Nếu không tìm thấy user, ném lỗi NotFoundException.
    if (!existingUser) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID: ${updateUserDto._id}`);
    }
    // Cập nhật thông tin (sau khi đã kiểm tra)
    for (const key in updateUserDto) {
      if (Object.prototype.hasOwnProperty.call(updateUserDto, key) && updateUserDto[key] !== undefined) {
        if (key === 'password') {
          existingUser[key] = await hashPasswordUtils(updateUserDto.password);
        } else {
          existingUser[key] = updateUserDto[key];
        }
      }
    }
    const result = await this.userModel
      .updateOne(
        {
          _id: updateUserDto._id,
          $or: [
            { username: { $ne: updateUserDto.username || '' } }, // $ne: not equal
            { email: { $ne: updateUserDto.email || '' } },
            { phoneNumber: { $ne: updateUserDto.phoneNumber || '' } },
          ],
        },
        { $set: existingUser },
        { runValidators: true }, // Đảm bảo validation của schema vẫn được chạy
      )
      .exec();
    const now = new Date();
    console.log(now);
    if (result.matchedCount === 0) {
      throw new ConflictException('Thông tin người dùng đã tồn tại hoặc không tìm thấy người dùng.');
    }
    const updatedUser = await existingUser.save();
    return updatedUser;
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
