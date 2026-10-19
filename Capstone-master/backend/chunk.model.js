import mongoose, { Schema, model } from 'mongoose';

const { Types } = mongoose;

const chunkSchema = new Schema(
  {
    EventId: {
      type: Types.ObjectId,
      ref: 'event',
      required: [true, 'Event ID is required'],
      index: true,
    },

    chunkText: {
      type: String,
      required: [true, 'Chunk text is required'],
      trim: true,
    },

    chunkIndex: {
      type: Number,
      required: [true, 'Chunk index is required'],
      min: [0, 'Chunk index cannot be negative'],
    },

    embedding: {
      type: [Number],
      required: [true, 'Chunk embedding is required'],
      validate: {
        validator: (embedding) => Array.isArray(embedding) && embedding.length > 0,
        message: 'Embedding must be a non-empty array',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: 'throw',
  }
);

export const chunkModel = model('Chunk', chunkSchema);