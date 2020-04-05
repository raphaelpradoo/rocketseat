import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

import CancellationDeliveryMail from '../jobs/CancellationDeliveryMail';
import Queue from '../../lib/Queue';

class CompanyFeaturesController {
  // Index - Método para Listar as Entregas com Problema
  async index(req, res) {
    const deliveries = await DeliveryProblem.findAll({
      attributes: ['id', 'delivery_id', 'description'],
      order: ['id'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'deliveryman_id', 'recipient_id', 'product'],
        },
      ],
    });

    return res.json(deliveries);
  }

  // Delete - Método para DELETAR uma Entregas com Problema
  async delete(req, res) {
    const delivery_problem = await DeliveryProblem.findOne({
      where: {
        delivery_id: req.params.id,
      },
    });

    // Erro. Entrega com Problema não foi encontrada.
    if (!delivery_problem) {
      return res.status(404).json({ error: 'Delivery Problem not found.' });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_problem.delivery_id,
      },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

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

    // Tudo certo para Deletar a Entrega
    // Marcar a coluna "canceled_at" com a data da Exclusão
    delivery.canceled_at = new Date();

    await delivery.save();

    const recipient = await Recipient.findByPk(delivery.recipient_id);

    // Enviar e-mail para o Entregador informando o Cancelamento.
    await Queue.add(CancellationDeliveryMail.key, {
      deliveryman: delivery.deliveryman.name,
      email: delivery.deliveryman.email,
      recipient,
      product: delivery.product,
      problem: delivery_problem.description,
    });
    return res.json({ delivery });
  }
}

export default new CompanyFeaturesController();
