import { Context } from "koa";
import { Session } from "koa-session";
import { Field, ObjectType } from "type-graphql";

export type ContextType = {
  ctx: Context;
  session: Session;
};

@ObjectType()
export class FieldError {
  @Field()
  field!: string;
  @Field()
  message!: string;
}