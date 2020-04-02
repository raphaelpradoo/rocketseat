// import * as Yup from 'yup';
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
      limit: 20,
      attributes: ['id', 'product', 'end_date'],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    const deliveries = response.find((d) => d.end_date !== null);

    return res.json(deliveries);
  }
}

export default new DeliverymanFeaturesController();
