import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    units: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const City = mongoose.model('City', citySchema);