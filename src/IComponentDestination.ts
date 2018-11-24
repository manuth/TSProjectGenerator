import { Answers } from "yeoman-generator";

/**
 * Represents a destination of a component.
 */
export interface IComponentDestination<T extends Answers>
{
    /**
     * Gets or sets the message to ask for the destination.
     */
    Message: string;

    /**
     * Gets or sets the default destination.
     */
    Default: string | ((answers: T) => string) | ((answers: T) => Promise<string>);
}