/**
 * Represents an action that cannot be completed because it conflicts
 * with the current state of a resource.
 * Example: Trying to approve an application for an animal that is already pending adoption.
 */
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

/**
 * Represents a failure to find a requested resource.
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Represents an action that cannot proceed because a precondition was not met.
 * Example: Trying to finalize an adoption for an application that isn't approved.
 */
export class PreconditionFailedError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "PreconditionFailedError";
    }
  }