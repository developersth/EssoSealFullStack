import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: false },
  email: { type: String, required: false },
  mobile: { type: String, required: false },
  isActive: { type: Boolean, required: false },
  role: { type: Object, required: false },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next: any) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
