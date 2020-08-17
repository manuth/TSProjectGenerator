import { GeneratorOptions, IGenerator, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { TSProjectPackageFileMapping } from "../../../../Project/FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { TSGeneratorDependencies } from "../../Dependencies/TSGeneratorDependencies";
import { TSGeneratorExampleDependencies } from "../../Dependencies/TSGeneratorExampleDependencies";
import { ITSGeneratorSettings } from "../../Settings/ITSGeneratorSettings";
import { TSGeneratorComponent } from "../../Settings/TSGeneratorComponent";

/**
 * Represents a file-mapping for the `package.json` file for `TSGenerator`s.
 */
export class TSGeneratorPackageFileMapping<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectPackageFileMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSGeneratorPackageFileMapping` class.
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
    protected async LoadPackage(): Promise<Package>
    {
        let result = await super.LoadPackage();

        if (!result.Keywords.includes("yeoman-generator"))
        {
            result.Keywords.push("yeoman-generator");
        }

        result.Register(new TSGeneratorDependencies(), true);

        if (
            this.Generator.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.GeneratorExample) ||
            this.Generator.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.SubGeneratorExample))
        {
            result.Register(new TSGeneratorExampleDependencies(), true);
        }

        return result;
    }
}
