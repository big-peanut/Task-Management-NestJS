import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Configuration options for TypeORM module
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres', // Database type (PostgreSQL in this case)
  host: 'localhost', // Database host
  port: 5432, // Database port
  username: 'postgres', // Database username
  password: '12345678', // Database password
  database: 'taskmanagement', // Database name
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Entities to be included in the database schema
  synchronize: true, // Auto-create database schema based on entities (for development purposes)
};
