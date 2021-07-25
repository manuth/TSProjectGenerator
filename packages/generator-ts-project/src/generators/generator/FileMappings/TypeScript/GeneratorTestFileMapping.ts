import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { ISuiteContext } from "../../../../Project/FileMappings/TypeScript/ISuiteContext";
import { TestFileMapping } from "../../../../Project/FileMappings/TypeScript/TestFileMapping";
import { NamingContext } from "./NamingContext";

/**
 * Provides the functionality to create a file for testing a generator.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class GeneratorTestFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends TestFileMapping<TSettings, TOptions>
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
            SuiteName: this.NamingContext.GeneratorClassName
        };
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The name of the suite.
     */
    public override async GetSuiteName(): Promise<string>
    {
        return this.NamingContext.GeneratorClassName;
    }
}
