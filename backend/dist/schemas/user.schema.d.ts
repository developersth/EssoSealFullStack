import * as mongoose from 'mongoose';
export declare const UserSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    username: string;
    password: string;
    createAt: Date;
    updateAt: Date;
    name?: string;
    email?: string;
    mobile?: string;
    isActive?: boolean;
    role?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    username: string;
    password: string;
    createAt: Date;
    updateAt: Date;
    name?: string;
    email?: string;
    mobile?: string;
    isActive?: boolean;
    role?: any;
}>> & Omit<mongoose.FlatRecord<{
    username: string;
    password: string;
    createAt: Date;
    updateAt: Date;
    name?: string;
    email?: string;
    mobile?: string;
    isActive?: boolean;
    role?: any;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
