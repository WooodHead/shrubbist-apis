import * as AWS from 'aws-sdk';
import * as connectionClass from 'http-aws-es';

export const INDEX = 'plants';
export const TYPE = 'plant';

export const es = {
  default: {
    host: `${process.env.SEARCH_URL}` || `localhost:9200`,
    log: 'error',
    connectionClass,
    amazonES: {
      credentials: new AWS.EnvironmentCredentials('AWS'),
      region: 'us-west-2',
    },
  },
};

export default es.default;
