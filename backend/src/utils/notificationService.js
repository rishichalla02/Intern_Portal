import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

export async function createNotification({ userId, title, message, type = 'general' }) {
  if (!userId || !title || !message) {
    return null;
  }
  if (mongoose.connection.readyState !== 1) return null;

  try {
    const notification = await Notification.create({
      userId,
      title: String(title).trim(),
      message: String(message).trim(),
      type,
    });

    return notification;
  } catch (error) {
    console.error('Notification creation failed:', error.message);
    return null;
  }
}

export async function getUserNotifications(userId, { limit = 50 } = {}) {
  if (!userId) return [];

  try {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
  } catch (error) {
    console.error('Failed to fetch notifications:', error.message);
    return [];
  }
}

export async function markNotificationRead(userId, notificationId) {
  if (!userId || !notificationId) return null;

  try {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  } catch (error) {
    console.error('Failed to mark notification read:', error.message);
    return null;
  }
}
