import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  // Transform method to convert and validate the incoming status value
  transform(value: any) {
    // Convert the value to uppercase for case-insensitive comparison
    value = value.toUpperCase();

    // Check if the transformed status is valid
    if (!this.isStatusValid(value)) {
      // Throw a BadRequestException if the status is not valid
      throw new BadRequestException('Invalid task status');
    }

    // Return the validated status
    return value;
  }

  // Check if the provided status is included in the allowed statuses
  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status);
    return index !== -1;
  }
}
