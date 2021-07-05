import { IDependencyCollectionOptions } from "@manuth/package-json-editor";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PackageDependencyCollection } from "./PackageDependencyCollection";

/**
 * Provides options for the {@link PackageDependencyCollection `PackageDependencyCollection`} class.
 */
export type PackageDependencyCollectionOptions =
    Partial<Record<keyof Omit<IDependencyCollectionOptions, "bundledDependencies">, string[]>>;
