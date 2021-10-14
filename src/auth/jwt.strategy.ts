import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.entity';
import { Payload, UserRepository } from './user.repository';

@Injectable()
// NestJS can inject it anywhere this service is needed
// via its Dependency Injection system.
export class JwtStrategy extends PassportStrategy(Strategy) {
  // The class extends the PassportStrategy class defined by @nestjs/passport package
  // you're passing the JWT Strategy defined by the passport-jwt NodeJs package
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    // passes two important options
    super({
      secretOrKey: 'secretKey',
      // This configures the secret key that JWT Strategy will use
      // to decrypt the JWT token in order to validate it and access its payload
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // This configures the Strategy (imported from passport-jwt package)
      // to look for the JWT in the Authorization Header of the current Request
      // passed over as a Bearer token.
    });
  }

  // 유효한 토큰인지 확인되면 validate method에서 payload에 있는 username이 데이터베이스에 있는 유저인지 확인 후 있다면 유저 객체 return
  // return 값은 @UseGuards(AuthGuard())를 이용한 모등 요청의 Request Object에 들어간다.

  async validate(payload: Payload): Promise<User> {
    const { username } = payload;
    const user: User = await this.userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
