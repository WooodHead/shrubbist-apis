import { Controller, Get, Query, Param } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { ParseOptionalIntPipe } from '../common/pipes/parse-optional-int.pipe';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Get('heartbeat')
  healthcheck(): Promise<object> {
    return this.plantsService.healthcheck();
  }

  @Get('search')
  searchPlants(
    @Query('q') q,
    @Query('page.number', new ParseOptionalIntPipe()) pageNumber: number = 1,
  ): object {
    return this.plantsService.searchPlants(q, pageNumber);
  }

  @Get(':id')
  getPlant(@Param('id') id): object {
    return this.plantsService.getPlant(id);
  }
}
