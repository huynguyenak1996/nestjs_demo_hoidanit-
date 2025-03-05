import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
  IsPostalCode,
  IsISO31661Alpha2,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidPhoneNumber } from '@/common/decorators/is-valid-phone-number.decorator';

export class AddressDto {
  @IsOptional()
  @IsString({ message: 'Street must be a string' })
  street?: string;
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;
  @IsOptional()
  @IsString({ message: 'State must be a string' })
  state?: string;
  @IsOptional()
  @IsPostalCode(undefined, { message: 'Invalid zip code format' })
  zip?: string;
  @IsOptional()
  @IsISO31661Alpha2({ message: 'Invalid country code format' })
  country?: string;
}
export class CreateUserDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must contain only letters and numbers',
  })
  username: string;
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;
  @IsOptional()
  @IsValidPhoneNumber({ message: 'Invalid phone number format' })
  phoneNumber?: string;
  @IsOptional()
  @ValidateNested({ message: 'Invalid address format' })
  @Type(() => AddressDto)
  address?: AddressDto;
}
