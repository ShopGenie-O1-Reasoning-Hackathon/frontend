import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import fetch from 'node-fetch'; 
export const load = async (event) => {
    const form = await superValidate(event, userSchema);
    return { form }
};



const userSchema = z.object({
    name: z
        .string({ required_error: 'Your Name is required' })
        .min(3, { message: 'At least 3 characters' })
        .max(256, { message: 'At most 256 characters' }),
    email: z
        .string({ required_error: 'Your Email is required' })
        .min(1, { message: 'Email is required' })
        .max(256, { message: 'Email must be less than 256 characters' })
        .email({ message: 'Email must be a valid email address' }),

    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(32, { message: 'Password must be less than 32 characters' })
        .regex(new RegExp('.*[A-Z].*'), 'Password must contain at least one uppercase character')
        .regex(new RegExp('.*[a-z].*'), 'Password must contain at least one lowercase character')
        .regex(new RegExp('.*\\d.*'), 'Password must contain at least one number')
        .regex(
            new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
            'Password must contain at least one special character'
        )
        .trim(),
    gender: z.enum(['male', 'female'], { required_error: 'Gender is required' })
});

const deployPathLogin = "http://localhost:5173/login"
// import { AuthApiError } from '@supabase/supabase-js';
// import { fail, redirect } from '@sveltejs/kit';
// import { message, superValidate } from 'sveltekit-superforms/server';
// import { z } from 'zod';
// import fetch from 'node-fetch';  // Add this import

// ... (rest of your imports and load function)

export const actions = {
  register: async (event) => {
    const form = await superValidate(event, userSchema);
    if (!form.valid) {
      return message(form, 'Invalid form')
    }

    const body = form.data;
    console.log(body)

    const { data: dtt, error: err } = await event.locals.supabase.auth.signUp({
      email: body.email as string,
      password: body.password as string,
      options: {
        emailRedirectTo: deployPathLogin,
      },
    });

    console.log(dtt, err)

    if (dtt.user && dtt.user.identities && dtt.user.identities.length === 0) {
      return message(form, 'Email already in use', {
        status: 400
      });
    }

    console.log("Attempt done")

    if (err) {
      console.log(err);
      if (err instanceof AuthApiError && err.status === 400) {
        return message(form, 'Invalid credentials', {
          status: 400
        })
      }
      return message(form, 'Server error. Try again later', {
        status: 500
      })
    } else {
      console.log("Attempt Successful")

      if (!dtt.user || !dtt.user.id) {
        return message(form, 'Failed to get user ID from Supabase', {
          status: 500
        });
      }

      try {
        const response = await fetch('https://shopgenie-backend-gztc.onrender.com/api/v1/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: dtt.user.id,
            name: body.name,
            email: body.email,
            gender: body.gender
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create user in FastAPI');
        }

        const userData = await response.json();
        console.log("User created in FastAPI:", userData);

        return message(form, 'SignUp Successful. Check Inbox', {
          status: 200
        });
      } catch (error) {
        console.error("Error creating user in FastAPI:", error);
        return message(form, 'SignUp Successful, but failed to create user profile. Please contact support.', {
          status: 500
        });
      }
    }
  }
};