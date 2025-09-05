import React, { useState, useRef } from 'react';
import { Upload, X, RotateCw, Crop, Download } from 'lucide-react';
import { processImageUpload, resizeImage, cropImageToSquare } from '../../utils/imageUtils';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImage, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await processImageUpload(file);
      const resizedImage = await resizeImage(file, 400, 400, 0.9);
      setImagePreview(resizedImage);
      onImageSelect(resizedImage);
    } catch (error) {
      console.error('Image upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleCropToSquare = async () => {
    if (!fileInputRef.current?.files?.[0]) return;
    
    setIsUploading(true);
    try {
      const croppedImage = await cropImageToSquare(fileInputRef.current.files[0]);
      setImagePreview(croppedImage);
      onImageSelect(croppedImage);
    } catch (error) {
      console.error('Crop error:', error);
      alert('Failed to crop image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    onImageSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Upload Person's Photo
      </label>
      
      {imagePreview ? (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={imagePreview}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={handleCropToSquare}
                className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                title="Crop to square"
              >
                <Crop size={16} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                title="Replace image"
              >
                <RotateCw size={16} />
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
              <p className="text-sm text-gray-600">Processing image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;