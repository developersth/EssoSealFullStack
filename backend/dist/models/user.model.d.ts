import { Document } from 'mongoose';
export interface User extends Document {
    username: string;
    password: string;
    name: string;
    email: string;
    mobile: string;
    isActive: boolean;
    role: object;
}
