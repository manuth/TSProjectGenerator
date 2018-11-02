import { IComponent } from "./IComponent";

/**
 * Represents a category which contains components.
 */
export interface IComponentCategory
{
    /**
     * Gets or sets the human-readable name of the category.
     */
    DisplayName: string;

    /**
     * Gets or sets the components of the category.
     */
    Components: IComponent[];
}