import { http, HttpResponse, delay } from 'msw';
import { ATESTADOS_FIXTURE } from '../fixtures/atestados';

export const atestadosHandlers = [
  http.get('/api/atestados', async () => {
    await delay(200);
    return HttpResponse.json(ATESTADOS_FIXTURE);
  }),
];
