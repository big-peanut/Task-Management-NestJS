import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Sign up a new user with the provided credentials
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // Generate a salt for password hashing
    const salt = await bcrypt.genSalt();

    // Create a new User instance
    const user = new User();
    user.username = username;
    user.salt = salt;

    // Hash the provided password and set it for the user
    user.password = await this.hashPassword(password, salt);

    try {
      // Save the user to the database
      await user.save();
    } catch (error) {
      // Handle unique constraint violation (duplicate username)
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        // Handle other database errors
        throw new InternalServerErrorException();
      }
    }
  }

  // Sign in a user with the provided credentials and generate an access token
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    // Find the user based on the provided username
    const user = await this.userRepository.findOne({ where: { username } });

    // Validate the user's password
    if (user && user.validatePassword(password)) {
      // Create a JWT payload with the username
      const payload: JwtPayload = { username };

      // Sign the JWT payload to generate an access token
      const accessToken = await this.jwtService.sign(payload);

      // Return the access token
      return { accessToken };
    } else {
      // Return null if the user is not found or password is incorrect
      return null;
    }
  }

  // Hash the provided password using the given salt
  private
