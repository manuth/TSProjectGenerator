import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { TSProjectPackageFileMapping } from "../../../../Project/FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSModuleGenerator } from "../../TSModuleGenerator";

/**
 * Represents a file-mapping for the `package.json` file of {@link TSModuleGenerator `TSModuleGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSModulePackageFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TSProjectPackageFileMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSModulePackageFileMapping `TSModulePackageFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The loaded package.
     */
    protected override async LoadPackage(): Promise<Package>
    {
        let result = await super.LoadPackage();
        result.Main = "lib/index.js";
        result.Types = "lib/index.d.ts";
        return result;
    }
}
