import { Module } from '@nestjs/common';
import { PlantsModule } from './plants/plants.module';

@Module({
  imports: [PlantsModule],
})
export class AppModule {}
