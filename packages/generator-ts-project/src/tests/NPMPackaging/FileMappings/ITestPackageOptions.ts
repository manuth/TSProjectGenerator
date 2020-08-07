import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { IScriptMapping } from "../../../NPMPackaging/Scripts/IScriptMapping";

/**
 * Provides options for the `TestPackageFileMapping` class.
 */
export interface ITestPackageOptions<T extends IGeneratorSettings>
{
    /**
     * Gets or sets the scripts to copy from the template-package.
     */
    ScriptMappings: Array<IScriptMapping<T> | string>;

    /**
     * Gets or sets the template package.
     */
    Template: Package;
}
