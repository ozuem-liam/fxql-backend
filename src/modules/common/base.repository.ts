import { PrismaService } from './prisma.service';

/**
 * Base repository class which all other repositories extend.
 *
 * Repositories are responsible for handling all database interactions.
 */
export class BaseRepository {
  /**
   *
   */
  constructor(
    public prisma: PrismaService,
  ) {
    this.prisma = new PrismaService();
  }
}
