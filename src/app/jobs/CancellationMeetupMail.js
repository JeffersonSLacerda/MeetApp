import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMeetupMail {
  get key() {
    return 'CancellationMeetupMail';
  }

  async handle({ data }) {
    const { meetup } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: 'Subscription canceled',
      template: 'cancellationsub',
      context: {
        user: meetup.name,
        titulo: meetup.title,
        description: meetup.desccription,
        date: format(meetup.date, "dd' de' MMMM', ás' H:mm'h'", {
          locale: pt,
        }),
        local: meetup.location,
      },
    });
  }
}

export default new CancellationMeetupMail();
