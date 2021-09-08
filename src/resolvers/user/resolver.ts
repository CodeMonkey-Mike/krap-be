import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Field,
  Ctx,
  ObjectType,
  FieldResolver,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import User from '../../db/entities/user.entity'; 
import bcrypt from 'bcrypt';
import { validateRegister } from './validateRegister'; 
import { ContextType, FieldError } from '../utils/type';
import UserType, { LoginType } from './type';
import { UserInputError } from 'apollo-server-koa';

const saltRounds = 10;

@ObjectType()
class UserResponse {
  @Field(() => FieldError, { nullable: true })
  errors?: FieldError;

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  // query profile
  @Query(() => User, { nullable: true })
  me(@Ctx() { session }: ContextType) {
    // you are not logged in
    if (!session.userId) {
      return null;
    }

    return User.findOne(session.userId);
  }
  // account register
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserType,
    @Ctx() { session }: ContextType
  ): Promise<UserResponse> {
    let user;
    // validate user information are corect
    const errors = validateRegister(options);
    if (errors) {
      throw new UserInputError(errors.message, { field: errors .field});
    }
    // check user existed
    const count = await User.count({
      where: {
        email: options.email,
      },
    });
    if (count > 0) {
      throw new UserInputError("The account already existed", {
        field: "email",
      });
    } else {
      try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(options.password, salt);
        const result = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({
            username: options.username,
            email: options.email,
            password: hashedPassword,
          })
          .returning("*")
          .execute();
        user = result.raw[0];
      } catch (err) {
        throw new Error(err);
      }
    }

    session.userId = user.id;
    user.password = "";

    return { user };
  }
  // acount login
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: LoginType,
    @Ctx() { session }: ContextType
  ): Promise<UserResponse> {
    const user = await User.findOne(
      options.usernameOrEmail.includes("@")
        ? { where: { email: options.usernameOrEmail } }
        : { where: { username: options.usernameOrEmail } }
    );
    if (!user) {
      throw new UserInputError("Username doesn't exist", {
        field: "usernameOrEmail",
      });
    }

    const valid = bcrypt.compareSync(options.password, user.password);
    if (!valid) {
      throw new UserInputError("Incorrect password", {
        field: "password",
      });
    }
    session.userId = user.id;

    return {
      user,
    };
  }
}
