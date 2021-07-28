import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { IScriptMapping } from "../../../NPMPackaging/Scripts/IScriptMapping";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TestPackageFileMapping } from "./TestPackageFileMapping";

/**
 * Provides options for the {@link TestPackageFileMapping `TestPackageFileMapping<TSettings, TOptions>`} class.
 */
export interface ITestPackageOptions<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions>
{
    /**
     * Gets or sets the scripts to copy from the template-package.
     */
    ScriptMappings: Array<IScriptMapping<TSettings, TOptions> | string>;

    /**
     * Gets or sets the template package.
     */
    ScriptSource: Package;
}
