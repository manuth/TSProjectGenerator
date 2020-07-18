import { IGenerator, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { TSProjectPackageFileMapping } from "../../../../Project/FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { TSGeneratorDependencies } from "../../Dependencies/TSGeneratorDependencies";
import { TSGeneratorExampleDependencies } from "../../Dependencies/TSGeneratorExampleDependencies";
import { ITSGeneratorSettings } from "../../Settings/ITSGeneratorSettings";
import { TSGeneratorComponent } from "../../Settings/TSGeneratorComponent";

/**
 * Represents a file-mapping for the `package.json` file for `TSGenerator`s.
 */
export class TSGeneratorPackageFileMapping<T extends ITSGeneratorSettings> extends TSProjectPackageFileMapping<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorPackageFileMapping<T>` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<T>)
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
        result.Keywords.push("yeoman-generator");
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
