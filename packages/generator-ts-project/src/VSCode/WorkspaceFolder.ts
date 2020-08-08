/**
 * Represents a workspace folder.
 */
type WorkspaceFolder = {
    /**
     * The name of the workspace folder.
     */
    name?: string;
} & (
        {
            /**
             * The path to the workspace folder.
             */
            path: string;
        } |
        {
            /**
             * The URI to the workspace folder.
             */
            uri: string;
        }
    );
