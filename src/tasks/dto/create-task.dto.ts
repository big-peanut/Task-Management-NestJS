import { IsNotEmpty } from 'class-validator';

// Data transfer object (DTO) for creating a new task
export class CreateTaskDto {
  @IsNotEmpty()
  title: string; // Title of the task, should not be empty

  @IsNotEmpty()
  description: string; // Description of the task, should not be empty
}
