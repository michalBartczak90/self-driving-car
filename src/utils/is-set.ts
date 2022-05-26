export function isSet<T>(obj: T | Unset): obj is T {
  return obj !== undefined && obj !== null;
}

export function isNotSet<T>(obj: T | Unset): obj is Unset {
  return obj === undefined || obj === null;
}

export type Unset = undefined | null;
