import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const prefix = type ? `${type}-` : '';
    const filename = `${prefix}${timestamp}${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filepath, buffer);

    const publicPath = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      path: publicPath,
      filename,
      type: type || 'general'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(filename => ({
        filename,
        path: `/uploads/${filename}`,
        type: filename.includes('hero-') ? 'hero' : 'general'
      }));
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error loading uploaded images:', error);
    return NextResponse.json([]);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
    }

    console.log('Attempting to delete file:', filename);
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    console.log('Full file path:', filepath);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log('File deleted successfully:', filename);
      return NextResponse.json({ success: true });
    } else {
      console.log('File not found:', filepath);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}