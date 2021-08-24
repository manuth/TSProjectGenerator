/**
 * Represents a project-type.
 */
export interface IProjectType
{
    /**
     * The human-readable name of the project.
     */
    DisplayName: string;

    /**
     * The path to the proper generator.
     */
    Path: string;
}
