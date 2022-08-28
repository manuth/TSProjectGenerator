import { join } from "path";
import { ComponentCategoryOptions, GeneratorOptions, IComponent, IFileMapping } from "@manuth/extended-yo-generator";
import { SubGeneratorPrompt } from "../../../Components/Inquiry/Prompts/SubGeneratorPrompt.js";
import { GeneratorName } from "../../../Core/GeneratorName.js";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey.js";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { GeneratorClassFileMapping } from "../FileMappings/TypeScript/GeneratorClassFileMapping.js";
import { GeneratorIndexFileMapping } from "../FileMappings/TypeScript/GeneratorIndexFileMapping.js";
import { GeneratorTestFileMapping } from "../FileMappings/TypeScript/GeneratorTestFileMapping.js";
import { LicenseTypeFileMapping } from "../FileMappings/TypeScript/LicenseTypeFileMapping.js";
import { NamingContext } from "../FileMappings/TypeScript/NamingContext.js";
import { SettingKeyFileMapping } from "../FileMappings/TypeScript/SettingKeyFileMapping.js";
import { SettingsInterfaceFileMapping } from "../FileMappings/TypeScript/SettingsInterfaceFileMapping.js";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings.js";
import { SubGeneratorSettingKey } from "../Settings/SubGeneratorSettingKey.js";
import { TSGeneratorComponent } from "../Settings/TSGeneratorComponent.js";
import { TSGeneratorSettingKey } from "../Settings/TSGeneratorSettingKey.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator.js";

/**
 * Provides general components for {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSGeneratorCategory<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends ComponentCategoryOptions<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSGeneratorCategory `TSGeneratorCategory<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the category.
     */
    public constructor(generator: TSProjectGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public override get Generator(): TSProjectGenerator<TSettings, TOptions>
    {
        return super.Generator as TSProjectGenerator<TSettings, TOptions>;
    }

    /**
     * @inheritdoc
     */
    public get DisplayName(): string
    {
        return "Generators";
    }

    /**
     * @inheritdoc
     */
    public get Components(): Array<IComponent<TSettings, TOptions>>
    {
        return [
            this.GeneratorComponent,
            this.SubGeneratorComponent
        ];
    }

    /**
     * Gets a component for creating an example generator.
     */
    protected get GeneratorComponent(): IComponent<TSettings, TOptions>
    {
        return {
            ID: TSGeneratorComponent.GeneratorExample,
            DisplayName: "Example Generator (recommended)",
            DefaultEnabled: true,
            FileMappings: this.GetGeneratorFileMappings(GeneratorName.Main, this.Generator.Settings[TSProjectSettingKey.DisplayName])
        };
    }

    /**
     * Gets a component for creating sub-generators.
     */
    protected get SubGeneratorComponent(): IComponent<TSettings, TOptions>
    {
        return {
            ID: TSGeneratorComponent.SubGeneratorExample,
            DisplayName: "Example Sub-Generator",
            FileMappings: () =>
            {
                return (this.Generator.Settings[TSGeneratorSettingKey.SubGenerators] ?? []).flatMap(
                    (subGeneratorOptions) =>
                    {
                        return this.GetGeneratorFileMappings(
                            subGeneratorOptions[SubGeneratorSettingKey.Name],
                            subGeneratorOptions[SubGeneratorSettingKey.DisplayName]);
                    });
            },
            Questions: [
                {
                    type: SubGeneratorPrompt.TypeName,
                    name: TSGeneratorSettingKey.SubGenerators,
                    message: "Please specify the details of the sub-generators to create",
                    defaultRepeat: false
                }
            ]
        };
    }

    /**
     * Creates file-mappings for a generator.
     *
     * @param id
     * The id of the generator.
     *
     * @param displayName
     * The human readable name of the generator.
     *
     * @returns
     * File-mappings for a generator.
     */
    protected GetGeneratorFileMappings(id: string, displayName: string): Array<IFileMapping<TSettings, TOptions>>
    {
        let namingContext = new NamingContext(id, displayName, this.Generator.SourceRoot);

        return [
            new LicenseTypeFileMapping<TSettings, TOptions>(this.Generator, namingContext),
            new SettingKeyFileMapping<TSettings, TOptions>(this.Generator, namingContext),
            new SettingsInterfaceFileMapping<TSettings, TOptions>(this.Generator, namingContext),
            new GeneratorClassFileMapping<TSettings, TOptions>(this.Generator, namingContext),
            new GeneratorIndexFileMapping<TSettings, TOptions>(this.Generator, namingContext),
            new GeneratorTestFileMapping<TSettings, TOptions>(this.Generator, namingContext),
            {
                Source: join("generator", "templates"),
                Destination: join("templates", id)
            }
        ];
    }
}
