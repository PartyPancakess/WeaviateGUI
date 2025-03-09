import { ICommand } from '@nestjs/cqrs';
import { BackupDto } from '../dto/backup.dto';

export class BackupCommand implements ICommand {
  constructor(readonly dto: BackupDto) {}
}
