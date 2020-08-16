import chalk = require("chalk");
import Dedent = require("dedent");
import { Generator, IComponentCollection, Question } from "@manuth/extended-yo-generator";
import Path = require("path");
import YoSay = require("yosay");
import { AppSetting } from "./AppSetting";
import { IAppSettings } from "./IAppSettings";
import { LicenseType } from "./LicenseType";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 */
export class AppGenerator extends Generator<IAppSettings>
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
    public constructor(args: string | string[], options: Record<string, unknown>)
    {
        super(args, options);
    }

    /**
     * @inheritdoc
     */
    protected get TemplateRoot(): string
    {
        return "app";
    }

    /**
     * @inheritdoc
     */
    protected get Questions(): Array<Question<IAppSettings>>
    {
        return [
            {
                type: "input",
                name: AppSetting.Destination,
                message: "Where do you want to save your project to?",
                default: "./",
                filter: async input =>
                {
                    let destination = Path.isAbsolute(input) ? input : Path.resolve(process.cwd(), input);
                    this.destinationRoot(destination);
                    return destination;
                }
            },
            {
                type: "input",
                name: AppSetting.Name,
                message: "What's the name of your project?",
                default: (answers: IAppSettings) => Path.basename(answers[AppSetting.Destination])
            },
            {
                type: "input",
                name: AppSetting.Description,
                message: "Please enter a description."
            }
        ];
    }

    /**
     * @inheritdoc
     */
    protected get Components(): IComponentCollection<IAppSettings>
    {
        return {
            Question: "What do you want to include in your workspace?",
            Categories: [
                {
                    DisplayName: "General",
                    Components: [
                        {
                            ID: "readme",
                            DisplayName: "README.md-File",
                            DefaultEnabled: true,
                            FileMappings: [
                                {
                                    Source: "README.md.ejs",
                                    Context: (fileMapping, generator) =>
                                    {
                                        return {
                                            Name: generator.Settings[AppSetting.Name],
                                            Description: generator.Settings[AppSetting.Description]
                                        };
                                    },
                                    Destination: "README.md"
                                }
                            ]
                        },
                        {
                            ID: "license",
                            DisplayName: "License-File",
                            Questions: [
                                {
                                    name: AppSetting.LicenseType,
                                    type: "list",
                                    message: "What license do you want to use?",
                                    choices: [
                                        {
                                            value: LicenseType.Apache,
                                            name: "Apache-2.0 License"
                                        },
                                        {
                                            value: LicenseType.GPL,
                                            name: "GNU GPL License"
                                        }
                                    ],
                                    default: LicenseType.GPL
                                }
                            ],
                            FileMappings: [
                                {
                                    Source: (fileMapping, generator) =>
                                    {
                                        switch (generator.Settings[AppSetting.LicenseType])
                                        {
                                            case LicenseType.Apache:
                                                return "Apache.txt";
                                            case LicenseType.GPL:
                                            default:
                                                return "GPL.txt";
                                        }
                                    },
                                    Destination: "LICENSE"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }

    /**
     * @inheritdoc
     */
    public async prompting(): Promise<void>
    {
        this.log(YoSay(`Welcome to the ${chalk.whiteBright("MyTSProjectGenerator")} generator!`));
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public async writing(): Promise<void>
    {
        return super.writing();
    }

    /**
     * @inheritdoc
     */
    public async end(): Promise<void>
    {
        this.log(
            Dedent(`
                Your project is ready!

                It lives in "${this.Settings[AppSetting.Destination]}"`));
    }
}
