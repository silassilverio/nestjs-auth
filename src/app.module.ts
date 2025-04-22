import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, PostsModule, CaslModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
