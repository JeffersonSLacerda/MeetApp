import * as Yup from 'yup';
import { Op } from 'sequelize';
import { starOfDay, endOfDay, isBefore, parseISO, subDays } from 'date-fns';

import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';

import CreateMeetupMail from '../jobs/CreateMeetupMail';
import Queue from '../../lib/Queue';

class MeetupController {
  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [starOfDay(searchDate), endOfDay(searchDate)],
        canceled_at: null,
      };
    }

    const meetups = await Meetup.findAll({
      where,
      attributes: [
        'past',
        'id',
        'title',
        'description',
        'date',
        'file_id',
        'total_subs',
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
      ],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check for past dates
     */
    const { date } = req.body;
    const parseDate = parseISO(date);

    if (isBefore(parseDate, new Date())) {
      return res.status(400).json({ error: 'Meetup date invalid' });
    }

    const user_id = req.userId;

    const meetupCreated = await Meetup.create({
      ...req.body,
      user_id,
    });

    const meetup = await Meetup.findByPk(meetupCreated.id, {
      include: {
        model: User,
        attributes: ['name', 'email'],
      },
    });

    console.log(meetup);

    await Queue.add(CreateMeetupMail.key, {
      meetup,
    });

    return res.json(meetupCreated);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      file_id: Yup.number(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user_id = req.userId;

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== user_id)
      return res.status(401).json({ error: 'Not authorized' });

    const parseDate = parseISO(req.body.date);

    if (isBefore(parseDate, new Date()))
      return res.status(400).json({ error: 'Meetup date invalid' });

    if (meetup.past)
      return res.status(400).json({ error: "Can't update past meetups" });

    if (req.body.canceled_at != null)
      return res
        .status(400)
        .json({ error: "You con't update a canceled meetup" });

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const user_id = req.userId;

    const meetup = await Meetup.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ['name', 'email'],
      },
    });

    if (meetup.user_id !== user_id)
      return res.status(401).json({ error: 'Not authorized' });

    if (meetup.past || meetup.canceled_at != null) {
      await meetup.destroy();
      return res.json({ message: 'Meetup Deleted' });
    }

    const dateWithSub = subDays(meetup.date, 7);

    if (isBefore(dateWithSub, new Date()))
      return res
        .status(400)
        .json({ error: 'Yoou can only cancel appointments 7 days in advance' });

    if (meetup.total_subs !== 0) {
      const subs = await Subscription.findAll({
        where: {
          meetup_id: meetup.id,
          canceled_at: null,
        },
        include: {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      });
      return res.json(subs);
    }

    meetup.canceled_at = new Date();

    // await meetup.save();

    return res.json(subs);
  }
}

export default new MeetupController();
