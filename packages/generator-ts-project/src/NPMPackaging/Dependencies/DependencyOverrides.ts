import { PackageDependencyCollectionOptions } from "@manuth/package-json-editor";

/**
 * Represents a set of dependency overrides.
 */
export type DependencyOverrides = {
    [K in keyof PackageDependencyCollectionOptions]?: Record<string, string>;
};
