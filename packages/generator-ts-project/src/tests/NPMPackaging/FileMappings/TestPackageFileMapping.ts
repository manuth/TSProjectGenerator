import { GeneratorOptions, IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { PackageFileMapping } from "../../../NPMPackaging/FileMappings/PackageFileMapping";
import { IScriptMapping } from "../../../NPMPackaging/Scripts/IScriptMapping";
import { ITestPackageOptions } from "./ITestPackageOptions";

/**
 * Provides an implementation of the `PackageFileMapping` class for testing.
 */
export class TestPackageFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends PackageFileMapping<TSettings, TOptions>
{
    /**
     * The options for the file-mapping.
     */
    private options: ITestPackageOptions<TSettings, TOptions>;

    /**
     * Initializes a new instance of the `TestPackageFileMapping` class.
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
    public get ScriptMappings(): Promise<Array<IScriptMapping<TSettings, TOptions> | string>>
    {
        return (
            async (): Promise<Array<IScriptMapping<TSettings, TOptions> | string>> =>
            {
                return this.Options.ScriptMappings;
            })();
    }

    /**
     * Gets the template package.
     */
    public get Template(): Promise<Package>
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
