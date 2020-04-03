import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  // Store - Método para CRIAR um Problema de Encomenda
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required().max(1000),
    });

    // Erro de validação. Alguns dos campos não estão no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Recebendo os campos do corpo da requisição
    // const { description } = req.body;

    // Erro. Entrega não encontrada.
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    // Erro. Entrega não foi Aberta (start_date = null)
    if (delivery.start_date === null) {
      return res
        .status(400)
        .json({ error: 'Delivery needs to be received by a deliveryman.' });
    }

    // Erro. Entrega já foi Entregue (end_date != null)
    if (delivery.end_date !== null) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been closed by a deliveryman.' });
    }

    // Erro. Entrega está Cancelada (canceled_at != null)
    if (delivery.canceled_at !== null) {
      return res.status(400).json({ error: 'Delivery has canceled.' });
    }

    // Recebendo os campos do corpo da requisição
    const { description } = req.body;

    // Tudo certo para CRIAR o Problema da Entrega
    // const { id, description } = await DeliveryProblem.create(req.body);

    const problem = new DeliveryProblem();
    problem.delivery_id = delivery.id;
    problem.description = description;

    console.log(problem);

    await DeliveryProblem.create({ problem, delivery });

    return res.json({
      problem,
    });
  }
}

export default new DeliveryProblemController();
