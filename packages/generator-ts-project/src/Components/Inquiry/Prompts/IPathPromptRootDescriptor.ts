/**
 * Provides information about a root-directory.
 */
export interface IPathPromptRootDescriptor
{
    /**
     * The path to the root-directory.
     */
    path: string;

    /**
     * A value indicating whether paths outside the {@link PathPromptRootDescriptor.path `path`} are allowed.
     */
    allowOutside?: boolean;
}
