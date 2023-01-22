import TokenPayloadRO from 'app/src/auth/ros/token_payload.ro';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetMe = createParamDecorator(
  (data: string | null, ctx: ExecutionContext) : TokenPayloadRO => {
    const request = ctx.switchToHttp().getRequest();

    if (data) {
        return request?.body?.ft_authentification_payload[data];
    } else {
        return request?.body?.ft_authentification_payload;
    }
  },
);