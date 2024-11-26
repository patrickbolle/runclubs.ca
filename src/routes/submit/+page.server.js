import { db } from '$lib/server/db';
import { POSTMARK_API_KEY, POSTMARK_SENDER_EMAIL, ADMIN_EMAIL } from '$env/static/private';
import postmark from 'postmark';

const client = new postmark.ServerClient(POSTMARK_API_KEY);

export const load = async () => {
  const cities = await db.getCities();
  return { cities };
};

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const submission = {
      name: data.get('name'),
      city_id: data.get('cityId'),
      day: data.get('day'),
      time: data.get('time'),
      location: data.get('location'),
      description: data.get('description'),
      instagram: data.get('instagram')?.replace('@', ''),
      facebook: data.get('facebook'),
      submitterEmail: data.get('email')
    };

    try {
      // Store submission in clubs table
      const result = await db.createPendingClub(submission);

      // Send email notification
      await client.sendEmail({
        From: POSTMARK_SENDER_EMAIL,
        To: ADMIN_EMAIL,
        Subject: 'New Run Club Submission',
        HtmlBody: `
          <h1>New Run Club Submission</h1>
          <p>Club Name: ${submission.name}</p>
          <p>Location: ${submission.location}</p>
          <p>Submitter Email: ${submission.submitterEmail}</p>
          <p><a href="https://runclubs.ca/admin/submissions/${result.id}">Review Submission</a></p>
        `,
        TextBody: `New Run Club Submission: ${submission.name}`
      });

      return { success: true };
    } catch (error) {
      console.error('Error creating submission:', error);
      return {
        success: false,
        error: 'Failed to submit run club. Please try again.'
      };
    }
  }
}; 