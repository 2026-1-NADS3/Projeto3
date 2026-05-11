import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  async findMine(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.notificationsService.findByUser(
      req.user.id,
      page || 1,
      pageSize || 20,
    );
  }

  @Get('unread-count')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  async unreadCount(@Request() req: any) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Patch(':id/read')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Post('mark-all-read')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  async markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}
