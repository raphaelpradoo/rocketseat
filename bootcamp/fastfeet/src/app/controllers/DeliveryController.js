import * as Yup from 'yup';
import { isPast, parseISO, isBefore, isAfter } from 'date-fns';

import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Delivery from '../models/Delivery';

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
      limit: 20,
      attributes: ['id', 'product'],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
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
      signature_id: Yup.number().nullable(),
      product: Yup.string().required().max(255),
      canceled_at: Yup.date().nullable(),
      start_date: Yup.date().nullable(false),
      end_date: Yup.date().nullable(),
    });

    // Erro de validação. Alguns dos campos não estão no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Recebendo alguns campos do corpo da requisição
    const { recipient_id, deliveryman_id, signature_id, start_date } = req.body;

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

    // Se tiver assinatura, verificar se o arquivo existe
    const signature = signature_id ? await File.findByPk(signature_id) : null;
    // Erro. Assinatura não encontrada.
    if (!signature) {
      return res.status(404).json({ error: 'Signature file not found.' });
    }

    // Erro. Não é possivel criar Entrega com data anterior à agora.
    if (isPast(parseISO(start_date))) {
      return res.status(400).json({ error: 'Past dates are not permitted.' });
    }

    // Erro de Validação. O campo start_date deve estar entre 08h e 18h.
    const delivery_time = parseISO(start_date);
    const start = new Date();
    start.setHours(8);
    start.setMinutes(0);
    start.setSeconds(0);

    const end = new Date();
    end.setHours(18);
    end.setMinutes(0);
    end.setSeconds(0);

    const before = isBefore(delivery_time, start);
    const after = isAfter(delivery_time, end);

    if (before || after) {
      return res
        .status(400)
        .json({ error: 'Delivery time must be between 8 am and 6 pm.' });
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
      signature,
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
      signature_id: Yup.number().nullable(),
      product: Yup.string().required().max(255),
      canceled_at: Yup.date().nullable(),
    });

    // Erro de validação. Alguns dos campos não estão no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Recebendo alguns campos do corpo da requisição
    const { recipient_id, deliveryman_id, signature_id } = req.body;

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

    // Se tiver assinatura, verificar se o arquivo existe
    const signature = signature_id ? await File.findByPk(signature_id) : null;
    // Erro. Assinatura não encontrada.
    if (!signature) {
      return res.status(404).json({ error: 'Signature file not found.' });
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
      signature,
    });
  }

  // Delete - Método para DELETAR uma Encomenda
  async delete(req, res) {
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

    // Tudo certo para Finalizar a Entrega
    // Marcar a coluna "end_date" com a data da entrega
    delivery.end_date = new Date();

    await delivery.save();

    return res.json({ delivery });
  }
}

export default new DeliveryController();
