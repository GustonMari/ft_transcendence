import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Req, UseGuards } from "@nestjs/common";
import { LocalGuard } from "app/src/auth/guards/auth.guard";
import { UserService } from "../services/user.service";
import { GetUser } from "app/src/auth/decorators/get_user.decorator";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiUnauthorizedResponse({ status: 401, description: "Client does not have access_token or the access_token is invalid" })

@Controller("user")
@UseGuards(LocalGuard)
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {
    }

    @ApiNotFoundResponse({ status: 404, description: "Access token sent by client does not match to any user in the DB" })
    @ApiOkResponse({ status: 200, description: "Return the current user" })

    @Get("me")
    async get_me(
        @GetUser() user: any,
    ) {
        return (user);
    }

    @ApiBadRequestResponse({ status: 400, description: "Invalid ID parameter" })
    @ApiOkResponse({ status: 200, description: "Return the user with the given ID" })
    
    @Get("get/:id")
    async get_USER_by_USER_id(
        @Param("id", ParseIntPipe) id: number
    ) {
        // return (await this.userService.get_user_by_id(id));
    }

    @ApiBadRequestResponse({ status: 400, description: "Invalid STRING parameter" })
    @ApiOkResponse({ status: 200, description: "Return the user with the given string" })

    @Get("get/:string")
    async get_USER_by_USER_login(
        @Param("string") login: string
    ) {
        // return (await this.userService.get_user_by_login(login));
    }

}
