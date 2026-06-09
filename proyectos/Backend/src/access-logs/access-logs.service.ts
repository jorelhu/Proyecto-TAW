import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLog, EventType } from './access-log.entity';

@Injectable()
export class AccessLogsService {
  constructor(
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
  ) {}

  async createLog(
    userId: number,
    ipAddress: string,
    eventType: EventType,
    browser: string,
  ): Promise<AccessLog> {
    const log = this.accessLogRepository.create({
      userId,
      ipAddress,
      eventType,
      browser,
    });
    return await this.accessLogRepository.save(log);
  }

  async findAll(): Promise<AccessLog[]> {
    return await this.accessLogRepository.find({
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<AccessLog[]> {
    return await this.accessLogRepository.find({
      where: { userId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByEventType(eventType: EventType): Promise<AccessLog[]> {
    return await this.accessLogRepository.find({
      where: { eventType },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getLastLogin(userId: number): Promise<AccessLog | null> {
    return await this.accessLogRepository.findOne({
      where: { userId, eventType: 'LOGIN' },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getLastLogout(userId: number): Promise<AccessLog | null> {
    return await this.accessLogRepository.findOne({
      where: { userId, eventType: 'LOGOUT' },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }
}
