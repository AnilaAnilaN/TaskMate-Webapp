// models/Conversation.model.ts
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: {
    text: string;
    senderId: mongoose.Types.ObjectId;
    timestamp: Date;
  };
  unreadCount: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      required: true,
      validate: {
        validator: function (v: mongoose.Types.ObjectId[]) {
          return v.length === 2;
        },
        message: 'A conversation must have exactly 2 participants',
      },
    },
    lastMessage: {
      text: { type: String },
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date },
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: () => new Map(),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        
        // Convert Map to plain object for JSON
        if (ret.unreadCount instanceof Map) {
          ret.unreadCount = Object.fromEntries(ret.unreadCount);
        }
        
        return ret;
      },
    },
  }
);

// Index for fast participant lookups
ConversationSchema.index({ participants: 1 });

// Pre-save hook with proper async syntax
ConversationSchema.pre('save', async function () {
  if (this.isModified('participants')) {
    this.participants.sort((a: mongoose.Types.ObjectId, b: mongoose.Types.ObjectId) => 
      a.toString().localeCompare(b.toString())
    );
  }
});

const ConversationModel: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema);

export default ConversationModel;
