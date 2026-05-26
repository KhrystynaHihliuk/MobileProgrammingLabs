import mongoose from 'mongoose';

const webPushTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    platform: {
      type: String,
      default: 'web',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const WebPushToken = mongoose.model('WebPushToken', webPushTokenSchema);