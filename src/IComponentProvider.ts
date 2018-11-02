import { IComponentCategory } from "./IComponentCategory";

/**
 * Represents provided components.
 */
export interface IComponentProvider
{
    /**
     * Gets or sets the question to show when asking to choose components.
     */
    Question: string;

    /**
     * Gets or sets the provided categories.
     */
    Categories: IComponentCategory[];
}