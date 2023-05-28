import { Schema, model, Types } from 'mongoose';

const ChatSchema = new Schema({
  users: {
    type: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
    ],
    validate: [(val) => val.length === 2, '{PATH} exceeds the limit of 10']
  },
  conversation: {
    type: [
      {
        timestamp: { type: Date, required: true },
        message: { type: String, required: true },
        senderid: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        photos: { type: Array, default: [] },
      }
    ],
    default: []
  },
  lastestUpdate: {
    timestamp: {
      type: Date
    },
    sendername: {
      type: String
    },
    message: {
      type: String
    }
  },
  lastUpdated: {
    type: Number,
    required: true
  }
});

const Chat = model('Chat', ChatSchema);

export default Chat;
