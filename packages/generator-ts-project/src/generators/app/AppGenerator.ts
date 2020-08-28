import { Generator, GeneratorOptions, Question } from "@manuth/extended-yo-generator";
import { join } from "upath";
import { GeneratorLoader } from "./GeneratorLoader";
import { ProjectType } from "./ProjectType";
import { AppGeneratorSettingKey } from "./Settings/AppGeneratorSettingKey";
import { IAppGeneratorSettings } from "./Settings/IAppGeneratorSettings";

/**
 * Provides the functionality to generate typescript-projects.
 */
export class AppGenerator<TSettings extends IAppGeneratorSettings = IAppGeneratorSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends Generator<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `AppGenerator` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: TOptions)
    {
        super(args, options);
    }

    /**
     * @inheritdoc
     */
    public get Questions(): Array<Question<TSettings>>
    {
        return [
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
        ];
    }

    /**
     * @inheritdoc
     */
    public async initializing(): Promise<void>
    {
        await this.prompting();
        return this.LoadGenerator(this.Settings[AppGeneratorSettingKey.ProjectType]);
    }

    /**
     * Loads the propper generator according to the `ProjectType`.
     *
     * @param projectType
     * The type of the project to load.
     */
    protected LoadGenerator: GeneratorLoader = async (projectType) =>
    {
        switch (projectType)
        {
            case ProjectType.Generator:
                this.composeWith(join(__dirname, "..", "generator"), this.options);
                break;
            case ProjectType.Module:
            default:
                this.composeWith(join(__dirname, "..", "module"), this.options);
                break;
        }
    };
}
