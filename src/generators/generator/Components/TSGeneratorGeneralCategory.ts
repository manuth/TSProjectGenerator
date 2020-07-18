import { IComponent, IFileMapping } from "@manuth/extended-yo-generator";
import camelCase = require("lodash.camelcase");
import { join } from "upath";
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
export class TSGeneratorGeneralCategory<T extends ITSGeneratorSettings> extends TSProjectGeneralCategory<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorGeneralCategory<T>` class.
     */
    public constructor()
    {
        super();
    }

    /**
     * @inheritdoc
     */
    public get Components(): Array<IComponent<T>>
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
    protected get WorkspaceComponent(): IComponent<T>
    {
        return new TSGeneratorCodeWorkspace();
    }

    /**
     * Gets a component for creating an example generator.
     */
    protected get GeneratorComponent(): IComponent<T>
    {
        return {
            ID: TSGeneratorComponent.GeneratorExample,
            DisplayName: "Example Generator (recommended)",
            DefaultEnabled: true,
            FileMappings: (component, generator) => this.GetGeneratorFileMappings("app", generator.Settings[TSProjectSettingKey.DisplayName])
        };
    }

    /**
     * Gets a component for creating sub-generators.
     */
    protected get SubGeneratorComponent(): IComponent<T>
    {
        return {
            ID: TSGeneratorComponent.SubGeneratorExample,
            DisplayName: "Example Sub-Generator",
            FileMappings: (component, generator) =>
                generator.Settings[TSGeneratorSettingKey.SubGenerator].flatMap(
                    (subGeneratorOptions) =>
                    {
                        return this.GetGeneratorFileMappings(
                            subGeneratorOptions[SubGeneratorSettingKey.Name],
                            subGeneratorOptions[SubGeneratorSettingKey.DisplayName]);
                    }),
            Questions: [
                {
                    type: SubGeneratorPrompt.TypeName,
                    name: TSGeneratorSettingKey.SubGenerator,
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
    protected GetGeneratorFileMappings(id: string, displayName: string): Array<IFileMapping<T>>
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
                Source: join(source, "Settings.ts.ejs"),
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
