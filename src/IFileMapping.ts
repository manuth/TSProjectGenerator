import { Answers } from "yeoman-generator";
import { IComponentDestination } from "./IComponentDestination";

/**
 * Represents a file-mapping.
 */
export interface IFileMapping<T extends Answers>
{
    /**
     * Gets or sets a tag for identifying the file-mapping.
     */
    Tag?: string;

    /**
     * Gets or sets the path to the template of the component.
     */
    Source: string | ((answers: T) => string | Promise<string>);

    /**
     * The context to use for copying the file-entry.
     */
    Context?: ((answers: T, source: string, destination: string) => any | Promise<any>);

    /**
     * Gets or sets the destination to save the component to.
     */
    Destination: IComponentDestination<T> | string | ((answers: T) => string | Promise<string>);
}