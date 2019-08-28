import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async index(req, res) {
    return res.json();
  }

  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [User],
    });

    const newSub = meetup.total_subs;

    if (meetup.user_id === req.userId)
      return res
        .status(400)
        .json({ error: "Can't subscribe to you own meetups" });

    if (meetup.past)
      return res.status(400).json({ error: "Can't subscribe in past meetups" });

    const checkDate = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    return res.json(checkDate);

    if (checkDate)
      return res.status(400).json({
        error: "You can't subscribe in more one meetup at the same time",
      });

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
      newSub: newSub + 1,
    });

    console.log(newSub);
    return res.json(subscription);
  }
}

export default new SubscriptionController();
