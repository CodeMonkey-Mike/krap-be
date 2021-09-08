import { InputType, Field } from "type-graphql";
@InputType()
export default class UserType {
  @Field()
  email!: string;
  @Field()
  username!: string;
  @Field()
  password!: string;
}

@InputType()
export class LoginType {
  @Field()
  usernameOrEmail!: string;
  @Field()
  password!: string;
}
