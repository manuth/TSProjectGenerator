import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { SuiteFileMapping } from "../../../../Project/FileMappings/TypeScript/SuiteFileMapping.js";
import { NamingContext } from "./NamingContext.js";

/**
 * Provides the functionality to create a test-suite for a generator.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class GeneratorSuiteFileMappingBase<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends SuiteFileMapping<TSettings, TOptions>
{
    /**
     * A component which provides constants for naming generated files and components.
     */
    private namingContext: NamingContext;

    /**
     * Initializes a new instance of the {@link GeneratorSuiteFileMappingBase `GeneratorSuiteFileMappingBase<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
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
     * Gets a component which provides constants for naming generated files and components.
     */
    protected get NamingContext(): NamingContext
    {
        return this.namingContext;
    }
}
