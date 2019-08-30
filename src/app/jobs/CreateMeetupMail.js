import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CreateMeetupMail {
  get key() {
    return 'CreateMeetupMail';
  }

  async handle({ data }) {
    const { meetup } = data;

    console.log('A fila executou');
    console.log(meetup);

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: 'Nova Meetup Agendada',
      template: 'createmeetup',
      context: {
        title: meetup.title,
        description: meetup.description,
        date: format(parseISO(meetup.date), "dd' de' MMMM', ás' H:mm'h'", {
          locale: pt,
        }),
        local: meetup.location,
      },
    });

    console.log('Mensagem enviada');
  }
}

export default new CreateMeetupMail();
