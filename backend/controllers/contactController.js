import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Change to your verified domain later
      to: process.env.CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `New Enquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #e4e4e7; padding: 32px; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #06b6d4; margin-top: 0;">New Portfolio Contact</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #a1a1aa; width: 100px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #a1a1aa;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #06b6d4;">${email}</a></td></tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #18181b; border-radius: 8px; border-left: 3px solid #06b6d4;">
            <p style="margin: 0; color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Message</p>
            <p style="margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #52525b;">Sent from your portfolio contact form.</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
};
