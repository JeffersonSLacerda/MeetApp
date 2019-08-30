import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CreateMeetupMail {
  get key() {
    return 'CreateMeetupMail';
  }

  async handle({ data }) {
    const { meetup } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: 'Meetup Crated',
      template: 'createmeetup',
      context: {
        user: meetup.name,
        titulo: meetup.title,
        description: meetup.desccription,
        date: format(parsiISO(meetup.date), "dd' de' MMMM', ás' H:mm'h'", {
          locale: pt,
        }),
        local: meetup.location,
      },
    });
  }
}

export default new CreateMeetupMail();
