import { Module } from '@nestjs/common';
import { CidController } from './cid.controller';
import { CidService } from './cid.service';

@Module({
  controllers: [CidController],
  providers: [CidService],
})
export class CidModule {}
