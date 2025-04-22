import { Global, Module } from '@nestjs/common';
import { CaslAbilityService } from './casl-ability/casl-ability.service';

@Global()
@Module({
  providers: [CaslAbilityService],
  exports: [CaslAbilityService],
})
export class CaslModule { }
