import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscribeMail {
  get key() {
    return 'SubscribeMail';
  }

  async handle({ data }) {
    const { subscription } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${subscription.User.name} <${subscription.User.email}>`,
      subject: 'Nova Inscrição',
      template: 'subscribemeetup',
      context: {
        user: subscription.User.name,
        title: subscription.Meetup.title,
        description: subscription.Meetup.description,
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

    console.log('Mensagem enviada');
  }
}

export default new SubscribeMail();
