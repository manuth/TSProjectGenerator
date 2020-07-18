import { IDependencyCollectionOptions } from "@manuth/package-json-editor";

/**
 * Provides options for the `PackageDependencyCollection` class.
 */
export type PackageDependencyCollectionOptions =
    Partial<Record<keyof Omit<IDependencyCollectionOptions, "bundledDependencies">, string[]>>;
