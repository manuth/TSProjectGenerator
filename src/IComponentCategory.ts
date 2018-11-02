import { Answers } from "yeoman-generator";
import { IComponent } from "./IComponent";

/**
 * Represents a category which contains components.
 */
export interface IComponentCategory<T extends Answers>
{
    /**
     * Gets or sets the human-readable name of the category.
     */
    DisplayName: string;

    /**
     * Gets or sets the components of the category.
     */
    Components: IComponent<T>[];
}