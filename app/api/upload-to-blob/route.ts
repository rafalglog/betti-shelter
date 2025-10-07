import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Permissions } from '@/app/lib/auth/permissions';
import { hasPermission } from '@/app/lib/auth/hasPermission';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized: You must be logged in.' }, { status: 401 });
  }
  
  const isAuthorized = await hasPermission(Permissions.ANIMAL_UPDATE);

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden: You do not have permission to upload files.' }, { status: 403 });
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File; 

    if (!file) {
      return NextResponse.json({ error: 'No file data found in request.' }, { status: 400 });
    }
    
    // UPLOAD TO VERCEL BLOB
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // SUCCESS RESPONSE
    return NextResponse.json({ 
      url: blob.url,
      message: 'File successfully uploaded to Vercel Blob.',
    }, { status: 201 });

  } catch (error) {
    let errorMessage = 'An unknown error occurred during the Vercel Blob upload.';
    if (error instanceof Error) {
      errorMessage = error.message; 
    } 
    console.error('Blob upload failed:', error);
    
    return NextResponse.json({ 
      error: 'Upload failed on the server', 
      details: errorMessage
    }, { status: 500 });
  }
}
