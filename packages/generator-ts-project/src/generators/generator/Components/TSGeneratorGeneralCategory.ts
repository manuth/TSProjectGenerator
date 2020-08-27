import { join } from "path";
import { GeneratorOptions, IComponent, IFileMapping, IGenerator } from "@manuth/extended-yo-generator";
import camelCase = require("lodash.camelcase");
import { SubGeneratorPrompt } from "../../../Components/Inquiry/Prompts/SubGeneratorPrompt";
import { TSProjectGeneralCategory } from "../../../Project/Components/TSProjectGeneralCategory";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../Settings/TSGeneratorSettingKey";
import { TSGeneratorCodeWorkspace } from "./TSGeneratorCodeWorkspace";

/**
 * Provides general components for `TSGenerator`s.
 */
export class TSGeneratorGeneralCategory<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectGeneralCategory<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSGeneratorGeneralCategory` class.
     *
     * @param generator
     * The generator of the category.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public get Components(): Array<IComponent<TSettings, TOptions>>
    {
        return [
            ...super.Components,
            this.GeneratorComponent,
            this.SubGeneratorComponent
        ];
    }

    /**
     * @inheritdoc
     */
    protected get WorkspaceComponent(): IComponent<TSettings, TOptions>
    {
        return new TSGeneratorCodeWorkspace(this.Generator);
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
            FileMappings: this.GetGeneratorFileMappings("app", this.Generator.Settings[TSProjectSettingKey.DisplayName])
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
                return this.Generator.Settings[TSGeneratorSettingKey.SubGenerators].flatMap(
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
        let name = (id.charAt(0).toUpperCase() + camelCase(id).slice(1));
        let source = "generator";
        let destination = `src/generators/${id}`;
        let generatorName = `${name}Generator`;
        let identities = `${name}Setting`;
        let settings = `I${name}Settings`;

        return [
            {
                Source: join(source, "LicenseType.ts.ejs"),
                Destination: join(destination, "LicenseType.ts")
            },
            {
                Source: join(source, "Setting.ts.ejs"),
                Context: () =>
                {
                    return { Name: identities };
                },
                Destination: join(destination, `${identities}.ts`)
            },
            {
                Source: join(source, "ISettings.ts.ejs"),
                Context: () =>
                {
                    return {
                        Name: generatorName,
                        SettingsInterface: settings,
                        Identities: identities
                    };
                },
                Destination: join(destination, `${settings}.ts`)
            },
            {
                Source: join(source, "Generator.ts.ejs"),
                Context: () =>
                {
                    return {
                        Name: generatorName,
                        SettingsInterface: settings,
                        Identities: identities,
                        ID: id,
                        DisplayName: displayName
                    };
                },
                Destination: join(destination, `${generatorName}.ts`)
            },
            {
                Source: join(source, "index.ts.ejs"),
                Context: () =>
                {
                    return {
                        Name: generatorName
                    };
                },
                Destination: join(destination, "index.ts")
            },
            {
                Source: join(source, "templates"),
                Destination: join("templates", id)
            }
        ];
    }
}
