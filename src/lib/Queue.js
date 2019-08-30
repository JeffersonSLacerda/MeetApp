import Bee from 'bee-queue';

import CancellationSubMail from '../app/jobs/CancellationSubMail';
import CancellationMeetupMail from '../app/jobs/CancellationMeetupMail';
import CreateMeetupMail from '../app/jobs/CreateMeetupMail';
import SubscribeMail from '../app/jobs/SubscribeMail';

import redisConfig from '../config/redis';

const jobs = [
  CancellationSubMail,
  SubscribeMail,
  CancellationMeetupMail,
  CreateMeetupMail,
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
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    console.log('adicionada');
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
    });
  }
}

export default new Queue();
