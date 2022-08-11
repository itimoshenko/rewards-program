import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get('service')
  @HealthCheck()
  checkRewardService() {
    return this.health.check([
      () => this.http.pingCheck('rewards', process.env.HEALTH_SERVICE_URL),
    ]);
  }

  @Get('database')
  @HealthCheck()
  checkDataBase() {
    return this.health.check([
      () => this.db.pingCheck(process.env.DB_DATABASE_NAME),
    ]);
  }
}
