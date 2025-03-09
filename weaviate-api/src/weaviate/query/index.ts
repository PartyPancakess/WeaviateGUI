import { GetCollectionInfoHandler } from './impl/get-collection-info.handler';
import { GetCollectionJSONHandler } from './impl/get-collection-json.handler';
import { GetCollectionListHandler } from './impl/get-collection-list.handler';
import { GetDBInfoHandler } from './impl/get-db-info.handler';
import { GetMigrationStatusHandler } from './impl/get-migration-status.handler';
import { GetPropertiesHandler } from './impl/get-properties.handler';
import { GetTenantListHandler } from './impl/get-tenant-list.handler';
import { GetTenantHandler } from './impl/get-tenant.handler';
import { GetVectorCountHandler } from './impl/get-vector-count.handler';
import { GetVectorListHandler } from './impl/get-vector-list.handler';

export const QueryHandlers = [
  GetDBInfoHandler,
  GetCollectionListHandler,
  GetCollectionInfoHandler,
  GetCollectionJSONHandler,
  GetTenantListHandler,
  GetTenantHandler,
  GetVectorListHandler,
  GetVectorCountHandler,
  GetPropertiesHandler,
  GetMigrationStatusHandler,
];
