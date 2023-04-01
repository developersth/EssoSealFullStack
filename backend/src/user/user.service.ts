import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.model';
import { RegisterDTO } from './register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/auth/login.dto';
import { Payload } from 'src/models/payload.model';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private userModel: Model<User>,
      ) {}
    
      async create(RegisterDTO: RegisterDTO) {
        const { username } = RegisterDTO;
        const user = await this.userModel.findOne({ username });
        if (user) {
          throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
        }
    
        const createdUser = new this.userModel(RegisterDTO);

       
        await createdUser.save();
        return this.sanitizeUser(createdUser);
      }
      async findByPayload(payload: Payload) {
        const { username } = payload;
        return await this.userModel.findOne({ username });
      }
      
      async findByLogin(UserDTO: LoginDTO) {
        const { username, password } = UserDTO;
        const user = await this.userModel.findOne({ username });
        if (!user) {
          throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }
        if (await bcrypt.compare(password, user.password)) {
          return this.sanitizeUser(user)
        } else {
          throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
        }
      }
      sanitizeUser(user: User) {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized;
      }

      async addUser(user: User): Promise<User> {
        const { username } = user;
        const res = await this.userModel.findOne({ username });
        if (res) {
          throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
        }
        const newUser = new this.userModel(user);
        return newUser.save();
      }
    
      async getAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
      }
    
      async getUserById(userId: string): Promise<User> {
        return this.userModel.findById(userId).exec();
      }
      async getUserByUserName(userName: string): Promise<User> {
        return this.userModel.findOne({ usernam: userName }).exec();
      }
    
      async updateUser(userId: string, user: User): Promise<User> {
        return this.userModel.findByIdAndUpdate(userId, user, { new: true }).exec();
      }
    
      async deleteUser(userId: string): Promise<User> {
        return this.userModel.findByIdAndRemove(userId).exec();
      }

}
