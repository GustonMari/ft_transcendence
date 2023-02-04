import {
    TransformPlainToInstance
} from 'class-transformer';
import {
    BadRequestException,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Query,
    UseGuards,
} from "@nestjs/common";
import { AccessGuard } from "app/src/auth/guards/access.guard";
import { UserService } from "../services/user.service";
import { GetMe } from "app/src/auth/decorators/get_user.decorator";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiQuery,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import TokenPayloadRO from "app/src/auth/ros/token_payload.ro";
import { UserRO } from "../ros/user.full.ro";

@ApiBearerAuth()
@ApiUnauthorizedResponse({
    status: 401,
    description: "Client does not have access_token or the access_token is invalid"
})

@Controller("user")
@UseGuards(AccessGuard)
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @ApiNotFoundResponse({
        status: 404,
        description: "Access token sent by client does not match to any user in the DB"
    })
    @ApiOkResponse({
        status: 200,
        description: "Return the current user",
        type: UserRO
    })

    @Get("me")
    @TransformPlainToInstance(UserRO, {
        excludeExtraneousValues: true,
    })
    async getMe(
        @GetMe("id") id: number,
    ): Promise<UserRO> {
        const user_raw = await this.userService.getUserWithId(id);
        return (user_raw);
    }


    @ApiBadRequestResponse({
        status: 400,
        description: "Invalid ID parameter"
    })
    @ApiNotFoundResponse({
        status: 404,
        description: "No user with the given ID"
    })
    @ApiOkResponse({
        status: 200,
        description: "Return the user with the given ID", type: UserRO
    })

    @Get("get/:id")
    @TransformPlainToInstance(UserRO, {
        excludeExtraneousValues: true,
    })
    async getUserWithId(
        @Param(
            "id",
            ParseIntPipe
        ) id: number
    ): Promise<UserRO> {
        const user_raw = await this.userService.getUserWithId(id);
        return (user_raw);
    }


    @ApiBadRequestResponse({
        status: 400,
        description: "Invalid login parameter in query"
    })
    @ApiNotFoundResponse({
        status: 404,
        description: "No user with the given string"
    })
    @ApiOkResponse({
        status: 200,
        description: "Return the user with the given string",
        type: UserRO
    })
    @ApiQuery({
        name: "login",
        type: String,
        description: "The login of the user to get"
    })

    @Get("get")
    @TransformPlainToInstance(UserRO, {
        excludeExtraneousValues: true,
    })
    async getUserWithUsername(
        @Query("login") login: string
    ): Promise<UserRO> {
        if (!login) {
            throw new BadRequestException("Invalid STRING parameter")
        }
        return (await this.userService.getUserWithUsername(login));
    }

    @Get("match/string/:string")
    @TransformPlainToInstance(UserRO, {
        excludeExtraneousValues: true,
    })
    async findMatchingUsers(
        @Param("string") string: string
    ): Promise<UserRO[]> {
        return (await this.userService.findMatchingUsers(string));
    }
}
