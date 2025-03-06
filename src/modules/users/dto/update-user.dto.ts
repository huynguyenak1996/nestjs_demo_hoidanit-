import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { IsValidPhoneNumber } from '@/common/decorators/is-valid-phone-number.decorator';
import { Type } from 'class-transformer';
import { AddressDto } from '@/modules/users/dto/create-user.dto';

export class UpdateUserDto {
  // @IsMongoId({ message: this.i18n.translate('users.username_exists.translation') })
  @IsMongoId({ message: 'users.username_exists.translation' })
  @IsNotEmpty()
  _id: string;
  @IsString()
  @IsNotEmpty()
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
