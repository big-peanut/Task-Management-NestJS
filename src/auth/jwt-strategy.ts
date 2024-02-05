import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    // Initialize the JwtStrategy with configuration options
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
      secretOrKey: 'topSecret51', // Secret key used to verify the JWT signature
    });
  }

  // Validate method to check the validity of the JWT payload
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;

    // Find the user based on the username in the JWT payload
    const user = await this.userRepository.findOne({ where: { username } });

    // Throw UnauthorizedException if the user is not found
    if (!user) {
      throw new UnauthorizedException('Invalid user in JWT payload');
    }

    // Return the validated user
    return user;
  }
}
