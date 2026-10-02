/**
 * ImageKit / Cloud Storage Configuration and Utilities
 * Reads keys configured from the root .env file
 */

export const IMAGEKIT_CONFIG = {
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
};

/**
 * Upload an image file or base64 data to ImageKit CDN
 * @param {File|Blob|string} file - File object or Base64/URL string
 * @param {string} fileName - Desired file name
 * @param {string} folder - Destination folder (e.g. '/gallery', '/products')
 */
export const uploadImageToCDN = async (file, fileName = `solar_${Date.now()}`, folder = '/power24') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('folder', folder);
    formData.append('publicKey', IMAGEKIT_CONFIG.publicKey);

    // Direct upload via ImageKit upload API
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        // Basic auth using private key for direct uploads or signature
        Authorization: 'Basic ' + btoa(IMAGEKIT_CONFIG.privateKey + ':'),
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Image upload failed');
    }

    const data = await response.json();
    return {
      success: true,
      url: data.url,
      fileId: data.fileId,
      thumbnailUrl: data.thumbnailUrl,
    };
  } catch (error) {
    console.error('ImageKit CDN Upload Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default IMAGEKIT_CONFIG;
