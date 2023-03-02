import { AuthGuard } from '@nestjs/passport';

export class FtGuard extends AuthGuard('42') {}