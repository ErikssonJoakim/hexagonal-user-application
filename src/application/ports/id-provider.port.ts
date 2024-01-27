import type { ID } from '@/types/super-types'

export abstract class IdProviderPort {
  abstract getId(): ID
}
