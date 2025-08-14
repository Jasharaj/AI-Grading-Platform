import React, { useState } from 'react';
import { 
  uploadPDFToCloudinary, 
  uploadFileToCloudinary, 
  validatePDF, 
  validateFile,
  generatePreviewUrl,
  generateDownloadUrl,
  deleteFileFromCloudinary
} from '../utils/uploadCloudinary';

interface FileUploadProps {
  onFileUpload?: (fileData: any) => void;
  onError?: (error: string) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  folder?: string;
  showPreview?: boolean;
  multiple?: boolean;
}

interface UploadedFile {
  url: string;
  publicId: string;
  originalName: string;
  format: string;
  bytes: number;
  previewUrl?: string;
}

export const FileUploader: React.FC<FileUploadProps> = ({
  onFileUpload,
  onError,
  acceptedTypes = ['application/pdf'],
  maxSize = 10 * 1024 * 1024,
  folder = 'uploads',
  showPreview = true,
  multiple = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (file, index) => {
        try {
          // Validate file
          if (acceptedTypes.includes('application/pdf') && acceptedTypes.length === 1) {
            validatePDF(file);
          } else {
            validateFile(file, { allowedTypes: acceptedTypes, maxSize });
          }

          // Upload file
          let result;
          if (file.type === 'application/pdf') {
            result = await uploadPDFToCloudinary(file);
          } else {
            result = await uploadFileToCloudinary(file, { 
              folder, 
              resourceType: file.type.startsWith('image/') ? 'image' : 'raw'
            });
          }

          // Generate preview URL for PDFs and images
          let previewUrl;
          if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
            previewUrl = generatePreviewUrl(result.publicId, {
              width: 300,
              height: 400,
              page: 1
            });
          }

          const uploadedFile: UploadedFile = {
            ...result,
            previewUrl
          };

          // Update progress
          setUploadProgress(((index + 1) / fileArray.length) * 100);

          return uploadedFile;
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          if (onError) {
            onError(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
          throw error;
        }
      });

      const results = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...prev, ...results]);
      
      if (onFileUpload) {
        onFileUpload(multiple ? results : results[0]);
      }

    } catch (error) {
      console.error('Upload error:', error);
      if (onError) {
        onError('Failed to upload files. Please try again.');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async (publicId: string, index: number) => {
    try {
      await deleteFileFromCloudinary(publicId);
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting file:', error);
      if (onError) {
        onError('Failed to delete file');
      }
    }
  };

  const handleDownload = (file: UploadedFile) => {
    const downloadUrl = generateDownloadUrl(file.publicId, file.originalName);
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          onChange={(e) => handleFileUpload(e.target.files)}
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <label 
          htmlFor="file-upload" 
          className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-medium text-gray-700">
              {uploading ? 'Uploading...' : 'Click to upload files'}
            </p>
            <p className="text-sm text-gray-500">
              {acceptedTypes.includes('application/pdf') ? 'PDF files up to 10MB' : 'Various file types supported'}
            </p>
          </div>
        </label>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Uploaded Files</h3>
          <div className="space-y-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {showPreview && file.previewUrl && (
                    <img 
                      src={file.previewUrl} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-700">{file.originalName}</p>
                    <p className="text-sm text-gray-500">
                      {(file.bytes / 1024 / 1024).toFixed(2)} MB • {file.format.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(file)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.publicId, index)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// File Preview Component
interface FilePreviewProps {
  fileUrl: string;
  fileType: string;
  publicId?: string;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ 
  fileUrl, 
  fileType, 
  publicId,
  className = "w-full h-96"
}) => {
  if (fileType === 'application/pdf') {
    // For PDFs, show a preview image and link to full PDF
    const previewUrl = publicId ? generatePreviewUrl(publicId) : null;
    
    return (
      <div className={className}>
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="PDF Preview" 
              className="w-full h-full object-contain border rounded"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-black px-4 py-2 rounded font-medium"
              >
                Open PDF
              </a>
            </div>
          </div>
        ) : (
          <iframe 
            src={fileUrl} 
            className={className}
            title="PDF Preview"
          />
        )}
      </div>
    );
  }

  if (fileType.startsWith('image/')) {
    return (
      <img 
        src={fileUrl} 
        alt="File preview" 
        className={`${className} object-contain border rounded`}
      />
    );
  }

  // For other file types, show a download link
  return (
    <div className={`${className} flex items-center justify-center border-2 border-dashed border-gray-300 rounded`}>
      <div className="text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-600 mb-2">File preview not available</p>
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Download File
        </a>
      </div>
    </div>
  );
};

export default FileUploader;
