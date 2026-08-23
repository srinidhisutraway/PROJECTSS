import ChatConversation from '../models/ChatConversation.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { generateAssistantReply } from '../services/chatService.js';

// @desc    List the user's conversations (most recent first)
// @route   GET /api/chat
export const getConversations = catchAsync(async (req, res) => {
  const conversations = await ChatConversation.find({ user: req.user._id, isArchived: false })
    .select('title updatedAt createdAt messages')
    .sort('-updatedAt')
    .limit(30);

  // Return a lightweight preview (last message) for the sidebar list
  const preview = conversations.map((c) => ({
    _id: c._id,
    title: c.title,
    updatedAt: c.updatedAt,
    createdAt: c.createdAt,
    lastMessage: c.messages[c.messages.length - 1]?.content || '',
  }));

  res.status(200).json({ success: true, conversations: preview });
});

// @desc    Get a single conversation with full message history
// @route   GET /api/chat/:id
export const getConversation = catchAsync(async (req, res, next) => {
  const conversation = await ChatConversation.findOne({ _id: req.params.id, user: req.user._id });
  if (!conversation) return next(new AppError('Conversation not found.', 404));
  res.status(200).json({ success: true, conversation });
});

// @desc    Start a new conversation (optionally with a first message)
// @route   POST /api/chat
export const createConversation = catchAsync(async (req, res) => {
  const { message } = req.body;
  const messages = [];

  if (message) {
    messages.push({ role: 'user', content: message });
  }

  const conversation = await ChatConversation.create({
    user: req.user._id,
    title: message ? message.slice(0, 50) : 'New conversation',
    messages,
  });

  if (message) {
    const reply = await generateAssistantReply(messages);
    conversation.messages.push({ role: 'assistant', content: reply });
    await conversation.save();
  }

  res.status(201).json({ success: true, conversation });
});

// @desc    Send a message in an existing conversation
// @route   POST /api/chat/:id/messages
export const sendMessage = catchAsync(async (req, res, next) => {
  const { message, relatedAnalysis } = req.body;
  if (!message?.trim()) return next(new AppError('Message content is required.', 400));

  const conversation = await ChatConversation.findOne({ _id: req.params.id, user: req.user._id });
  if (!conversation) return next(new AppError('Conversation not found.', 404));

  conversation.messages.push({ role: 'user', content: message, relatedAnalysis });

  const reply = await generateAssistantReply(conversation.messages);
  conversation.messages.push({ role: 'assistant', content: reply });

  await conversation.save();

  res.status(200).json({ success: true, conversation });
});

// @desc    Delete (archive) a conversation
// @route   DELETE /api/chat/:id
export const deleteConversation = catchAsync(async (req, res, next) => {
  const conversation = await ChatConversation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!conversation) return next(new AppError('Conversation not found.', 404));
  res.status(200).json({ success: true, message: 'Conversation deleted.' });
});
