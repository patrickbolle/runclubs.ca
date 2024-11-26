import { redirect } from '@sveltejs/kit';
import { ADMIN_SECRET } from '$env/static/private';

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const password = data.get('password');
    
    if (password === ADMIN_SECRET) {
      cookies.set('admin_token', ADMIN_SECRET, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      
      throw redirect(303, '/admin/submissions');
    }
    
    return {
      error: 'Invalid password'
    };
  }
}; 