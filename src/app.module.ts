import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  // Set up TypeORM module with the provided configuration
  imports: [TypeOrmModule.forRoot(typeOrmConfig), 

    // Include TasksModule to handle tasks-related functionality
    TasksModule, 
    
    // Include AuthModule for authentication-related functionality
    AuthModule],
})
export class AppModule {}
