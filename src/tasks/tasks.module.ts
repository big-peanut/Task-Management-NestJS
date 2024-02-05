import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  // Import TypeOrmModule to make the Task entity available to this module
  imports: [TypeOrmModule.forFeature([Task]), 

    // Import AuthModule to include authentication-related functionality
    AuthModule],

  // Specify the controller responsible for handling HTTP requests
  controllers: [TasksController],

  // Specify the service responsible for handling business logic related to tasks
  providers: [TasksService],
})
export class TasksModule {}
