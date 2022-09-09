import { ProjectType } from "./ProjectType.js";

/**
 * Represents a component for loading generators.
 */
export type GeneratorLoader =
    /**
     * Loads a generator with the specified {@link projectType `projectType`}.
     *
     * @param projectType
     * The type of the project to load.
     */
    (projectType: ProjectType) => Promise<void>;
