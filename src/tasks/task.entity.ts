import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Entity()
// Define the Task entity with TypeORM decorators
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number; // Primary key for the task

  @Column()
  title: string; // Title of the task

  @Column()
  description: string; // Description of the task

  @Column()
  status: TaskStatus; // Status of the task (e.g., OPEN, IN_PROGRESS, COMPLETED)

  @ManyToOne((type) => User, (user) => user.tasks, { eager: false })
  user: User; // Many-to-One relationship with the User entity, indicating the owner of the task
}
