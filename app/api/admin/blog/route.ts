import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getBlogPosts } from '@/lib/content';

export const dynamic = 'force-dynamic';

const blogDirectory = path.join(process.cwd(), 'content', 'blog', 'posts');

export async function GET() {
  try {
    const posts = getBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return NextResponse.json([], { status: 200 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const { slug, content, isEdit } = await request.json();
    
    if (!slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure blog directory exists
    if (!fs.existsSync(blogDirectory)) {
      fs.mkdirSync(blogDirectory, { recursive: true });
    }

    const filePath = path.join(blogDirectory, `${slug}.md`);
    
    // Check if file exists when creating new post
    if (!isEdit && fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post with this title already exists' }, { status: 400 });
    }

    // Write the markdown file
    fs.writeFileSync(filePath, content);
    
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error saving blog post:', error);
    return NextResponse.json({ error: 'Failed to save blog post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const filePath = path.join(blogDirectory, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    fs.unlinkSync(filePath);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}