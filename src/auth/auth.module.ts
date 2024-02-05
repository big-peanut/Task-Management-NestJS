import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';

@Module({
  // Import necessary modules for authentication
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt', // Use the JWT strategy by default
    }),
    JwtModule.register({
      secret: 'topSecret51', // Secret key used for signing JWTs
      signOptions: {
        expiresIn: 3600, // Token expiration time (1 hour)
      },
    }),
    TypeOrmModule.forFeature([User]), // Include the User entity for TypeORM
  ],
  // Specify the controllers provided by this module
  controllers: [AuthController],
  // Specify the services and strategies provided by this module
  providers: [JwtStrategy, AuthService],
  // Export the JwtStrategy and PassportModule for use in other modules
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
