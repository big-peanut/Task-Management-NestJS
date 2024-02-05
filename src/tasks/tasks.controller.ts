import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard()) // Use the Passport authentication guard for this controller
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/all')
  // Get all tasks for the authenticated user
  getAllTasks(@Req() req): Promise<Task[]> {
    return this.tasksService.getAllTasks(req.user);
  }

  @Get('/:id')
  // Get a task by its ID for the authenticated user
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, req.user);
  }

  @Post()
  // Create a new task for the authenticated user
  createTask(@Body() createTaskDto: CreateTaskDto, @Req() req): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, req.user);
  }

  @Delete('/:id')
  // Delete a task by its ID for the authenticated user
  deleteTask(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<void> {
    return this.tasksService.deleteTask(id, req.user);
  }

  @Patch('/:id/status')
  // Update the status of a task by its ID for the authenticated user
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @Req() req,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, req.user);
  }
}
