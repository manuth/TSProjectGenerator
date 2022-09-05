import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { ISuiteContext } from "../../../../Project/FileMappings/TypeScript/ISuiteContext.js";
import { TestFileMapping } from "../../../../Project/FileMappings/TypeScript/TestFileMapping.js";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
import { NamingContext } from "./NamingContext.js";

/**
 * Provides the functionality to create a file for testing a generator.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class GeneratorTestFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TestFileMapping<TSettings, TOptions>
{
    /**
     * A component which provides constants for the file-mapping.
     */
    private namingContext: NamingContext;

    /**
     * Initializes a new instance of the {@link GeneratorTestFileMapping `GeneratorTestFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param namingContext
     * A component which provides constants for the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, namingContext: NamingContext)
    {
        super(generator);
        this.namingContext = namingContext;
    }

    /**
     * Gets a component which provides constants for the file-mapping.
     */
    protected get NamingContext(): NamingContext
    {
        return this.namingContext;
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.NamingContext.GeneratorTestFileName;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The context.
     */
    public async Context(): Promise<ISuiteContext>
    {
        return {
            SuiteName: this.NamingContext.GeneratorClassName,
            SuiteFunction: {
                Name: this.NamingContext.GeneratorTestFunctionName,
                Description: `Registers tests for the \`${this.NamingContext.GeneratorClassName}\`.`
            }
        };
    }
}
