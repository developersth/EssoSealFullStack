import { User } from 'src/models/user.model';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    addUser(user: User): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getUserById(userId: string): Promise<User>;
    updateUser(userId: string, user: User): Promise<User>;
    deleteUser(userId: string): Promise<User>;
}
