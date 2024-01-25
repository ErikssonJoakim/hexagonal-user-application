export const ResourceAlreadyExistsError = (resourceIds: string[]) =>
  ({
    _tag: "resource-already-exists",
    resourceIds,
  } as const);

/**
 *  Error when an id of a resource to be stored already exists in the domain.
 */
export type ResourceAlreadyExistsError = ReturnType<
  typeof ResourceAlreadyExistsError
>;

export const ResourceNotFoundError = (resourceId: string) =>
  ({
    _tag: "resource-not-found",
    resourceId,
  } as const);

/**
 *  Error when the id of a resource is not found in the domain.
 */
export type ResourceNotFoundError = ReturnType<typeof ResourceNotFoundError>;

export type ResourceError = ResourceAlreadyExistsError | ResourceNotFoundError;

export const presentResourceError = (error: ResourceError): string => {
  switch (error._tag) {
    case "resource-already-exists": {
      return `Error ${
        error._tag
      }: Failed to store resource with conflicting identifiers [${error.resourceIds.join(
        ", "
      )}].`;
    }
    case "resource-not-found": {
      return `Error ${error._tag}: Failed to handle resource with identifier '${error.resourceId}' since it does not exist.`;
    }
  }
};

export const isResourceAlreadyExistsError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
): error is ResourceAlreadyExistsError =>
  !!error && error._tag === "resource-already-exists";
