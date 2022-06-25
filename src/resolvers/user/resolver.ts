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
import { Context } from 'koa';
import { getConnection } from 'typeorm';
import jwt from "jsonwebtoken";
import { uid } from "rand-token";
import bcrypt from 'bcrypt';
import User from '../../db/entities/user.entity'; 
import { validateRegister } from './validateRegister'; 
import { FieldError } from '../utils/type';
import UserType from './type';

const JWT_SECRET = process.env.SESSION_SECRET || "jwt_secret";
const saltRounds = 10;
interface UserContext {
  ctx: Context;
}
interface IUser {
  userId: number;
}
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => String, { nullable: true })
  token?: string;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  // query profile
  @Query(() => User, { nullable: true })
  me(@Ctx() { user }: { user: IUser}) {
    return User.findOne(user.userId);
  }
  // refresh token
  @Query(() => UserResponse)
  async refreshToken(
    @Ctx() { ctx }: UserContext
  ): Promise<UserResponse | null> {
    const refresh_token = ctx.cookies.get("refreshToken", { signed: true });
    if (!refresh_token) {
      return {
        errors: [
          {
            field: "refreshToken",
            message: "Invalid Refresh Token",
          },
        ],
      };
    }
    const user = await User.findOne({ where: { refresh_token } });
    if (!user || user.refresh_expires < new Date(Date.now())) {
      return {
        errors: [
          {
            field: "refreshToken",
            message: "Invalid Refresh Token",
          },
        ],
      };
    } else {
      const token = jwt.sign(
        {
          userId: user.id,
          userName: user.username,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: 300 }
      );
      return {
        token,
      };
    }
    return null;
  }
  // account register
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserType,
    @Ctx() { ctx }: UserContext
  ): Promise<UserResponse> {
    let user;
    let token;

    // validate user information are corect
    const error = validateRegister(options);
    if (error) {
      return { errors: [error] };
    }
    // check email
    const count = await User.count({
      where: {
        email: options.email,
      },
    });
    if (count > 0) {
      return {
        errors: [
          {
            field: "email",
            message: "The email already exists",
          },
        ],
      };
    } else {
      // check username
      const count = await User.count({
        where: {
          username: options.username,
        },
      });
      if (count > 0) {
        return {
          errors: [
            {
              field: "username",
              message: "The username already exists",
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
            .returning("*")
            .execute();
          user = result.raw[0];

          const refreshToken = uid(255);
          const isProd = process.env.NODE_ENV === "production" ? true : false;
          const cookie_duration =
            Number(process.env.NOT_REMEMBER_ME_DURATION) || 5;
          token = jwt.sign(
            {
              userId: user.id,
              userName: user.username,
              role: user.role_id,
              email: user.email,
            },
            JWT_SECRET,
            { expiresIn: 300 }
          );

          ctx.cookies.set("refreshToken", refreshToken, {
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * cookie_duration,
            overwrite: true,
            httpOnly: !isProd,
            sameSite: "lax",
            signed: true,
            secure: isProd,
            domain: process.env.DOMAIN || "churdle.com",
          });

          await User.update(
            { id: user.id },
            {
              refresh_token: refreshToken,
              refresh_expires: new Date(
                Date.now() + 1000 * 60 * 60 * 24 * cookie_duration
              ),
            }
          );
        } catch (err) {
          throw new Error(err);
        }
      }

      return { user, token };
    }
  }
  // acount login
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Arg("remember_me", { defaultValue: false, nullable: true })
    remember_me: boolean,
    @Ctx() { ctx }: UserContext
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

    const refreshToken = uid(255);
    const isProd = process.env.NODE_ENV === "production";
    const cookie_duration =
      Number(
        remember_me
          ? process.env.REMEMBER_ME_DURATION
          : process.env.NOT_REMEMBER_ME_DURATION
      ) || 5;
    const token = jwt.sign(
      {
        userId: user.id,
        userName: user.username,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: 300 }
    );

    ctx.cookies.set("refreshToken", refreshToken, {
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * cookie_duration,
      overwrite: true,
      httpOnly: !isProd,
      sameSite: "lax",
      signed: true,
      secure: isProd,
      domain: process.env.DOMAIN || "mikeneder.me",
    });

    await User.update(
      { id: user.id },
      {
        refresh_token: refreshToken,
        refresh_expires: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * cookie_duration
        ),
      }
    );

    return {
      user,
      token,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { ctx }: UserContext) {
    const userId = ctx.state.user.userId;
    if (!userId) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "Invalid User",
          },
        ],
      };
    }
    const isProd = process.env.NODE_ENV === "production";
    ctx.cookies.set("refreshToken", "", {
      httpOnly: !isProd,
      signed: true,
    });
    await User.update(
      { id: userId },
      {
        refresh_token: "",
        refresh_expires: new Date(Date.now() - 1),
      }
    );
    return true;
  }
}
