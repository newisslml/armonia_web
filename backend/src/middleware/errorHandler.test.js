const { z } = require('zod');
import { errorHandler, ApiError } from './errorHandler';

function fakeRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('errorHandler', () => {
  it('responde 400 con detalles si es un ZodError', () => {
    const schema = z.object({ email: z.string().email() });
    const result = schema.safeParse({ email: 'no-es-email' });
    const res = fakeRes();

    errorHandler(result.error, {}, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Datos invalidos' }));
  });

  it('responde con el status de un ApiError', () => {
    const res = fakeRes();
    errorHandler(new ApiError(404, 'no encontrado'), {}, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'no encontrado' });
  });

  it('responde 500 para cualquier otro error', () => {
    const res = fakeRes();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    errorHandler(new Error('inesperado'), {}, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    spy.mockRestore();
  });
});
