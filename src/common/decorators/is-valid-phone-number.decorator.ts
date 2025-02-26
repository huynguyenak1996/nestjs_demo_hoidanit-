// src/common/decorators/is-valid-phone-number.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
@ValidatorConstraint({ async: false }) // Để async nếu cần kiểm tra trong database
export class IsValidPhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(phoneNumber: string, args: ValidationArguments) {
    // Logic kiểm tra số điện thoại ở đây.  Ví dụ đơn giản:
    return /^\+?[0-9]{10,13}$/.test(phoneNumber); // Kiểm tra số điện thoại bắt đầu bằng + và có 10-13 chữ số
    // Bạn có thể dùng thư viện như libphonenumber-js để validate chính xác hơn
  }
  defaultMessage(args: ValidationArguments) {
    return 'Invalid phone number.';
  }
}
export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPhoneNumberConstraint,
    });
  };
}
