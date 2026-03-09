import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: '' },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: { type: String },
    bloodGroup: { type: String },
    emergencyContact: { type: String },
    allergies: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive', 'discharged'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);
