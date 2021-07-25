import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TypeScriptCreatorMapping } from "../../../../Components/TypeScriptCreatorMapping";
import { NamingContext } from "./NamingContext";

/**
 * Provides the functionality to create typescript-files for a generator.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class GeneratorTypeScriptMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends TypeScriptCreatorMapping<TSettings, TOptions>
{
    /**
     * A component which provides constants for naming generated files and components.
     */
    private namingContext: NamingContext;

    /**
     * Initializes a new instance of the {@link GeneratorTypeScriptMapping `GeneratorTypeScriptMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param namingContext
     * A component which provides constants for naming generated files and components.
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
