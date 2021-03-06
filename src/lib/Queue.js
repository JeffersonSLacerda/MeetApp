import Bee from 'bee-queue';

import CancellationSubMail from '../app/jobs/CancellationSubMail';
import CancellationMeetupMail from '../app/jobs/CancellationMeetupMail';
import UpdateMeetupMail from '../app/jobs/UpdateMeetupMail';
import CreateMeetupMail from '../app/jobs/CreateMeetupMail';
import SubscribeMail from '../app/jobs/SubscribeMail';
import CancellationMeetupMailToUser from '../app/jobs/CancellationMeetupMailToUser';

const jobs = [
  CancellationSubMail,
  SubscribeMail,
  CancellationMeetupMail,
  CreateMeetupMail,
  UpdateMeetupMail,
  CancellationMeetupMailToUser,
];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
          },
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee
      .createJob(job)
      .timeout(3000)
      .save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
    });
  }
}

export default new Queue();
