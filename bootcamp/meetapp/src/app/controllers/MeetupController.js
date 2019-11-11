import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';
import * as Yup from 'yup';
import { isBefore } from 'date-fns';

class MeetupController {
  // Index - Método para LISTAR
  async index (req, res) {

  }

  // Store - Método para SALVAR
  async store(req, res) {

    const { title, description, location, date } = req.body;

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      user_id: req.body.user_id,
      file_id: req.body.file_id
    });

    return res.json(meetup);
  }

  // Delete - Método para DELETAR
  async delete(req, res) {

  }
}

export default new MeetupController();
