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
    const club = await db.rejectClub(params.id);
    
    // Send rejection email
    if (club.submitter_email) {
      await client.sendEmail({
        From: POSTMARK_SENDER_EMAIL,
        To: club.submitter_email,
        Subject: 'Update on Your Run Club Submission',
        HtmlBody: `
          <h1>Update on Your Run Club Submission</h1>
          <p>Thank you for submitting ${club.name} to runclubs.ca.</p>
          <p>Unfortunately, we are unable to list your club at this time. This might be because:</p>
          <ul>
            <li>The club information was incomplete or unclear</li>
            <li>We couldn't verify the club's existence</li>
            <li>The club doesn't meet our current listing criteria</li>
          </ul>
          <p>Feel free to submit again with updated information!</p>
        `
      });
    }

    return json({ success: true });
  } catch (err) {
    console.error('Error rejecting club:', err);
    throw error(500, 'Error rejecting club');
  }
} 