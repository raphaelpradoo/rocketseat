import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CreateDeliveryMail {
  get key() {
    return 'CreateDeliveryMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Encomenda Cadastrada',
      template: 'create',
      context: {
        provider: delivery.deliveryman.name,
        user: delivery.deliveryman.name,
        date: format(
          parseISO(delivery.start_date),
          "'dia' dd 'de' MMMM', às' HH:mm'h'",
          { locale: pt }
        ),
      },
    });
  }
}

export default new CreateDeliveryMail();
