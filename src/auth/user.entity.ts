import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task.entity';

@Entity()
@Unique(['username']) // Ensure that the username is unique across users
// User entity representing a registered user in the system
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number; // Primary key for the user entity

  @Column()
  username: string; // Username of the user, should be unique

  @Column()
  password: string; // Hashed password of the user

  @Column()
  salt: string; // Salt used for hashing the password

  @OneToMany((type) => Task, (task) => task.user, { eager: true })
  tasks: Task[]; // One-to-Many relationship with tasks, representing tasks associated with the user

  // Method to validate the user's password
  async validatePassword(password: string): Promise<boolean> {
    // Hash the provided password using the user's salt
    const hash = await bcrypt.hash(password, this.salt);
    // Compare the hashed password with the stored password
    return hash === this.password;
  }
}
