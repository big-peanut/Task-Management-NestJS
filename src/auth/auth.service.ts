import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt'; // Importing bcrypt for password hashing
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // Injecting the User repository
    private jwtService: JwtService, // Injecting the JWT service
  ) {}

  // Method for user registration
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // Generating a salt for password hashing
    const salt = await bcrypt.genSalt();

    // Creating a new user entity
    const user = new User();
    user.username = username;
    user.salt = salt;

    // Hashing the password before storing
    user.password = await this.hashPassword(password, salt);

    try {
      // Saving the user entity to the database
      await user.save();
    } catch (error) {
      // Handling unique constraint violation error
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException(); // Throwing internal server error for other errors
      }
    }
  }

  // Method for user authentication
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    // Finding the user by username in the database
    const user = await this.userRepository.findOne({ where: { username } });

    // Validating the password
    if (user && user.validatePassword(password)) {
      // Generating JWT token payload
      const payload: JwtPayload = { username };
      // Signing the JWT token
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken }; // Returning the access token
    } else {
      return null; // Return null if user not found or password is invalid
    }
  }

  // Method for hashing the password
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
