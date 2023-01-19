import TokenPayloadDTO from 'app/src/auth/dtos/token_payload.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | null, ctx: ExecutionContext) : TokenPayloadDTO => {
    const request = ctx.switchToHttp().getRequest();

    if (data) {
        return request?.body?.ft_authentification_payload[data];
    } else {
        return request?.body?.ft_authentification_payload;
    }
  },
);