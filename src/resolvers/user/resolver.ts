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
import User from '../../db/entities/user.entity';
import UsernamePasswordInput from './UsernamePasswordInput';
import { getConnection } from 'typeorm';
import { Context } from 'koa';
import bcrypt from 'bcrypt';
import { Session } from 'koa-session';
import { validateRegister } from './validateRegister'; 

const saltRounds = 10;

export type UserContext = {
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

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  // query profile
  @Query(() => User, { nullable: true })
  me(@Ctx() { session }: UserContext) {
    // you are not logged in
    if (!session.userId) {
      return null;
    }

    return User.findOne(session.userId);
  }
  // account register
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { session }: UserContext
  ): Promise<UserResponse> {
    let user;
    // validate user information are corect
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    // check user existed
    const count = await User.count({
      where: {
        email: options.email,
      },
    });
    if (count > 0) {
      return {
        errors: [
          {
            field: 'email',
            message: 'The account already existed',
          },
        ],
      };
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
          .returning('*')
          .execute();
        user = result.raw[0];
      } catch (err) {
        throw new Error(err);
      }
    }

    session.userId = user.id;

    return { user };
  }
  // acount login
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,    @Ctx() { session }: UserContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) { 
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "Username doesn't exist",
          },
        ],
      };
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) { 
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    } 
    session.userId = user.id;

    return {
      user,
    };
  }
}
