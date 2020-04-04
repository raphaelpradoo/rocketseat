import * as Yup from 'yup';
import { isBefore, isAfter } from 'date-fns';

import File from '../models/File';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';

class DeliverymanFeaturesController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    // Erro. Entregador não foi encontrado.
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    // Filtra todas as Entregas do Entregador que:
    // - Não estejam entregues (end_date = null)
    // - Não foram canceladas (canceled_at = null)
    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
      order: ['id'],
      // limit: 20,
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

  async deliveries(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    // Erro. Entregador não foi encontrado.
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    // Filtra todas as Entregas do Entregador que:
    // - Já foram entregues (end_date != null)
    const response = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
      },
      order: ['id'],
      // limit: 20,
      attributes: ['id', 'product', 'end_date'],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    const deliveries = response.filter((d) => d.end_date !== null);

    return res.json(deliveries);
  }

  async receive(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id_deliveryman);

    // Erro. Entregador não foi encontrado.
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    // Filtra todas as Entregas do Entregador que:
    // - Não estejam entregues (end_date = null)
    // - Não foram canceladas (canceled_at = null)
    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id_deliveryman,
        canceled_at: null,
        end_date: null,
      },
      order: ['id'],
      attributes: ['id', 'product'],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    // Verifica se a entrega (id_delivery) existe
    const delivery = deliveries.find(
      (d) => d.id === Number(req.params.id_delivery)
    );

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    // Erro de Validação. A hora da RECEBIMENTO da Entrega deve estar entre 08h e 18h.
    const currentTime = new Date();
    const start = new Date();
    start.setHours(8);
    start.setMinutes(0);
    start.setSeconds(0);

    const end = new Date();
    end.setHours(18);
    end.setMinutes(0);
    end.setSeconds(0);

    const before = isBefore(currentTime, start);
    const after = isAfter(currentTime, end);

    if (before || after) {
      return res.status(400).json({
        error: 'The Delivery Receive time must be between 8 am and 6 pm.',
      });
    }

    // Tudo certo para ALTERAR a data e hora da RECEBIMENTO da Entrega (SET start_date)
    delivery.start_date = currentTime;

    await delivery.save();

    return res.json({ delivery });
  }

  async close(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number().positive().required(),
    });

    // Erro de validação. O campo não está no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const signature = await File.findByPk(req.body.signature_id);
    // Erro. Assinatura não encontrada.
    if (!signature) {
      return res.status(404).json({ error: 'Signature file not found.' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id_deliveryman);

    // Erro. Entregador não foi encontrado.
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    // Filtra todas as Entregas do Entregador que:
    // - Não estejam entregues (end_date = null)
    // - Não foram canceladas (canceled_at = null)
    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id_deliveryman,
        canceled_at: null,
        end_date: null,
      },
      order: ['id'],
      attributes: ['id', 'product', 'start_date'],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    // Verifica se a entrega (id_delivery) existe
    const delivery = deliveries.find(
      (d) => d.id === Number(req.params.id_delivery)
    );

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    // Só pode ENCERRAR a Entrega se o Entregador recebeu ela (start_date != null)
    if (!delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'Delivery needs to be received by a deliveryman.' });
    }

    // Erro de Validação. A hora do ENCERRAMENTO da Entrega deve estar entre 08h e 18h.
    const currentTime = new Date();
    const start = new Date();
    start.setHours(8);
    start.setMinutes(0);
    start.setSeconds(0);

    const end = new Date();
    end.setHours(18);
    end.setMinutes(0);
    end.setSeconds(0);

    const before = isBefore(currentTime, start);
    const after = isAfter(currentTime, end);

    if (before || after) {
      return res.status(400).json({
        error: 'The Delivery Close time must be between 8 am and 6 pm.',
      });
    }

    // Tudo certo para ALTERAR a data e hora do ENCERRAMENTO da Entrega (SET end_date)
    delivery.end_date = currentTime;
    delivery.signature_id = signature.id;

    await delivery.save();

    return res.json({ delivery });
  }
}

export default new DeliverymanFeaturesController();
