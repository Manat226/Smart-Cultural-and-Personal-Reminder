export interface ImageUploadResult {
  url: string;
  file: File;
  preview: string;
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 10MB' };
  }

  return { valid: true };
};

export const processImageUpload = (file: File): Promise<ImageUploadResult> => {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      resolve({
        url: result,
        file,
        preview: result
      });
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  });
};

export const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

export const cropImageToSquare = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;

      const offsetX = (img.width - size) / 2;
      const offsetY = (img.height - size) / 2;

      ctx?.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(croppedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to crop image'));
    };

    img.src = URL.createObjectURL(file);
  });
};