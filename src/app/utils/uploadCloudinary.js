const upload_preset = process.env.VITE_UPLOAD_PRESET || 'grade-system';
const cloud_name = process.env.VITE_UPLOAD_PRESET || 'dapam3jdf';

export const uploadPDFToCloudinary = async (file) => {
  try {
    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append("upload_preset", upload_preset);
    uploadData.append("cloud_name", cloud_name);
    uploadData.append("resource_type", "raw"); // This allows PDF uploads

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
    return data;
  } catch (error) {
    console.error("Error uploading PDF to Cloudinary:", error);
    throw error;
  }
};

// Helper function to validate PDF file
export const validatePDF = (file) => {
  if (!file) return false;
  
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