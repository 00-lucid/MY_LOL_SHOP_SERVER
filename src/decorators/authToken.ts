import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const AuthToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { headers } = request;
    console.log(headers);
    return headers['auth_token'] ? headers['auth_token'] : '"NOT DEFINED"';
  }
)