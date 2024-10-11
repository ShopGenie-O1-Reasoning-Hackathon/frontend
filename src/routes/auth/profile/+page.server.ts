import type { Actions, PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';

export const actions: Actions = {
    updateProfile: async ({ request, locals: { supabase }, fetch }) => {
        const formData = await request.formData();
        const userId = formData.get('id') as string;
        const updateData = {
            name: formData.get('name'),
            occupation: formData.get('occupation'),
            city: formData.get('city')
        };

        try {
            const FASTAPI_URL = 'https://shopgenie-backend-gztc.onrender.com'; // Replace with your FastAPI URL
            const response = await fetch(`${FASTAPI_URL}/api/v1/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedUser = await response.json();
            
            return { success: true, user: updatedUser };
        } catch (err) {
            console.error('Error updating user data:', err);
            return fail(500, { message: 'Error updating user data' });
        }
    }
};