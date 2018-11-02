import { IComponentDestination } from "./IComponentDestination";

/**
 * Represents a component.
 */
export interface IComponent
{
    /**
     * Gets or sets the id of the component.
     */
    ID: string;

    /**
     * Gets or sets the human-readable name of the component.
     */
    DisplayName: string;

    /**
     * Gets or sets the path to the template of the component.
     */
    Template?: string;

    /**
     * Gets or sets the destination to save the component to.
     */
    Destination?: IComponentDestination | string;
}