import { Module } from '@nestjs/common';
import { AtestadosController } from './atestados.controller';

@Module({
  controllers: [AtestadosController],
})
export class AtestadosModule {}
