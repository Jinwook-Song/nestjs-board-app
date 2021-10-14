import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

type Payload = {
  username: string;
};

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // create account
  async createUser({ username, password }: AuthCredentialsDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  // login user
  async login({ username, password }: AuthCredentialsDto): Promise<Payload> {
    const user = await this.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: Payload = { username };
      return payload;
    } else {
      throw new UnauthorizedException('login failed.');
    }
  }
}
