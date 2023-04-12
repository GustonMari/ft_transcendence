import { Module } from '@nestjs/common';
import {PublicController} from "./controllers/public.controller";
import {UserModule} from "../user/user.module";
import {ProfileService} from "../user/services/profile.user.service";

@Module({
    controllers: [PublicController],
    imports: [UserModule],
    providers: [ProfileService],
})
export class PublicModule {}
