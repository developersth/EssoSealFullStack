/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { User } from 'src/models/user.model';
import { RegisterDTO } from './register.dto';
import { LoginDTO } from 'src/auth/login.dto';
import { Payload } from 'src/models/payload.model';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User>);
    create(RegisterDTO: RegisterDTO): Promise<any>;
    findByPayload(payload: Payload): Promise<import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    findByLogin(UserDTO: LoginDTO): Promise<any>;
    sanitizeUser(user: User): any;
    addUser(user: User): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getUserById(userId: string): Promise<User>;
    getUserByUserName(userName: string): Promise<User>;
    updateUser(userId: string, user: User): Promise<User>;
    deleteUser(userId: string): Promise<User>;
}
