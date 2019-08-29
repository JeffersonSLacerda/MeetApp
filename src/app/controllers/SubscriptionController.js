import { Op } from 'sequelize';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import { subHours, isBefore } from 'date-fns';

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
        canceled_at: null,
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

    /**
     * enviar email -> User
     */
  }

  async delete(req, res) {
    const subscription = await Subscription.findByPk(
      req.params.subscriptionId,
      {
        include: [
          {
            model: Meetup,
            attributes: ['title', 'date'],
          },
          {
            model: User,
            attributes: ['name', 'email'],
          },
        ],
      }
    );

    // return res.json({ subscription });

    if (subscription.user_id !== req.userId)
      return res
        .status(401)
        .json({ error: "You don't have permission to cancel it" });

    const meetup = await Meetup.findOne({
      where: {
        id: subscription.meetup_id,
      },
    });

    if (isBefore(meetup.date, new Date()))
      return res
        .status(400)
        .json({ error: "You can't cancel subscriptions in past Meetups" });

    const dateWithSub = subHours(meetup.date, 2);

    if (!dateWithSub)
      return res.status(400).json({
        error: 'You can only cancel appointmensts 2 hours in advance',
      });

    if (subscription.canceled_at != null) {
      await subscription.destroy();
      return res.json({ message: 'Subscription Deleted' });
    }

    subscription.canceled_at = new Date();

    await subscription.save();

    const numberOfSubs = await Subscription.findAndCountAll({
      where: {
        meetup_id: meetup.id,
        canceled_at: null,
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

    return res.json({ message: 'Subscription canceled' });
  }
}

export default new SubscriptionController();
