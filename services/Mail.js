import ejs from 'ejs';
import path from 'path';
import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASS
//     }
// });

// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'maryjane.schimmel3@ethereal.email',
//         pass: 'SXpaj3wdp6nrXPtjwH'
//     }
// });

export const sendMail = async ({to, subject, template, templateData}) => {
    try {
        const templatePath = path.resolve('./templates/email/', `${template}.ejs`);
        const htmlData = await ejs.renderFile(templatePath, templateData);

        const mailOptions = {
            to: to,
            from: process.env.EMAIL,
            subject: subject,
            html: htmlData,
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('Mail send:' + info.response);
    } catch (e) {
        console.log(e);
    }
}