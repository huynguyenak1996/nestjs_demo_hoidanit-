import { PartialType } from '@nestjs/mapped-types';
import { AddressDto, CreateUserDto } from './create-user.dto';
import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { IsValidPhoneNumber } from '@/common/decorators/is-valid-phone-number.decorator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsMongoId({ message: '_id Không hợp lệ' })
  @IsNotEmpty({ message: '_id không được để trống' })
  _id: string;
  @IsString()
  @IsNotEmpty({ message: 'username không được để trống' })
  @MinLength(3)
  username: string;
  @IsEmail() @IsNotEmpty() email: string;
  @IsString() @IsOptional() firstName?: string;
  @IsString() @IsOptional() lastName?: string;
  @IsOptional()
  @IsValidPhoneNumber() // Sử dụng custom validator
  phoneNumber?: string;
  @IsOptional() @ValidateNested() @Type(() => AddressDto) address?: AddressDto;
}
