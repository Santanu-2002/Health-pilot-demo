import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, trim: true, maxlength: 20 },
  role: { type: String, enum: ['patient'], default: 'patient', immutable: true },
}, { timestamps: true, versionKey: false });

export default mongoose.model('User', userSchema);
