import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/auth/auth.guard';
import { DatabaseModule } from './common/db/database.module';
import { AuthModule } from './apps/auth/auth.module';
import { AppConfigModule } from './common/config/config.module';
import { ModelModule } from './common/db/model.module';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './apps/user/repository/user.repository';
import { UserModule } from './apps/user/user.module';
import { AgentModule } from './apps/agent/agent.module';
import { EstateModule } from './apps/estate/estate.module';

@Module({
  imports: [
    AppConfigModule,
    ModelModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    AgentModule,
    EstateModule
  ],
  providers: [
    JwtService,
    UserRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
