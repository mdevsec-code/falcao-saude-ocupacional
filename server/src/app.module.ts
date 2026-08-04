import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { AttendancesModule } from './attendances/attendances.module';
import { AgendaModule } from './agenda/agenda.module';
import { ExamTypesModule } from './exam-types/exam-types.module';
import { AtestadosModule } from './atestados/atestados.module';
import { AuditModule } from './audit/audit.module';
import { HealthModule } from './health/health.module';
import { FeriasModule } from './ferias/ferias.module';
import { DesviosModule } from './desvios/desvios.module';
import { IndicadoresModule } from './indicadores/indicadores.module';
import { CidModule } from './cid/cid.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 100 }] }),
    PrismaModule,
    CommonModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    AttendancesModule,
    AgendaModule,
    ExamTypesModule,
    AtestadosModule,
    AuditModule,
    HealthModule,
    FeriasModule,
    DesviosModule,
    IndicadoresModule,
    CidModule,
    DashboardModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
