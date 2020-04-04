import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  // Index - Método para Listar todos os Problemas de uma Encomenda
  async index(req, res) {
    // Erro. Entrega não encontrada.
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    // Verifica se a Entrega tem algum Problema
    const problems = await DeliveryProblem.findAll({
      where: { delivery_id: req.params.id },
      order: ['id'],
      attributes: ['id', 'description'],
    });

    if (!problems) {
      return res.status(404).json({ error: 'Delivery no problem.' });
    }

    return res.json(problems);
  }

  // Store - Método para CRIAR um Problema de Encomenda
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required().max(1000),
    });

    // Erro de validação. Alguns dos campos não estão no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Erro. Entrega não encontrada.
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    // Erro. Entrega já foi cadastrado um Problema para esta Entrega.
    const some_problem = await DeliveryProblem.findOne({
      where: { delivery_id: delivery.id },
    });

    if (some_problem) {
      return res
        .status(400)
        .json({ error: 'Delivery already has a problem registered.' });
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
    const delivery_id = delivery.id;

    // Tudo certo para CRIAR o Problema da Entrega
    const problem = await DeliveryProblem.create({
      delivery_id,
      description,
    });

    return res.json(problem);
  }
}

export default new DeliveryProblemController();
