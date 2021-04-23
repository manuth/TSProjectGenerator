declare global
{
    /**
     * @inheritdoc
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Function
    {
        /**
         * The human-readable name of the task.
         */
        displayName: string;

        /**
         * The description of the task.
         */
        description: string;
    }
}

export { };
