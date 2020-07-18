import { IGenerator } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { Constants } from "../../../Core/Constants";
import { CommonDependencies } from "../../../NPMPackaging/Dependencies/CommonDependencies";
import { PackageFileMapping } from "../../../NPMPackaging/FileMappings/PackageFileMapping";
import { IScriptMapping } from "../../../NPMPackaging/Scripts/IScriptMapping";
import { ITSProjectSettings } from "../../Settings/ITSProjectSettings";
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
        result.Register(new CommonDependencies());
        return result;
    }

    /**
     * Gets all `npm`-scripts which are related to `TypeScript`.
     */
    protected get TypeScriptScripts(): Array<IScriptMapping<T> | string>
    {
        return [
            "build",
            "rebuild",
            "watch",
            "clean"
        ];
    }

    /**
     * Gets all `npm`-scripts which are related to linting.
     */
    protected get LintScripts(): Array<IScriptMapping<T> | string>
    {
        return [
            {
                Source: "lint-code",
                Destination: "lint"
            },
            {
                Source: "lint-code-compact",
                Destination: "lint-compact",
                Processor: async (script) => script.replace("lint-code", "lint")
            }
        ];
    }

    /**
     * Gets additional `npm`-scripts.
     */
    protected get MiscScripts(): Array<IScriptMapping<T> | string>
    {
        return [
            "test",
            "prepare"
        ];
    }

    /**
     * @inheritdoc
     */
    protected get ScriptMappings(): Array<IScriptMapping<T> | string>
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
    protected get Template(): Promise<Package>
    {
        return (
            async () =>
            {
                return Constants.Package;
            })();
    }
}
