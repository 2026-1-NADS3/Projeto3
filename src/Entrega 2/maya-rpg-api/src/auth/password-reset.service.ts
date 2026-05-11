import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { RefreshTokenService } from './refresh-token.service';
import { MailService } from '../common/mail/mail.service';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private readonly resetTokenRepo: Repository<PasswordResetToken>,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly mailService: MailService,
  ) {}

  async recoverPassword(email: string) {
    const genericResponse = {
      message: 'Se o e-mail existir, você receberá um link de recuperação.',
    };

    if (!email) {
      return genericResponse;
    }

    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      return genericResponse;
    }

    await this.resetTokenRepo.update(
      { userId: user.id, used: false },
      { used: true },
    );

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    const entity = this.resetTokenRepo.create({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      used: false,
    });
    await this.resetTokenRepo.save(entity);

    await this.mailService.sendPasswordReset(user.email, rawToken);

    return genericResponse;
  }

  async resetPassword(token: string, newPassword: string) {
    if (!token) {
      throw new BadRequestException('Token obrigatório');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('Senha deve ter no mínimo 6 caracteres');
    }

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const stored = await this.resetTokenRepo.findOne({
      where: {
        tokenHash,
        used: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!stored) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const user = await this.userRepo.findOneBy({ id: stored.userId });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.mustChangePassword = false;
    await this.userRepo.save(user);

    stored.used = true;
    await this.resetTokenRepo.save(stored);

    await this.refreshTokenService.revokeAll(user.id);

    return { message: 'Senha redefinida com sucesso' };
  }
}
