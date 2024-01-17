import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserDevice {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  operationSystem: string;

  @ApiProperty()
  @Column()
  ipAddress: string;

  @ApiProperty()
  @Column({ nullable: true, length: 256 })
  refreshToken: string;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.userDevices)
  user: User;
}
