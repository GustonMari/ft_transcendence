import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import TokenPayloadDTO from '../dtos/token_payload.dto';

@Injectable()
export class LoginROPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) : TokenPayloadDTO {
    // const c = new TokenPayloadDTO();

    // c.email = value.email;
    // c.id = value.id;
    // c.login = value.login;

    return value;
  }
}
