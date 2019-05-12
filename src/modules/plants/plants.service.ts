import {
  Injectable,
  ServiceUnavailableException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { version as apiVersion } from '../common/configs/service';
import { INDEX, TYPE } from '../common/configs/plants.search';

@Injectable()
export class PlantsService {
  private readonly logger = new Logger(PlantsService.name);
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async healthcheck(): Promise<object> {
    try {
      const health = await this.elasticsearchService
        .getClient()
        .cluster.health({});
      const healthy =
        health && (health.status === 'yellow' || health.status === 'green');
      return healthy
        ? {
            data: 'OK',
          }
        : new ServiceUnavailableException();
    } catch (e) {
      this.logger.error(e);
      throw new ServiceUnavailableException();
    }
  }

  async getPlant(id): Promise<object> {
    try {
      const { _source } = await this.elasticsearchService.getClient().get({
        id,
        index: INDEX,
        type: TYPE,
      });
      const response = {
        data: _source,
        meta: {
          citation:
            'USDA, NRCS. 2016. The PLANTS Database (http://plants.usda.gov, 12 July 2016). National Plant Data Team, Greensboro, NC 27401-4901 USA.',
        },
      };
      return response;
    } catch (e) {
      this.logger.error(e);
      const { status } = e;
      throw status === 404
        ? new NotFoundException()
        : new ServiceUnavailableException();
    }
  }

  async searchPlants(q, pageNumber = 1): Promise<object> {
    try {
      const pageSize = 15;

      const { hits } = await this.elasticsearchService.getClient().search({
        from: (pageNumber - 1) * pageSize,
        size: pageSize,
        q,
        index: INDEX,
        type: TYPE,
      });

      const data =
        hits.hits && hits.hits.length ? hits.hits.map(hit => hit._source) : [];
      const count = hits.total;
      const pages = Math.ceil(hits.total / pageSize);

      const response = {
        data,
        links: {
          self: `/${apiVersion}/plants/search?q=${q}&page.number=${pageNumber}`,
          first: `/${apiVersion}/plants/search?q=${q}&page.number=1`,
          last: `/${apiVersion}/plants/search?q=${q}&page.number=${pages}`,
          ...(count > pageSize &&
            pageNumber !== pages && {
              next: `/${apiVersion}/plants/search?q=${q}&page.number=${pageNumber +
                1}`,
            }),
          ...(pageNumber > 1 && {
            previous: `/${apiVersion}/plants/search?q=${q}&page.number=${pageNumber -
              1}`,
          }),
        },
        meta: {
          count,
          pages,
          citation:
            'USDA, NRCS. 2016. The PLANTS Database (http://plants.usda.gov, 12 July 2016). National Plant Data Team, Greensboro, NC 27401-4901 USA.',
        },
      };
      return response;
    } catch (e) {
      this.logger.error(e);
      const { status } = e;
      throw status === 404
        ? new NotFoundException()
        : new ServiceUnavailableException();
    }
  }
}
