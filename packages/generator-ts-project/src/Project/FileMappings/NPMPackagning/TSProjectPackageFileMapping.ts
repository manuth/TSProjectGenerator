import { GeneratorOptions, GeneratorSettingKey, IGenerator } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { Constants } from "../../../Core/Constants";
import { CommonDependencies } from "../../../NPMPackaging/Dependencies/CommonDependencies";
import { LintDependencies } from "../../../NPMPackaging/Dependencies/LintDependencies";
import { PackageFileMapping } from "../../../NPMPackaging/FileMappings/PackageFileMapping";
import { IScriptMapping } from "../../../NPMPackaging/Scripts/IScriptMapping";
import { ITSProjectSettings } from "../../Settings/ITSProjectSettings";
import { TSProjectComponent } from "../../Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../Settings/TSProjectSettingKey";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSProjectGenerator } from "../../TSProjectGenerator";

/**
 * Represents a file-mapping for the `package.json` file of {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectPackageFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends PackageFileMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSProjectPackageFileMapping `TSProjectPackageFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * Gets all `npm`-scripts which are related to `TypeScript`.
     */
    public get TypeScriptScripts(): Array<IScriptMapping<TSettings, TOptions> | string>
    {
        let compileScriptName = "compile";
        let buildScriptName = "build";
        let cleanScriptName = "clean";

        let compileScriptProcessor = (script: string): string =>
        {
            return script.replace(new RegExp(compileScriptName, "g"), buildScriptName);
        };

        return [
            {
                Source: compileScriptName,
                Destination: buildScriptName
            },
            "rebuild",
            {
                Source: "watch-compile",
                Destination: "watch",
                Processor: async (script) => compileScriptProcessor(script)
            },
            {
                Source: cleanScriptName,
                Destination: cleanScriptName,
                Processor: async (script) => compileScriptProcessor(script)
            }
        ];
    }

    /**
     * Gets all `npm`-scripts which are related to linting.
     */
    public get LintScripts(): Array<IScriptMapping<TSettings, TOptions> | string>
    {
        let oldLintBaseScriptName = "lint-code-base";
        let lintBaseScriptName = "lint-base";
        let oldLintScriptName = "lint-code";
        let lintScriptName = "lint";

        return [
            {
                Source: oldLintBaseScriptName,
                Destination: lintBaseScriptName
            },
            {
                Source: oldLintScriptName,
                Destination: lintScriptName,
                Processor: async (script) => script.replace(new RegExp(oldLintBaseScriptName, "g"), lintBaseScriptName)
            },
            {
                Source: "lint-code-ide",
                Destination: "lint-ide",
                Processor: async (script) => script.replace(new RegExp(oldLintScriptName, "g"), lintScriptName)
            }
        ];
    }

    /**
     * Gets additional `npm`-scripts.
     */
    public get MiscScripts(): Array<IScriptMapping<TSettings, TOptions> | string>
    {
        let prepareScriptName = "prepare";

        return [
            "test",
            {
                Source: prepareScriptName,
                Destination: prepareScriptName,
                Processor: async (script, target) =>
                {
                    let separator = " && ";
                    let commands = script.split(separator);
                    let filtered: string[] = [];

                    for (let command of commands)
                    {
                        if (!command.includes("patchTypeScript"))
                        {
                            filtered.push(command);
                        }
                    }

                    return filtered.join(separator);
                }
            }
        ];
    }

    /**
     * @inheritdoc
     */
    protected override get ScriptMappings(): Array<IScriptMapping<TSettings, TOptions> | string>
    {
        return [
            ...this.TypeScriptScripts,
            ...this.LintScripts,
            ...this.MiscScripts
        ];
    }

    /**
     * @inheritdoc
     */
    protected override get ScriptSource(): Package
    {
        return Constants.Package;
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
        result.Name = this.Generator.Settings[TSProjectSettingKey.Name];
        result.Description = this.Generator.Settings[TSProjectSettingKey.Description];
        result.Register(new CommonDependencies(), true);

        result.PublishConfig = {
            ...result.PublishConfig,
            access: "public"
        };

        if (this.Generator.Settings[GeneratorSettingKey.Components].includes(TSProjectComponent.Linting))
        {
            result.Register(new LintDependencies(), true);
        }

        return result;
    }
}
