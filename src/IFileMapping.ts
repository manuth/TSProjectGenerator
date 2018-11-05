import { Answers } from "yeoman-generator";
import { IComponentDestination } from "./IComponentDestination";

/**
 * Represents a file-mapping.
 */
export interface IFileMapping<T extends Answers>
{
    /**
     * Gets or sets the path to the template of the component.
     */
    Source: string | ((answers: T) => string) | ((answers: T) => Promise<string>);

    /**
     * The context to use for copying the file-entry.
     */
    Context?: ((answers: T) => any | Promise<any>);

    /**
     * Gets or sets the destination to save the component to.
     */
    Destination: IComponentDestination | string | ((answers: T) => string | Promise<string>);
}