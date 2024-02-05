import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // Get all tasks for a specific user
  async getAllTasks(user: User): Promise<Task[]> {
    const allTasks = await this.taskRepository.find({ where: { user: user } });
    return allTasks;
  }

  // Get a task by its ID for a specific user
  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, user: user },
    });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  // Create a new task for a specific user
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();

    delete task.user; // Exclude user details from the returned task object

    return task;
  }

  // Delete a task by its ID for a specific user
  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user: user });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  // Update the status of a task by its ID for a specific user
  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
