/**
 * Represents a component of the `AppGenerator`.
 */
export enum TSGeneratorComponent
{
    /**
     * Indicates linting.
     */
    Linting = "linting",

    /**
     * Indicates the Visual Studio Code workspace.
     */
    VSCode = "vscode",

    /**
     * Indicates the generator example.
     */
    GeneratorExample = "example",

    /**
     * Indicates the sub-generator example.
     */
    SubGeneratorExample = "sub-example"
}