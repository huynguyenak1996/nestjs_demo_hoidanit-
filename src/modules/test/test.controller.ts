import { TestService } from './test.service';
import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Get('success')
  getSuccess() {
    return { data: { message: 'Hello world!' } };
  }
  @Get('custom-message')
  getCustomMessage(@Query('message') message: string) {
    return { message, data: null }; // Trả về key message
  }
  @Get('with-args')
  getWithArgs(@Query('name') name: string) {
    return {
      message: 'username_exists',
      args: { username: name },
      data: null,
    };
  }
  @Get('error')
  getError() {
    //return {message: 'UserNotFound', data:null, statusCode: HttpStatus.BAD_REQUEST} //return như thế này cũng được, nhưng nên throw exception
    throw new HttpException('UserNotFound', HttpStatus.NOT_FOUND);
  }
  @Get('custom-error')
  getCustomError(@Query('error') error: string) {
    throw new HttpException(
      {
        message: 'create.error',
        args: { error: error || 'Unknown error' },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  @Get('error-without-message')
  getErrorWithOutMessage() {
    throw new Error('Some unexpected error');
    //return {message: '', data: null} //return thế này thì sẽ là internal server error
  }
}
