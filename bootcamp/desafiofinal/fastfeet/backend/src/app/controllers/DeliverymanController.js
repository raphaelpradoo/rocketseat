import * as Yup from 'yup';
import { Op } from 'sequelize';

import File from '../models/File';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  // Index - Método para LISTAR
  async index(req, res) {
    // Recebendo os Query Parameters
    const { page = 1, name } = req.query;

    // Filtra os Entregadores que:
    // - Não foram excluidos (deleted_at = null)
    const deliverymen = await Deliveryman.findAll({
      where: {
        deleted_at: null,
        name: {
          [Op.iLike]: name ? `%${name}%` : '%%',
        },
      },
      order: ['name'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverymen);
  }

  // Store - Método para CRIAR
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      avatar_id: Yup.string().nullable(true),
    });

    // Erro de validação. Alguns dos campos não estão no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Verifica se já existe um Entregador com este e-mail
    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    // Erro. Não é possivel salvar Entregador com o e-mails repetidos.
    if (deliverymanExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    if (req.body.avatar_id !== null) {
      // Verifica se existe uma Foto com o id passado
      const fileExists = await File.findByPk(req.body.avatar_id);

      // Erro. Foto não encontrada.
      if (!fileExists) {
        return res.status(404).json({ error: 'File not found.' });
      }
    }

    // Tudo certo para CRIAR o Entregador
    const { id, name, email, avatar } = await Deliveryman.create(req.body, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }

  // Update - Método para ATUALIZAR
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      avatar_id: Yup.string().nullable(true),
    });

    // Erro de validação. Alguns dos campos não estão no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    // Erro. Entregador não foi encontrado.
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    const emailExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    // Verifica se o e-mail já existe
    if (emailExists) {
      // Verifica se os Entregadores são diferentes
      if (deliveryman.id !== emailExists.id) {
        // Erro. Não é possivel salvar Entregadores com o mesmo e-mail
        return res
          .status(400)
          .json({ error: 'Deliveryman e-mail already exists.' });
      }
    }

    if (req.body.avatar_id !== null) {
      // Verifica se existe uma Foto com o id passado
      const fileExists = await File.findByPk(req.body.avatar_id);

      // Erro. Foto não encontrada.
      if (!fileExists) {
        return res.status(404).json({ error: 'File not found.' });
      }
    }

    // Tudo certo para ALTERAR o Entregador
    const { id, name, email, avatar } = await deliveryman.update(
      req.body,
      {
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        ],
      },
      {
        where: { id: req.params.id },
      }
    );

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }

  // Delete - Método para DELETAR
  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    // Erro. Entregador não foi encontrado.
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    // Erro. Entregador já foi excluido.
    if (deliveryman.deleted_at) {
      return res.status(400).json({ error: 'Deliveryman already deleted.' });
    }

    // Tudo certo para ALTERAR o Entregador
    // Marcar a coluna "deleted_at" com a data da exclusão
    deliveryman.deleted_at = new Date();

    await deliveryman.save();

    return res.json({ deliveryman });
  }
}

export default new DeliverymanController();
