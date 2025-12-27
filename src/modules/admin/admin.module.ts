import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
    ]),
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { 
          expiresIn: configService.get('jwt.expiresIn') || '7d' 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthGuard],
  exports: [AdminService, JwtAuthGuard],
})
export class AdminModule {} 