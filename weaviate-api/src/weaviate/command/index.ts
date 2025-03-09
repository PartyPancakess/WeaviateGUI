import { BackupHandler } from './impl/backup.handler';
import { CloneCollectionHandler } from './impl/clone-collection.handler';
import { CloneTenantHandler } from './impl/clone-tenant.handler';
import { CopyCollectionHandler } from './impl/copy-collection.handler';
import { CopyTenantHandler } from './impl/copy-tenant.handler';
import { CreateCollectionHandler } from './impl/create-collection.handler';
import { CreateTenantHandler } from './impl/create-tenant.handler';
import { CreateVectorHandler } from './impl/create-vector.handler';
import { DeleteCollectionHandler } from './impl/delete-collection.handler';
import { DeleteTenantHandler } from './impl/delete-tenant.handler';
import { DeleteVectorHandler } from './impl/delete-vector.handler';
import { DeleteVectorsHandler } from './impl/delete-vectors.handler';
import { RestoreHandler } from './impl/restore.handler';
import { UpdateCollectionHandler } from './impl/update-collection.handler';
import { UpdateTenantHandler } from './impl/update-tenant.handler';
import { UpdateVectorHandler } from './impl/update-vector.handler';

export const CommandHandlers = [
  CreateCollectionHandler,
  DeleteCollectionHandler,
  CreateTenantHandler,
  DeleteTenantHandler,
  UpdateTenantHandler,
  CreateVectorHandler,
  DeleteVectorHandler,
  DeleteVectorsHandler,
  UpdateVectorHandler,
  UpdateCollectionHandler,

  // Migration
  CloneCollectionHandler,
  CloneTenantHandler,
  CopyCollectionHandler,
  CopyTenantHandler,
  BackupHandler,
  RestoreHandler,
];
