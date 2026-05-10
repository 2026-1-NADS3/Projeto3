import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000/api';

export default function () {
  const loginPayload = JSON.stringify({
    identifier: 'stress-test@example.com',
    password: 'wrongpassword123',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, params);
  check(loginRes, {
    'login responde 401 ou 429': (r) => r.status === 401 || r.status === 429,
  });

  const checkInPayload = JSON.stringify({
    prescriptionId: '00000000-0000-0000-0000-000000000000',
    exerciseId: '00000000-0000-0000-0000-000000000000',
    painLevel: 3,
    notes: 'Load test session',
    isCompleted: true,
    executedAt: new Date().toISOString(),
  });

  const checkInRes = http.post(`${BASE_URL}/check-ins`, checkInPayload, params);
  check(checkInRes, {
    'check-in responde 401 ou 403': (r) => r.status === 401 || r.status === 403,
  });

  const historyRes = http.get(`${BASE_URL}/check-ins/my-history`, params);
  check(historyRes, {
    'historico responde 401 ou 403': (r) => r.status === 401 || r.status === 403,
  });

  sleep(1);
}
