import { Module } from "@nestjs/common";
import { RelationController } from "./controllers";
import { RelationService } from "./services";

@Module({
  controllers: [
    RelationController
  ],
  providers: [
    RelationService
  ]
})
export class RelationModule {
}
