import Mail from '../../lib/Mail';

class CancellationDeliveryMail {
  get key() {
    return 'CancellationDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, email, product, recipient, problem } = data;

    await Mail.sendMail({
      to: `${deliveryman} <${email}>`,
      subject: 'Encomenda Cancelada',
      template: 'cancel',
      context: {
        deliveryman,
        product,
        recipient: recipient.name,
        address: recipient.address,
        number: recipient.number,
        complement: recipient.complement ? recipient.complement : '',
        city: recipient.city,
        state: recipient.state,
        cep: recipient.cep,
        problem,
      },
    });
  }
}

export default new CancellationDeliveryMail();
