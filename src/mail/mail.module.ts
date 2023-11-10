import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';
import { Subscriber } from 'rxjs';
import { SubscriberSchema } from 'src/subscribers/schemas/subscriber.schema';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("MAIL_HOST"),
          secure: false,
          auth: {
            user: configService.get<string>("MAIL_USER"),
            pass: configService.get<string>("MAIL_PASSWORD"),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: configService.get<string>("MAIL_PREVIEW") === "true" ? true : false
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: Subscriber.name, schema: SubscriberSchema }
    ]),
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule { }