import { Module } from '@nestjs/common';
import { AtestadosController } from './atestados.controller';
import { AtestadosService } from './atestados.service';

@Module({
  controllers: [AtestadosController],
  providers: [AtestadosService],
})
export class AtestadosModule {}
