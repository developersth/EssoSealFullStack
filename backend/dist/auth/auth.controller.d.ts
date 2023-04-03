import { RegisterDTO } from 'src/user/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './login.dto';
export declare class AuthController {
    private userService;
    private authService;
    constructor(userService: UserService, authService: AuthService);
    hiddenInformation(): Promise<string>;
    publicInformation(): Promise<string>;
    register(registerDTO: RegisterDTO): Promise<{
        user: any;
        token: string;
    }>;
    login(loginDTO: LoginDTO): Promise<{
        user: any;
        token: string;
    }>;
}
