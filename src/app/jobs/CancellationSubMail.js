import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationSubsMail {
  get key() {
    return 'CancellationSubsMail';
  }

  async handle({ data }) {
    const { subscription } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${subscription.User.name} <${subscription.User.email}>`,
      subject: 'Subscription canceled',
      template: 'cancellationsub',
      context: {
        user: subscription.User.name,
        titulo: subscription.Meetup.title,
        date: format(
          parseISO(subscription.Meetup.date),
          "dd' de' MMMM', ás' H:mm'h'",
          {
            locale: pt,
          }
        ),
        local: subscription.Meetup.location,
      },
    });
  }
}

export default new CancellationSubsMail();
