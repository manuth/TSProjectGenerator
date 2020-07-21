import { IFileMapping, IGeneratorSettings } from "@manuth/extended-yo-generator";

/**
 * Represents a constructor of a file-mapping.
 */
export type FileMappingConstructor<T extends IGeneratorSettings> =
    /**
     * Initializes a new instance of a file-mapping.
     *
     * @param args
     * A set of arguments.
     */
    new (...args: any[]) => IFileMapping<T>;
