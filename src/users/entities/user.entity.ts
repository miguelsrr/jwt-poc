import { IsEmail, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: false })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ name: 'phone', type: 'varchar', nullable: false })
  @IsString()
  phone: string;

  @Column({ name: 'password', type: 'varchar', nullable: false, select: false })
  @IsString()
  password: string;

  @Column('varchar', { array: true, default: [] })
  jwtIds: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true, select: false })
  deletedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    return password === '123';
  }
}
