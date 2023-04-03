"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(RegisterDTO) {
        const { username } = RegisterDTO;
        const user = await this.userModel.findOne({ username });
        if (user) {
            throw new common_1.HttpException('user already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const createdUser = new this.userModel(RegisterDTO);
        await createdUser.save();
        return this.sanitizeUser(createdUser);
    }
    async findByPayload(payload) {
        const { username } = payload;
        return await this.userModel.findOne({ username });
    }
    async findByLogin(UserDTO) {
        const { username, password } = UserDTO;
        const user = await this.userModel.findOne({ username });
        if (!user) {
            throw new common_1.HttpException(`ไม่พบผู้ใช้งาน ${UserDTO.username}`, common_1.HttpStatus.BAD_REQUEST);
        }
        if (await bcrypt.compare(password, user.password)) {
            return this.sanitizeUser(user);
        }
        else {
            throw new common_1.HttpException('รหัสผ่านไม่ถูกต้อง', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    sanitizeUser(user) {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized;
    }
    async addUser(user) {
        const { username } = user;
        const res = await this.userModel.findOne({ username });
        if (res) {
            throw new common_1.HttpException('user already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const newUser = new this.userModel(user);
        return newUser.save();
    }
    async getAllUsers() {
        return this.userModel.find().exec();
    }
    async getUserById(userId) {
        return this.userModel.findById(userId).exec();
    }
    async getUserByUserName(userName) {
        return this.userModel.findOne({ usernam: userName }).exec();
    }
    async updateUser(userId, user) {
        return this.userModel.findByIdAndUpdate(userId, user, { new: true }).exec();
    }
    async deleteUser(userId) {
        return this.userModel.findByIdAndRemove(userId).exec();
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map