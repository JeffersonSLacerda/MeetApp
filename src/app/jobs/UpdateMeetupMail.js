import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class UpdateMeetupMail {
  get key() {
    return 'UpdateMeetupMail';
  }

  async handle({ data }) {
    const { meetup } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: 'Meetup Atualizada',
      template: 'updatemeetup',
      context: {
        title: meetup.title,
        description: meetup.description,
        date: format(parseISO(meetup.date), "dd' de' MMMM', ás' H:mm'h'", {
          locale: pt,
        }),
        local: meetup.location,
      },
    });

    if (meetup.total_subs !== 0) {
      console.log(meetup.total_subs);
    }
  }
}

export default new UpdateMeetupMail();
