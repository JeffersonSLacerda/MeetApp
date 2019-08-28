import { Op } from 'sequelize';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: ['id', 'canceled_at', 'meetup_id'],
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          attributes: [
            'past',
            'id',
            'title',
            'description',
            'location',
            'date',
            'canceled_at',
          ],
          required: true,
        },
      ],
      oder: [[Meetup, 'date']],
    });
    return res.json(subscriptions);
  }

  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [User],
    });

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

    if (checkDate)
      return res.status(400).json({
        error: "You can't subscribe in more one meetup at the same time",
      });

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    const numberOfSubs = await Subscription.findAndCountAll({
      where: {
        meetup_id: meetup.id,
      },
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
    });
    console.log(numberOfSubs.count);

    await meetup.update({ total_subs: numberOfSubs.count });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
