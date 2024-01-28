import type { IdProviderPort } from '@/application/ports/id-provider.port'
import { v4 as uuidv4 } from 'uuid'

export class RealIdProvider implements IdProviderPort {
  getId(): string {
    return uuidv4()
  }
}
