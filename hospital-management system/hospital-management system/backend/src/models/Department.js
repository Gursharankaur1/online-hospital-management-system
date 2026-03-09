import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    headOfDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    floor: { type: String },
    contactExtension: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('Department', departmentSchema);
