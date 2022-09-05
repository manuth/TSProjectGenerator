import { ISuiteFunctionInfo } from "./ISuiteFunctionInfo.js";

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
     * An object containing information about the suite function.
     */
    SuiteFunction?: ISuiteFunctionInfo;
}
