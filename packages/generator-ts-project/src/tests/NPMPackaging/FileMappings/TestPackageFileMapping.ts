import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { PackageFileMapping } from "../../../NPMPackaging/FileMappings/PackageFileMapping";
import { IScriptMapping } from "../../../NPMPackaging/Scripts/IScriptMapping";
import { ITestPackageOptions } from "./ITestPackageOptions";

/**
 * Provides an implementation of the {@link PackageFileMapping `PackageFileMapping<TSettings, TOptions>`} class for testing.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TestPackageFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends PackageFileMapping<TSettings, TOptions>
{
    /**
     * The options for the file-mapping.
     */
    private options: ITestPackageOptions<TSettings, TOptions>;

    /**
     * Initializes a new instance of the {@link TestPackageFileMapping `TestPackageFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param options
     * The options for the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, options: ITestPackageOptions<TSettings, TOptions>)
    {
        super(generator);
        this.options = options;
    }

    /**
     * Gets the scripts to copy from the template-package.
     */
    public override get ScriptMappings(): Array<IScriptMapping<TSettings, TOptions> | string>
    {
        return this.Options.ScriptMappings;
    }

    /**
     * Gets the template package.
     */
    public override get Template(): Promise<Package>
    {
        return (
            async () =>
            {
                return this.Options.Template;
            })();
    }

    /**
     * Gets the options for the file-mapping.
     */
    protected get Options(): ITestPackageOptions<TSettings, TOptions>
    {
        return this.options;
    }
}
