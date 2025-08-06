import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        auth: {
          user: process.env.MAIL_TRAP_LOGIN,
          pass: process.env.MAIL_TRAP_PASS,
        },
      },
    }),
  ],
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}
