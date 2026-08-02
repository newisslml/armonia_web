import { asyncHandler } from './asyncHandler';

describe('asyncHandler', () => {
  it('llama al handler con req/res/next', async () => {
    const handler = vi.fn().mockResolvedValue('ok');
    const next = vi.fn();
    await asyncHandler(handler)('req', 'res', next);
    expect(handler).toHaveBeenCalledWith('req', 'res', next);
    expect(next).not.toHaveBeenCalled();
  });

  it('pasa el error a next si el handler rechaza', async () => {
    const error = new Error('boom');
    const handler = vi.fn().mockRejectedValue(error);
    const next = vi.fn();
    await asyncHandler(handler)('req', 'res', next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
