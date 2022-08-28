import { GeneratorOptions, GeneratorSettingKey, IGenerator } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { TSProjectPackageFileMapping } from "../../../../Project/FileMappings/NPMPackaging/TSProjectPackageFileMapping";
import { TSGeneratorDependencies } from "../../Dependencies/TSGeneratorDependencies";
import { TSGeneratorExampleDependencies } from "../../Dependencies/TSGeneratorExampleDependencies";
import { ITSGeneratorSettings } from "../../Settings/ITSGeneratorSettings";
import { TSGeneratorComponent } from "../../Settings/TSGeneratorComponent";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../../TSGeneratorGenerator";

/**
 * Represents a file-mapping for the `package.json` file for {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSGeneratorPackageFileMapping<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectPackageFileMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSGeneratorPackageFileMapping `TSGeneratorPackageFileMapping<TSettings, TOptions>`} class.
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
     */
    public override get Keywords(): string[]
    {
        return [
            ...super.Keywords,
            "yeoman-generator"
        ];
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
