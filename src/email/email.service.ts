import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}

  recipientMail = 'devluizg@outlook.com.br';

  async sendMail(result) {
    await this.mailService.sendMail({
      from: 'Luiz Guilherme <devluizg@outlook.com.br>',
      to: this.recipientMail,
      subject: 'Batch completation details',
      text: `Batch details: Complete ${result.success}, Failed: ${result.failed}`,
    });
  }
}
