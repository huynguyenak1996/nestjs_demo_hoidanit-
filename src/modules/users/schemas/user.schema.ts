// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true }) // Thêm timestamps: createdAt, updatedAt
export class User {
  @Prop({ required: true, unique: true }) // Username là bắt buộc và duy nhất
  username: string;
  @Prop({ required: true, unique: true }) // Email là bắt buộc và duy nhất
  email: string;
  @Prop() // Số điện thoại (không bắt buộc)
  phoneNumber?: string;
  @Prop({ required: true }) // Password là bắt buộc
  password: string;
  @Prop() // Tên đầu (không bắt buộc)
  firstName?: string;
  @Prop() // Tên cuối (không bắt buộc)
  lastName?: string;
  @Prop({
    type: {
      // Địa chỉ (object lồng - không bắt buộc)
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    _id: false,
  }) // _id: false để không tạo _id cho sub-document
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  // @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] }) // Mảng roles, tham chiếu đến model 'Role' (nếu có module quản lý Role riêng) - hiện tại dùng string enum
  // roles: UserRole[]; // Thay đổi thành enum UserRole[]
  // @Prop({ type: Types.ObjectId, ref: 'Center' }) // Tham chiếu đến model 'Center' (nếu có module quản lý Center) - không bắt buộc
  // centerId?: Types.ObjectId; // Thay đổi kiểu thành Types.ObjectId
  // @Prop({ enum: UserStatus, default: UserStatus.PENDING }) // Trạng thái người dùng, enum UserStatus, mặc định là PENDING
  // status: UserStatus;
  @Prop() // Đường dẫn ảnh đại diện (không bắt buộc)
  profilePicture?: string;
  @Prop() // Refresh token (dùng cho refresh token flow)
  refreshToken?: string;
  @Prop() // Token đặt lại mật khẩu (dùng cho forgot password)
  resetPasswordToken?: string;
  @Prop() // Thời điểm hết hạn của token đặt lại mật khẩu
  resetPasswordExpiry?: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
// Add index cho các trường thường được tìm kiếm
// UserSchema.index({ username: -1 });
// UserSchema.index({ email: -1 });
// UserSchema.index({ phoneNumber: -1 });
