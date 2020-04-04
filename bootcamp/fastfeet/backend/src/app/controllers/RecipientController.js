import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  // Store - Método para SALVAR
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.number().required().positive().integer(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required().max(2),
      cep: Yup.string().required(),
    });

    // Erro de validação. Alguns dos campos não estão no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Tudo certo para CRIAR o Destinatário
    const {
      id,
      name,
      addres,
      number,
      complement,
      city,
      state,
      cep,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      addres,
      number,
      complement,
      city,
      state,
      cep,
    });
  }

  // Update - Método para ATUALIZAR
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.number().required().positive().integer(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required().max(2),
      cep: Yup.string().required(),
    });

    // Erro de validação. Alguns dos campos não estão no padrão
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    // Erro. Usuário não foi encontrado.
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    // Tudo certo para ALTERAR o Destinatário
    const {
      id,
      name,
      addres,
      number,
      complement,
      city,
      state,
      cep,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      addres,
      number,
      complement,
      city,
      state,
      cep,
    });
  }
}

export default new RecipientController();
