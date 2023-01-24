import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Tokens } from '../interfaces';

export const GetCredentials = createParamDecorator(
    (_: undefined | null, ctx: ExecutionContext): Tokens => {
        const request = ctx.switchToHttp().getRequest();
        return {
            access_token: request?.cookies?.access_token as string,
            refresh_token: request?.cookies?.refresh_token as string
        };
    },
);