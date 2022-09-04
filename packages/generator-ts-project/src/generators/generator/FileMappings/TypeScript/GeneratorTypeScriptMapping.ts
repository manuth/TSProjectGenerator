import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectTypeScriptFileMapping } from "../../../../Project/FileMappings/TypeScript/TSProjectTypeScriptFileMapping.js";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
import { NamingContext } from "./NamingContext.js";

/**
 * Provides the functionality to create typescript-files for a generator.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class GeneratorTypeScriptMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TSProjectTypeScriptFileMapping<TSettings, TOptions>
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
