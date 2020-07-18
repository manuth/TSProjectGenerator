import { Generator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import chalk = require("chalk");
import { join } from "upath";
import yosay = require("yosay");
import { ProjectType } from "./ProjectType";
import { AppGeneratorSettingKey } from "./Settings/AppGeneratorSettingKey";
import { IAppGeneratorSettings } from "./Settings/IAppGeneratorSettings";

/**
 * Provides the functionality to generate typescript-projects.
 */
export class AppGenerator<T extends IGeneratorSettings> extends Generator<T>
{
    /**
     * Initializes a new instance of the `AppGenerator<T>` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: Record<string, unknown>)
    {
        super(args, options);
    }

    /**
     * Initializes the generator.
     */
    public async initializing(): Promise<void>
    {
        let settings: IAppGeneratorSettings;
        this.log(yosay(`Welcome to ${chalk.whiteBright("TSProjectGenerator")}!`));

        settings = await this.prompt(
            [
                {
                    type: "list",
                    name: AppGeneratorSettingKey.ProjectType,
                    message: "Please choose the type of project you want to create.",
                    choices: [
                        {
                            name: "NPM-Module",
                            value: ProjectType.Module
                        },
                        {
                            name: "Yeoman-Generator",
                            value: ProjectType.Generator
                        }
                    ],
                    default: ProjectType.Module
                }
            ]);

        switch (settings[AppGeneratorSettingKey.ProjectType])
        {
            case ProjectType.Generator:
                this.composeWith(join(__dirname, "..", "generator"), undefined);
                break;
            case ProjectType.Module:
            default:
                this.composeWith(join(__dirname, "..", "module"), undefined);
                break;
        }
    }
}
