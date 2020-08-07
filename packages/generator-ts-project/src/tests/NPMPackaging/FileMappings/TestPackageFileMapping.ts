import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { PackageFileMapping } from "../../../NPMPackaging/FileMappings/PackageFileMapping";
import { IScriptMapping } from "../../../NPMPackaging/Scripts/IScriptMapping";
import { ITestPackageOptions } from "./ITestPackageOptions";

/**
 * Provides an implementation of the `PackageFileMapping` class for testing.
 */
export class TestPackageFileMapping<T extends IGeneratorSettings> extends PackageFileMapping<T>
{
    /**
     * The options for the file-mapping.
     */
    private options: ITestPackageOptions<T>;

    /**
     * Initializes a new instance of the `TestPackageFileMapping` class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param options
     * The options for the file-mapping.
     */
    public constructor(generator: IGenerator<T>, options: ITestPackageOptions<T>)
    {
        super(generator);
        this.options = options;
    }

    /**
     * Gets the scripts to copy from the template-package.
     */
    public get ScriptMappings(): Promise<Array<IScriptMapping<T> | string>>
    {
        return (
            async (): Promise<Array<IScriptMapping<T> | string>> =>
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
    protected get Options(): ITestPackageOptions<T>
    {
        return this.options;
    }
}
