import * as Yup from 'yup';
import File from '../models/File';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  // Index - Método para LISTAR

  // Store - Método para CRIAR
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      avatar_id: Yup.string(),
    });

    // Erro de validação. Alguns dos campos não estão no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Verifica se ja existe um Entregador com este e-mail
    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    // Erro. Não é possivel salvar Entregador com o e-mails repetidos.
    if (deliverymanExists) {
      return res.status(400).json({ error: 'User already exists.' });
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

  // Delete - Método para DELETAR
}

export default new DeliverymanController();
