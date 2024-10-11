import { supabaseClient } from './supabaseClient';
import { PYTHON_BACKEND_URL } from './config';

const apiService = {
  

  // Function to upload a file to Supabase and get the public link
  uploadFileToSupabase: async (file: File, bucket: string, path: string) => {
    try {
      // Upload the file to Supabase storage
      const { data, error } = await supabaseClient.storage.from(bucket).upload(path, file, {
        cacheControl: '3600', // Optional: Set cache control if needed
        upsert: false, // Prevent overwriting existing files
        contentType: file.type // Preserve the file's original content type
      });

      if (error) {
        throw new Error(`File upload failed: ${error.message}`);
      }

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = await supabaseClient.storage.from(bucket).getPublicUrl(path);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  //FOR PYTHON CALLS
  getPython: async (endpoint: string) => {
    try {
      const response = await fetch(`${PYTHON_BACKEND_URL}/${endpoint}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`GET request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  postPython: async (endpoint: string, data: JSON) => {
    try {
      const response = await fetch(`${PYTHON_BACKEND_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`POST request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

};

export default apiService;
