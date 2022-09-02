/**
 * A context for creating mocha-suites.
 */
export interface ISuiteContext
{
    /**
     * The name of the suite.
     */
    SuiteName: string;

    /**
     * The name of the suite function
     */
    SuiteFunctionName?: string;
}
