import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMeetupMailToUser {
  get key() {
    return 'CancellationMeetupMailToUser';
  }

  async handle({ data }) {
    const { subs, meetup } = data;

    subs.map(sub => {
      // console.log(sub.User.name);

      Mail.sendMail({
        to: `${sub.User.name} <${sub.User.email}>`,
        subject: 'Meetup Cancelada',
        template: 'cancellationmeetuptouser',
        context: {
          title: sub.Meetup.title,
          description: sub.Meetup.description,
          date: format(
            parseISO(sub.Meetup.date),
            "dd' de' MMMM', ás' H:mm'h'",
            {
              locale: pt,
            }
          ),
          local: sub.Meetup.location,
          provider: meetup.User.name,
          email: meetup.User.email,
        },
      });
    });

    // console.log(subs.length);

    // let count = 0;
    // do {

    //   count = count + 1;
    // } while (count < subs.length);

    // while (count < subs.length) {
    //   console.log(count);
    //   ++count;
    // }

    // for (let i = 0; i < subs.length; i++) {
    //   const sub = subs[i];

    //   await Mail.sendMail({
    //     to: `${sub.User.name} <${sub.User.email}>`,
    //     subject: 'Meetup Cancelada',
    //     template: 'cancellationmeetuptouser',
    //     context: {
    //       title: sub.Meetup.title,
    //       description: sub.Meetup.description,
    //       date: format(
    //         parseISO(sub.Meetup.date),
    //         "dd' de' MMMM', ás' H:mm'h'",
    //         {
    //           locale: pt,
    //         }
    //       ),
    //       local: sub.Meetup.location,
    //       provider: meetup.User.name,
    //       email: meetup.User.email,
    //     },
    //   });
    // }
    console.log(`Enviado para ${subs.User.name}`);

    if (meetup.total_subs !== 0) {
      // console.log(meetup.total_subs);
    }
  }
}

export default new CancellationMeetupMailToUser();
