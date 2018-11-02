import { Answers } from "yeoman-generator";

/**
 * Represents a destination of a component.
 */
export interface IComponentDestination
{
    /**
     * Gets or sets the message to ask for the destination.
     */
    Message: string;

    /**
     * Gets or sets the default destination.
     */
    Default: string | ((answers: Answers) => string) | ((answers: Answers) => Promise<string>);
}