import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    // 유저를 인증하기위해 사용할 기본 strategy를 명시해 주기, 여기서는 jwt
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // jwt 인증 부분을 담당, 주로 sign()을 위한 부분이다.
    JwtModule.register({
      secret: 'secretKey',
      signOptions: {
        expiresIn: 3600 * 5, // 5시간 후 만료
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  // JwtStrategy를 이 Auth 모듈에서 사용할 수 있게 등록
  providers: [AuthService, JwtStrategy],
  // JwtStrategy, PassportModule을 다른 모듈에서 사용할 수 있게 등록
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
