import { Notification } from '../../mongodb/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    const notification = new Notification({ text });
    const savedNotification = await notification.save();
    return NextResponse.json(savedNotification, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { _id, text } = await request.json();
    if (!_id || !text) {
      return NextResponse.json({ error: 'ID and text are required' }, { status: 400 });
    }
    const updatedNotification = await Notification.findByIdAndUpdate(
      _id,
      { text },
      { new: true }
    );
    if (!updatedNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Notification deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}