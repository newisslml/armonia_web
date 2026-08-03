import { WebpayPlus } from 'transbank-sdk';
import { iniciarTransaccion, confirmarTransaccion } from './transbank.service';

describe('transbank.service', () => {
  const createMock = vi.fn();
  const commitMock = vi.fn();

  beforeEach(() => {
    createMock.mockReset();
    commitMock.mockReset();
    WebpayPlus.Transaction = vi.fn().mockImplementation(function () {
      return { create: createMock, commit: commitMock };
    });
  });

  it('iniciarTransaccion delega en tx.create con los datos del pedido', async () => {
    createMock.mockResolvedValue({ token: 'tok123', url: 'https://webpay/init' });

    const respuesta = await iniciarTransaccion({
      buyOrder: 'pedido-1',
      sessionId: 'usuario-1',
      amount: 9990,
      returnUrl: 'http://localhost/retorno',
    });

    expect(createMock).toHaveBeenCalledWith(
      'pedido-1',
      'usuario-1',
      9990,
      'http://localhost/retorno',
    );
    expect(respuesta.token).toBe('tok123');
  });

  it('confirmarTransaccion delega en tx.commit con el token', async () => {
    commitMock.mockResolvedValue({ status: 'AUTHORIZED', responseCode: 0 });

    const respuesta = await confirmarTransaccion('tok123');

    expect(commitMock).toHaveBeenCalledWith('tok123');
    expect(respuesta.status).toBe('AUTHORIZED');
  });
});
