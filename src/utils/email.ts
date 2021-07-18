import sgMail from '@sendgrid/mail';

const apiKey: any = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(apiKey);

interface userInterface { 
  email: string
}
export default class Email {
  private to: string;
  private url: string;
  private fromEmail: string;
  private fromName: string;
  
  constructor(user: userInterface, url: string) {
    this.to = user.email;
    this.url = url;
    this.fromEmail = 'keelviinn@gmail.com';
    this.fromName = 'Kelvin Tecnologia';
  }
  
  async sendMagicLink() {
    const mailOptions: any = {
      to: this.to,
      from: { email: this.fromEmail, name: this.fromName },
      templateId: process.env.DYNAMIC_TEMPLATE_ID,
      dynamic_template_data: { url: this.url,},
    };
  
    try {
      await sgMail.send(mailOptions);
    } catch (error) { console.error(error); throw new Error("Error to send email"); }
  }
 };