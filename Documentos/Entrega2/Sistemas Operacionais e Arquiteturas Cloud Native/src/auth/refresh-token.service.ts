import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { createHash, randomBytes } from 'crypto';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private repo: Repository<RefreshToken>,
  ) {}

  private hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async create(
    userId: string,
    meta: { ip?: string; ua?: string },
  ): Promise<string> {
    const rawToken = randomBytes(64).toString('hex');
    const hashedToken = this.hash(rawToken);

    const refreshToken = this.repo.create({
      token: hashedToken,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      ipAddress: meta.ip,
      userAgent: meta.ua,
    });

    await this.repo.save(refreshToken);
    return rawToken; // retorna o token RAW — salva só o hash
  }

  async rotate(rawToken: string, meta: { ip?: string; ua?: string }) {
    const hashed = this.hash(rawToken);
    const existing = await this.repo.findOne({
      where: { token: hashed },
      relations: ['user'],
    });

    if (!existing) throw new UnauthorizedException('Refresh token inválido');
    if (existing.revoked) {
      // REUSO DETECTADO: revogar toda a família de tokens
      await this.repo.update({ userId: existing.userId }, { revoked: true });
      throw new UnauthorizedException('Token reutilizado — sessão encerrada');
    }
    if (existing.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    // Revogar o token atual
    const newRaw = await this.create(existing.userId, meta);
    existing.revoked = true;
    existing.replacedByToken = this.hash(newRaw);
    await this.repo.save(existing);

    return { user: existing.user, newRefreshToken: newRaw };
  }

  async revoke(rawToken: string): Promise<void> {
    const hashed = this.hash(rawToken);
    await this.repo.update({ token: hashed }, { revoked: true });
  }

  async revokeAll(userId: string): Promise<void> {
    await this.repo.update({ userId }, { revoked: true });
  }

  async cleanup(): Promise<void> {
    // Rodar via cron job — remover tokens expirados
    await this.repo.delete({ expiresAt: LessThan(new Date()) });
  }
}
