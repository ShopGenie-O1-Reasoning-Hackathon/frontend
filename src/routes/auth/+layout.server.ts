import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, fetch }) => {
  // Get the user from Supabase
  const { data: { user } } = await supabase.auth.getUser();
  console.log(user);

  let authUser = null;

  if (user) {
    try {
      // Replace this with your actual FastAPI backend URL
      const FASTAPI_URL = 'https://shopgenie-backend-gztc.onrender.com';
      
      const response = await fetch(`${FASTAPI_URL}/api/v1/users/${user.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      authUser = await response.json();
    //   console.log("User details from FastAPI:", authUser);
    } catch (error) {
      console.error("Error fetching user details from FastAPI:", error);
      // You might want to handle this error, perhaps by setting a flag in authUser
      authUser = { error: "Failed to fetch user details", id: user.id };
    }
  }

  return { authUser };
};