import { Module } from '@nestjs/common';
import { DesviosController } from './desvios.controller';
import { DesviosService } from './desvios.service';

@Module({
  controllers: [DesviosController],
  providers: [DesviosService],
})
export class DesviosModule {}
