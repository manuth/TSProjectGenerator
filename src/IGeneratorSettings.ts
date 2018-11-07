import { Answers } from "yeoman-generator";
import { GeneratorSetting } from "./GeneratorSetting";

/**
 * Represents settings of a generator.
 */
export interface IGeneratorSettings extends Answers
{
    /**
     * Gets or sets a specific setting.
     */
    [key: string]: any;

    /**
     * Gets or sets the components to install.
     */
    [GeneratorSetting.Components]: string[];

    /**
     * Gets or sets the paths to save the components to.
     */
    [GeneratorSetting.ComponentPaths]: { [key: string]: string };
}