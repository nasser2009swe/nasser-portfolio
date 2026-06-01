import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Ensure we only delete files within public/uploads/ for security
    const relativePath = url.startsWith('/uploads/')
      ? url.replace('/uploads/', '')
      : url;

    const filePath = path.join(process.cwd(), 'public', 'uploads', relativePath);

    // Security: prevent directory traversal
    const resolvedPath = path.resolve(filePath);
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!resolvedPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    await unlink(filePath);
    return NextResponse.json({ success: true });
  } catch {
    // File doesn't exist or already deleted — that's fine
    return NextResponse.json({ success: true });
  }
}
