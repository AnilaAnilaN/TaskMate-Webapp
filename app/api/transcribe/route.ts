// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { tmpdir } from 'os';
import { createReadStream } from 'fs';

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    console.log('🎤 Transcription request received');

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('📁 Audio file received:', {
      name: audioFile.name,
      type: audioFile.type,
      size: `${(audioFile.size / 1024).toFixed(2)} KB`,
    });

    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempFileName = `recording-${randomBytes(8).toString('hex')}.webm`;
    tempFilePath = join(tmpdir(), tempFileName);
    
    await writeFile(tempFilePath, buffer);
    console.log('💾 Temp file created:', tempFilePath);

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    console.log('🔄 Sending to Groq Whisper...');

    const transcription = await groq.audio.transcriptions.create({
      file: createReadStream(tempFilePath),
      model: 'whisper-large-v3-turbo',
      language: 'en',
      response_format: 'json',
      temperature: 0.0,
    });

    console.log('✅ Transcription successful');
    console.log('📝 Transcribed text:', transcription.text.substring(0, 100) + '...');

    if (tempFilePath) {
      await unlink(tempFilePath);
      console.log('🗑️ Temp file deleted');
    }

    return NextResponse.json({
      success: true,
      text: transcription.text,
    });

  } catch (error: any) {
    console.error('❌ Transcription error:', error);

    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (unlinkError) {
        console.error('Failed to delete temp file:', unlinkError);
      }
    }

    if (error.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key. Please check your Groq configuration.' },
        { status: 500 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to transcribe audio. Please try again.' 
      },
      { status: 500 }
    );
  }
}