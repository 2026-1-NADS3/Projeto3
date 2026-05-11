import { Request } from 'express';
import { User } from '../../auth/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface MercadoPagoWebhookBody {
  action?: string;
  type?: string;
  data?: {
    id?: string;
  };
  live_mode?: boolean;
}

export interface MercadoPagoWebhookHeaders {
  'x-signature'?: string;
  'x-request-id'?: string;
}

export interface WebhookRequest extends Request {
  headers: MercadoPagoWebhookHeaders & Request['headers'];
  body: MercadoPagoWebhookBody;
}
