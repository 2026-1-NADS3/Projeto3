import { Controller, Post, Req, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { PaymentsService } from './payments.service';
import { MercadoPagoService } from './mercado-pago.service';
import { ConfigService } from '@nestjs/config';
import {
  WebhookRequest,
  MercadoPagoWebhookBody,
  MercadoPagoWebhookHeaders,
} from './interfaces';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly configService: ConfigService,
  ) {
    this.webhookSecret =
      this.configService.get<string>('MP_WEBHOOK_SECRET') || '';
  }

  @Post('mercadopago')
  @Public()
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Webhook Mercado Pago (público)' })
  async handleWebhook(
    @Req()
    req: WebhookRequest & {
      headers: MercadoPagoWebhookHeaders;
      body: MercadoPagoWebhookBody;
    },
  ) {
    try {
      const xSignature = req.headers['x-signature'];
      const xRequestId = req.headers['x-request-id'];
      const body: MercadoPagoWebhookBody = req.body ?? {
        action: undefined,
        type: undefined,
        data: { id: undefined },
        live_mode: undefined,
      };
      const dataId = body.data?.id;

      if (this.webhookSecret) {
        if (!xSignature) {
          this.logger.warn(
            'Webhook MP: x-signature ausente — ignorando evento.',
          );
          return;
        }

        const isValid = this.mercadoPagoService.verifySignature(
          xSignature,
          xRequestId,
          dataId ?? '',
        );
        if (!isValid) {
          this.logger.warn(
            'Webhook MP: assinatura inválida — ignorando evento.',
          );
          return;
        }
      }

      if (body.type !== 'payment' || !dataId) {
        this.logger.debug(
          `Webhook MP: evento ignorado (type=${body.type ?? 'undefined'}, dataId=${dataId ?? 'undefined'}).`,
        );
        return;
      }

      await this.paymentsService.handleWebhook(dataId);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Webhook MP: erro ao processar — ${msg}`, stack);
    }
  }
}
