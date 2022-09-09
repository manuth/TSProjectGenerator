import { TempDirectory } from "@manuth/temp-files";

/**
 * Provides information about the result of a compilation.
 */
export interface ICompilationResult
{
    /**
     * The temporary directory containing the compiled files.
     */
    TempDirectory: TempDirectory;

    /**
     * The name of the file which has been requested to be compiled.
     */
    FileName: string;
}
