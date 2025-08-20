import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const contentDirectory = path.join(process.cwd(), 'content');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    let filePath: string;
    
    switch (type) {
      case 'site-config':
        filePath = path.join(contentDirectory, 'site-config.json');
        break;
      case 'navigation':
        filePath = path.join(contentDirectory, 'navigation.json');
        break;
      case 'home':
        filePath = path.join(contentDirectory, 'pages', 'home.json');
        break;
      case 'contact':
        filePath = path.join(contentDirectory, 'pages', 'contact.json');
        break;
      case 'about':
        filePath = path.join(contentDirectory, 'pages', 'about.json');
        break;
      case 'services':
        filePath = path.join(contentDirectory, 'pages', 'services.json');
        break;
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();
    
    let filePath: string;
    
    switch (type) {
      case 'site-config':
        filePath = path.join(contentDirectory, 'site-config.json');
        break;
      case 'navigation':
        filePath = path.join(contentDirectory, 'navigation.json');
        break;
      case 'home':
        filePath = path.join(contentDirectory, 'pages', 'home.json');
        break;
      case 'contact':
        filePath = path.join(contentDirectory, 'pages', 'contact.json');
        break;
      case 'about':
        filePath = path.join(contentDirectory, 'pages', 'about.json');
        break;
      case 'services':
        filePath = path.join(contentDirectory, 'pages', 'services.json');
        break;
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}