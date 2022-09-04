import { NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { JWT_EXPIRE, JWT_SECRET } from '../../config/env-varialbes';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import {
  Length,
  IsEmail,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
const colors = require('colors');

export interface UserModel {
  name: string;
  email: string;
  role: string;
  password: string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: Date | undefined;
  createdAt: Date;
  signAndReturnJwtToken: () => string;
  getResetPasswordToken: () => Promise<string>;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user'
}

let secret: Secret = JWT_SECRET as string;

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Length(3, 20)
  name: string

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER
  })
  @IsNotEmpty()
  role: string

  @Column()
  @IsNotEmpty()
  @Length(8, 30)
  password: string

  @Column({ type: 'varchar', nullable: true})
  resetPasswordToken: string | undefined;

  @Column({ type: 'varchar', nullable: true})
  resetPasswordExpire: Date | undefined;

  @Column()
  @IsDate()
  createdAt: Date

  
  signAndReturnJwtToken(): string {
    return jwt.sign({ id: this.id }, secret, {
      expiresIn: JWT_EXPIRE || '7d'
    });
  }

  async matchPassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  } 

  getResetPasswordToken(): string {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = (Date.now() + 10 * 60 * 1000) as any;

    return resetToken;
  }

  @BeforeInsert()
  async hashPassword(next: NextFunction): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}

