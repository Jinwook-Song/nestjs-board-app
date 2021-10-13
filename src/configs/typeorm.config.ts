import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '172.31.128.1', // ipconfig (wsl) IPv4 주소
  port: 5432,
  username: 'postgres',
  password: 'kt7640kta',
  database: 'board-app',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
