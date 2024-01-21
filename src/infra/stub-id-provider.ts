import type { IdProviderPort } from "@/application/ports/id-provider.port";
import type { ID } from "@/types/super-types";

export class StubIdProvider implements IdProviderPort {
  id: ID = "";

  getId(): ID {
    if (this.id.length === 0) {
      throw new Error("Stub id not set");
    }

    return this.id;
  }
}
