import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import * as plantsSearchConfig from '../common/configs/plants.search';
import { PlantsController } from './plants.controller';
import { PlantsService } from './plants.service';

@Module({
  imports: [ElasticsearchModule.register(plantsSearchConfig.default)],
  controllers: [PlantsController],
  providers: [PlantsService],
})
export class PlantsModule {}
