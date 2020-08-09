import { IGenerator, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { Constants } from "../../../Core/Constants";
import { CommonDependencies } from "../../../NPMPackaging/Dependencies/CommonDependencies";
import { LintDependencies } from "../../../NPMPackaging/Dependencies/LintDependencies";
import { PackageFileMapping } from "../../../NPMPackaging/FileMappings/PackageFileMapping";
import { IScriptMapping } from "../../../NPMPackaging/Scripts/IScriptMapping";
import { ITSProjectSettings } from "../../Settings/ITSProjectSettings";
import { TSProjectComponent } from "../../Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../Settings/TSProjectSettingKey";

/**
 * Represents a file-mapping for the `package.json` file of `TSProject`s.
 */
export class TSProjectPackageFileMapping<T extends ITSProjectSettings> extends PackageFileMapping<T>
{
    /**
     * Initializes a new instance of the `TSProjectPackageFileMapping<T>` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * Gets all `npm`-scripts which are related to `TypeScript`.
     */
    protected get TypeScriptScripts(): Promise<Array<IScriptMapping<T> | string>>
    {
        return (
            async (): Promise<Array<IScriptMapping<T> | string>> =>
            {
                return [
                    {
                        Source: "compile",
                        Destination: "build"
                    },
                    "rebuild",
                    {
                        Source: "watch-compile",
                        Destination: "watch",
                        Processor: async (script) => script.replace("compile", "build")
                    },
                    "clean"
                ];
            })();
    }

    /**
     * Gets all `npm`-scripts which are related to linting.
     */
    protected get LintScripts(): Promise<Array<IScriptMapping<T> | string>>
    {
        return (
            async (): Promise<Array<IScriptMapping<T> | string>> =>
            {
                return [
                    {
                        Source: "lint-code-base",
                        Destination: "lint-base"
                    },
                    {
                        Source: "lint-code",
                        Destination: "lint",
                        Processor: async (script) => script.replace("lint-code-base", "lint-base")
                    },
                    {
                        Source: "lint-code-compact",
                        Destination: "lint-compact",
                        Processor: async (script) => script.replace("lint-code", "lint")
                    }
                ];
            })();
    }

    /**
     * Gets additional `npm`-scripts.
     */
    protected get MiscScripts(): Promise<Array<IScriptMapping<T> | string>>
    {
        return (
            async () =>
            {
                return [
                    "test",
                    "prepare"
                ];
            })();
    }

    /**
     * @inheritdoc
     */
    protected get ScriptMappings(): Promise<Array<IScriptMapping<T> | string>>
    {
        return (
            async () =>
            {
                return [
                    ...await this.TypeScriptScripts,
                    ...await this.LintScripts,
                    ...await this.MiscScripts
                ];
            })();
    }

    /**
     * @inheritdoc
     */
    protected get Template(): Promise<Package>
    {
        return (
            async () =>
            {
                return Constants.Package;
            })();
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
        result.Name = this.Generator.Settings[TSProjectSettingKey.Name];
        result.Description = this.Generator.Settings[TSProjectSettingKey.Description];
        result.Register(new CommonDependencies(), true);

        if (this.Generator.Settings[GeneratorSettingKey.Components].includes(TSProjectComponent.Linting))
        {
            result.Register(new LintDependencies(), true);
        }

        return result;
    }
}
