import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AccessLogsService } from './access-logs.service';
import { AccessLog, EventType } from './access-log.entity';

@Controller('access-logs')
export class AccessLogsController {
  constructor(private readonly accessLogsService: AccessLogsService) {}

  @Get()
  async findAll(): Promise<AccessLog[]> {
    return await this.accessLogsService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<AccessLog[]> {
    return await this.accessLogsService.findByUser(+userId);
  }

  @Get('event/:eventType')
  async findByEventType(
    @Param('eventType') eventType: EventType,
  ): Promise<AccessLog[]> {
    return await this.accessLogsService.findByEventType(eventType);
  }

  @Get('user/:userId/last-login')
  async getLastLogin(
    @Param('userId') userId: string,
  ): Promise<AccessLog | null> {
    return await this.accessLogsService.getLastLogin(+userId);
  }

  @Get('user/:userId/last-logout')
  async getLastLogout(
    @Param('userId') userId: string,
  ): Promise<AccessLog | null> {
    return await this.accessLogsService.getLastLogout(+userId);
  }

  @Post()
  async createLog(
    @Body()
    body: {
      userId: number;
      ipAddress: string;
      eventType: EventType;
      browser: string;
    },
  ): Promise<AccessLog> {
    return await this.accessLogsService.createLog(
      body.userId,
      body.ipAddress,
      body.eventType,
      body.browser,
    );
  }
}
