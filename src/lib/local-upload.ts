/**
 * Upload an image to the local filesystem via the upload API.
 * @returns The public URL path to the uploaded file.
 */
export async function uploadImageLocally(file: File, path: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || 'Upload failed');
  }

  const data = await response.json();
  return data.url;
}

/**
 * Delete a file from the local filesystem via the delete API.
 */
export async function deleteFileLocally(url: string): Promise<void> {
  await fetch('/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
}
