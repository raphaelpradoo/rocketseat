import * as Yup from 'yup';

import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';

import CreateDeliveryMail from '../jobs/CreateDeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  // Index - Método para LISTAR todas Encomendas
  async index(req, res) {
    // Filtra as Encomendas que:
    // - Não foram canceladas (canceled_at = null)
    // - Não estão Entregues (end_data = null)
    const deliveries = await Delivery.findAll({
      where: { canceled_at: null, end_date: null },
      order: ['id'],
      // limit: 20,
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'address',
            'number',
            'complement',
            'city',
            'state',
            'cep',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(deliveries);
  }

  // Store - Método para CRIAR uma Encomenda
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required().max(255),
      canceled_at: Yup.date().nullable(),
      start_date: Yup.date().nullable(),
      end_date: Yup.date().nullable(),
    });

    // Erro de validação. Alguns dos campos não estão no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Recebendo alguns campos do corpo da requisição
    const { recipient_id, deliveryman_id, start_date } = req.body;

    // Erro. Destinatário não encontrado.
    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    // Erro. Entregador não encontrado.
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    // Erro. Entregador foi excluido
    if (deliveryman && deliveryman.deleted_at) {
      return res.status(400).json({ error: 'Deliveryman was deleted.' });
    }

    // Tudo certo para CRIAR a Entrega
    const { id, product, canceled_at, end_date } = await Delivery.create(
      req.body
    );

    // Enviar e-mail para o Entregador confirmando a Entrega.
    await Queue.add(CreateDeliveryMail.key, { deliveryman });

    return res.json({
      id,
      recipient,
      deliveryman,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }

  // Update - Método para ATUALIZAR uma Encomenda
  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required().max(255),
      canceled_at: Yup.date().nullable(),
    });

    // Erro de validação. Alguns dos campos não estão no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Recebendo alguns campos do corpo da requisição
    const { recipient_id, deliveryman_id } = req.body;

    const delivery = await Delivery.findByPk(req.params.id);

    // Erro. Entrega não foi encontrada.
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    // Erro. Entrega está cancelada
    if (delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been canceled.' });
    }

    // Erro. Destinatário não encontrado.
    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    // Erro. Entregador não encontrado.
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    // Erro. Entregador foi excluido
    if (deliveryman && deliveryman.deleted_at) {
      return res.status(400).json({ error: 'Deliveryman was deleted.' });
    }

    // Tudo certo para ALTERAR a Entrega
    const { id, product } = await delivery.update(req.body, {
      where: { id: req.params.id },
    });

    return res.json({
      id,
      product,
      recipient,
      deliveryman,
    });
  }

  // Delete - Método para DELETAR uma Encomenda
  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    // Erro. Entrega não foi encontrada.
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    // Erro. Entrega já está cancelada
    if (delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been canceled.' });
    }

    // Erro. Verificar se a Entrega já foi Entregue (end_date != null)
    if (delivery.end_date) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been delivered.' });
    }

    // Tudo certo para Finalizar a Entrega
    // Marcar a coluna "canceled_at" com a data do CANCELAMENTO
    delivery.canceled_at = new Date();

    await delivery.save();

    return res.json({ delivery });
  }
}

export default new DeliveryController();