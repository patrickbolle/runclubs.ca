import { db } from '$lib/server/db';
import { ADMIN_SECRET, POSTMARK_API_KEY, POSTMARK_SENDER_EMAIL } from '$env/static/private';
import postmark from 'postmark';
import { error, json } from '@sveltejs/kit';

const client = new postmark.ServerClient(POSTMARK_API_KEY);

export async function POST({ params, cookies }) {
  const token = cookies.get('admin_token');
  if (token !== ADMIN_SECRET) {
    throw error(403, 'Unauthorized');
  }

  try {
    const club = await db.approveClub(params.id);
    
    // Send approval email
    if (club.submitter_email) {
      await client.sendEmail({
        From: POSTMARK_SENDER_EMAIL,
        To: club.submitter_email,
        Subject: 'Your Run Club Has Been Approved!',
        HtmlBody: `
          <h1>Your Run Club Has Been Approved!</h1>
          <p>Great news! ${club.name} has been approved and is now listed on runclubs.ca.</p>
          <p>You can view your club page here: <a href="https://runclubs.ca/${club.city_slug}/${club.slug}">View Club Page</a></p>
        `
      });
    }

    return json({ success: true });
  } catch (err) {
    console.error('Error approving club:', err);
    throw error(500, 'Error approving club');
  }
} 