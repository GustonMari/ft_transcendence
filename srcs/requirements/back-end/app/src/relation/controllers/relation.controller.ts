import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Redirect,
  Delete
} from "@nestjs/common";
import {
  ApiOperation,
  ApiBody, ApiParam
} from "@nestjs/swagger";
import {
  CreateRelationDTO
} from "../dtos";
import {
  RelationService
} from "../services";
import {
  GetMe
} from "../../auth/decorators";
import {
  AuthGuard
} from "@nestjs/passport";

//@UseGuards(AuthGuard())
@Controller("relation")
export class RelationController {

  constructor(
    private relationService: RelationService
  ) {
  }

  @ApiOperation({
    description: "Create a new relation between two users"
  })
  @ApiBody({
    type: CreateRelationDTO
  })
  @Get("/create")
  @HttpCode(HttpStatus.CREATED)
  async createRelation(
    @Body() dto: CreateRelationDTO,
    @GetMe("id") id: number
  ) {
    if (dto.relation_type !== "BLOCKED" && dto.relation_type !== "PENDING") {
      throw new BadRequestException("The relation type is invalid.");
    }
    if (dto.id_target === id) {
      throw new BadRequestException("The target ID and the current ID are eguals.");
    }
    await this.relationService.createRelation(dto, id);
    return { message: "" };
  }

  @ApiOperation({
    description: "Create a new friend request"
  })
  @HttpCode(HttpStatus.CREATED)
  @Redirect("/api/relation/create")
  @Get("friend/create/id/:id")
  async sendFriendRequest(
    @Param("id", ParseIntPipe) id: number
  ) {
    return ({ id_target: id, relation_type: "PENDING" });
  }

  @ApiOperation({
    description: "Block a user"
  })

  @HttpCode(HttpStatus.CREATED)
  @Redirect("/api/relation/create")
  @Get("block/create/id/:id")
  async blockUser(
    @Param("id", ParseIntPipe) id: number
  ) {
    return ({ id_target: id, relation_type: "BLOCKED" });
  }

  /*
  Remove relations :
    - Remove by RelationID (check if state === "BLOCKED, user must be the owner of this relation)
  Getter :
    - GetRelations (friend, incomming, outgoing);
  DTO: ReturnRelationDTO
*/

  @ApiOperation({
    description: "Remove a relation between two users"
  })

  @HttpCode(HttpStatus.OK)
  @Delete("delete/id/:id")
  async removeRelation(
    @Param("id", ParseIntPipe) user_id: number,
    @GetMe("id") id: number
  ) {
    if (user_id === id) {
      throw new BadRequestException("The target ID and the current ID are eguals.");
    }
    await this.relationService.removeRelation(id, user_id);
    return ("Relation has been removed successfully");
  }


}