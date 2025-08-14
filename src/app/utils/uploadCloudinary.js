// Cloudinary configuration
const upload_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

// File upload function for PDF submissions
export const uploadPDFToCloudinary = async (file) => {
  try {
    validatePDF(file);
    
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", upload_preset);
    uploadData.append("cloud_name", cloud_name);
    uploadData.append("resource_type", "raw");
    uploadData.append("folder", "submissions/pdfs");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to upload PDF');
    }

    const data = await res.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      originalName: data.original_filename,
      format: data.format,
      bytes: data.bytes,
      resourceType: data.resource_type
    };
  } catch (error) {
    console.error("Error uploading PDF to Cloudinary:", error);
    throw error;
  }
};

// Generic file upload function for various file types
export const uploadFileToCloudinary = async (file, options = {}) => {
  try {
    const { folder = 'uploads', resourceType = 'auto' } = options;
    
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", upload_preset);
    uploadData.append("cloud_name", cloud_name);
    uploadData.append("resource_type", resourceType);
    uploadData.append("folder", folder);

    const endpoint = resourceType === 'raw' 
      ? `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`
      : `https://api.cloudinary.com/v1_1/${cloud_name}/upload`;

    const res = await fetch(endpoint, {
      method: "POST",
      body: uploadData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to upload file');
    }

    const data = await res.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      originalName: data.original_filename || file.name,
      format: data.format,
      bytes: data.bytes,
      resourceType: data.resource_type,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};

// Function to delete file from Cloudinary
export const deleteFileFromCloudinary = async (publicId, resourceType = 'raw') => {
  try {
    // Note: File deletion requires server-side implementation due to API secret requirement
    // This function would typically call your backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cloudinary/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId, resourceType })
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw error;
  }
};

// Function to generate preview URL for files
export const generatePreviewUrl = (publicId, options = {}) => {
  const { 
    width = 300, 
    height = 400, 
    crop = 'fit',
    quality = 'auto',
    format = 'jpg',
    page = 1 
  } = options;

  return `https://res.cloudinary.com/${cloud_name}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format},pg_${page}/${publicId}.${format}`;
};

// Function to generate download URL
export const generateDownloadUrl = (publicId, originalName) => {
  return `https://res.cloudinary.com/${cloud_name}/raw/upload/fl_attachment:${originalName}/${publicId}`;
};

// Helper function to validate PDF file
export const validatePDF = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  // Check if file is PDF
  if (file.type !== 'application/pdf') {
    throw new Error('Please upload a PDF file');
  }

  // Check file size (limit to 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size should be less than 10MB');
  }

  return true;
};

// Helper function to validate various file types
export const validateFile = (file, options = {}) => {
  const { 
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'], 
    maxSize = 10 * 1024 * 1024 // 10MB default
  } = options;

  if (!file) {
    throw new Error('No file provided');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    throw new Error(`File size should be less than ${maxSizeMB}MB`);
  }

  return true;
};

// Function to extract text from uploaded PDF (requires server-side processing)
export const extractPDFText = async (publicId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pdf/extract-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId })
    });

    if (!response.ok) {
      throw new Error('Failed to extract PDF text');
    }

    return await response.json();
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw error;
  }
};