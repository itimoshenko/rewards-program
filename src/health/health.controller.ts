import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';

@Controller('health')
/**
 * Controller providing health check methods
 */
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get('service')
  @HealthCheck()
  /**
   * Returns the result of the rewards service health check
   *
   * @returns {Promise<HealthCheckResult>}
   */
  checkRewardService(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.http.pingCheck('rewards', process.env.HEALTH_SERVICE_URL),
    ]);
  }

  @Get('database')
  @HealthCheck()
  /**
   * Returns the result of the rewards database health check
   *
   * @returns {Promise<HealthCheckResult>}
   */
  checkDatabase() {
    return this.health.check([
      () => this.db.pingCheck(process.env.DB_DATABASE_NAME),
    ]);
  }
}
