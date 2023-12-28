import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber } from 'rxjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SubscriberDocument } from 'src/subscribers/schemas/subscriber.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { Cron } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>
  ) { }
  @Get()
  @Public()
  @ResponseMessage("Test email")
  @Cron('0 0 * * 1')
  //At every 00:00 on Monday
  async handleTestEmail() {
    const subscribers = await this.subscriberModel.find();
    for (const subs of subscribers) {
      console.log(subs)
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      if (jobWithMatchingSkills.length > 0) {
        const jobs = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            companyId: item.company._id,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: item.skills
          }
        })
        await this.mailerService.sendMail({
          to: subs.email,
          from: '"Website tìm việc"', // override default from
          subject: 'Các công việc',
          template: "new-job",
          context: {
            reciver: subs.name,
            jobs: jobs
          }
        });
      }

    }

  }
}
