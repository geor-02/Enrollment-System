import { Schedule } from '../../mongodb/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const schedules = await Schedule.find().sort({ createdAt: -1 });
    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    const schedule = new Schedule({ text });
    const savedSchedule = await schedule.save();
    return NextResponse.json(savedSchedule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { _id, text } = await request.json();
    if (!_id || !text) {
      return NextResponse.json({ error: 'ID and text are required' }, { status: 400 });
    }
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      _id,
      { text },
      { new: true }
    );
    if (!updatedSchedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }
    return NextResponse.json(updatedSchedule, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const deletedSchedule = await Schedule.findByIdAndDelete(id);
    if (!deletedSchedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Schedule deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
  }
}