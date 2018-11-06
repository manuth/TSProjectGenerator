import chalk from "chalk";
import kebabCase = require("lodash.kebabcase");
import Path = require("path");
import { Question } from "yeoman-generator";
import yosay = require("yosay");
import { Generator } from "../../Generator";
import { IComponentProvider } from "../../IComponentProvider";
import { AppSetting } from "./AppSetting";
import { IAppSettings } from "./IAppSettings";
import { LintMode } from "./LintLevel";
import { SubGeneratorSetting } from "./SubGeneratorSetting";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 */
class AppGenerator extends Generator<IAppSettings>
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
    public constructor(args: string | string[], options: {})
    {
        super(args, options);
    }

    /**
     * Gets the settings of the generator.
     */
    protected get Settings(): IAppSettings
    {
        return super.Settings as IAppSettings;
    }

    protected get TemplateRoot(): string
    {
        return "app";
    }

    protected get Questions(): Question[]
    {
        return [
            {
                type: "input",
                name: AppSetting.Destination,
                message: "Where do you want to save your generator to?",
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
                name: AppSetting.ModuleName,
                message: "What's the name of the node-module?",
                default: (answers: IAppSettings) => "generator-" + kebabCase(answers[AppSetting.Name].replace(/(generator-)?(.*?)(generator)?$/i, "$2")),
                filter: input => kebabCase(input)
            },
            {
                type: "input",
                name: AppSetting.Description,
                message: "Please enter a description for your generator."
            }
        ];
    }

    protected get ProvidedComponents(): IComponentProvider<IAppSettings>
    {
        return {
            Question: "What do you want to include in your workspace?",
            Categories: [
                {
                    DisplayName: "General",
                    Components: [
                        {
                            ID: "tslint",
                            DisplayName: "TSLint configurations",
                            Questions: [
                                {
                                    name: AppSetting.LintMode,
                                    type: "list",
                                    message: "What ruleset do you want to use for linting?",
                                    choices: [
                                        {
                                            value: LintMode.Weak,
                                            name: "manuth's weak ruleset"
                                        },
                                        {
                                            value: LintMode.Strong,
                                            name: "manuth's strong ruleset (recommended)"
                                        }
                                    ],
                                    default: LintMode.Strong
                                }
                            ],
                            FileMappings: [
                                {
                                    Source: settings =>
                                    {
                                        switch (settings[AppSetting.LintMode])
                                        {
                                            case LintMode.Weak:
                                                return "tslint.weak.jsonc";
                                            case LintMode.Strong:
                                            default:
                                                return Path.join(__dirname, "..", "..", "..", "tslint.json");
                                        }
                                    },
                                    Context: settings => settings,
                                    Destination: "tslint.json"
                                }
                            ]
                        },
                        {
                            ID: "vscode",
                            DisplayName: "Visual Studio Code-Workspace",
                            FileMappings: [
                                {
                                    Source: Path.join(__dirname, "..", "..", "..", ".vscode"),
                                    Destination: ".vscode"
                                },
                                {
                                    Source: "launch.json",
                                    Destination: Path.join(".vscode", "launch.json")
                                }
                            ]
                        },
                        {
                            ID: "example",
                            DisplayName: "Example Generator",
                            FileMappings: () =>
                            {
                                let id = "app";
                                let name = id.charAt(0).toUpperCase() + id.slice(1);
                                let source = "generator";
                                let destination = `src/generators/${id}`;
                                let generatorName = `${name}Generator`;
                                let settingEnum = `${name}Setting`;
                                let settingsInterface = `I${name}Settings`;

                                return [
                                    {
                                        Source: Path.join(source, "LicenseType.ts.ejs"),
                                        Destination: Path.join(destination, "LicenseType.ts")
                                    },
                                    {
                                        Source: Path.join(source, "Setting.ts.ejs"),
                                        Context: () =>
                                        {
                                            return { Name: settingEnum };
                                        },
                                        Destination: Path.join(destination, `${settingEnum}.ts`)
                                    },
                                    {
                                        Source: Path.join(source, "ISettings.ts.ejs"),
                                        Context: () =>
                                        {
                                            return {
                                                Name: generatorName,
                                                SettingsInterface: settingsInterface,
                                                Identities: settingEnum
                                            };
                                        },
                                        Destination: Path.join(destination, `${settingsInterface}.ts`)
                                    },
                                    {
                                        Source: Path.join(source, "index.ts.ejs"),
                                        Context: (settings) =>
                                        {
                                            return {
                                                Name: generatorName,
                                                SettingsInterface: settingsInterface,
                                                Identities: settingEnum,
                                                ID: id,
                                                DisplayName: settings[AppSetting.Name]
                                            };
                                        },
                                        Destination: Path.join(destination, "index.ts")
                                    },
                                    {
                                        Source: Path.join(source, "templates"),
                                        Destination: Path.join("templates", id)
                                    }
                                ];
                            }
                        },
                        {
                            ID: "sub-example",
                            DisplayName: "Example Sub-Generator",
                            Questions: [
                                {
                                    type: "input",
                                    name: `${AppSetting.SubGenerator}.${SubGeneratorSetting.DisplayName}`,
                                    message: "What's the human-readable name of your sub-generator?"
                                },
                                {
                                    type: "input",
                                    name: `${AppSetting.SubGenerator}.${SubGeneratorSetting.Name}`,
                                    message: "What's the unique name of the sub-generator?"
                                }
                            ],
                            FileMappings: (settings) =>
                            {
                                let id = settings[AppSetting.SubGenerator][SubGeneratorSetting.Name];
                                let name = id.charAt(0).toUpperCase() + id.slice(1);
                                let source = "generator";
                                let destination = `src/generators/${id}`;
                                let generatorName = `${name}Generator`;
                                let settingEnum = `${name}Setting`;
                                let settingsInterface = `I${name}Settings`;

                                return [
                                    {
                                        Source: Path.join(source, "LicenseType.ts.ejs"),
                                        Destination: Path.join(destination, "LicenseType.ts")
                                    },
                                    {
                                        Source: Path.join(source, "Setting.ts.ejs"),
                                        Context: () =>
                                        {
                                            return { Name: settingEnum };
                                        },
                                        Destination: Path.join(destination, `${settingEnum}.ts`)
                                    },
                                    {
                                        Source: Path.join(source, "ISettings.ts.ejs"),
                                        Context: () =>
                                        {
                                            return {
                                                Name: generatorName,
                                                SettingsInterface: settingsInterface,
                                                Identities: settingEnum
                                            };
                                        },
                                        Destination: Path.join(destination, `${settingsInterface}.ts`)
                                    },
                                    {
                                        Source: Path.join(source, "index.ts.ejs"),
                                        Context: (settings) =>
                                        {
                                            return {
                                                Name: generatorName,
                                                SettingsInterface: settingsInterface,
                                                Identities: settingEnum,
                                                ID: id,
                                                DisplayName: settings[AppSetting.Name]
                                            };
                                        },
                                        Destination: Path.join(destination, "index.ts")
                                    },
                                    {
                                        Source: Path.join(source, "templates"),
                                        Destination: Path.join("templates", id)
                                    }
                                ];
                            }
                        }
                    ]
                }
            ]
        };
    }

    public async prompting()
    {
        this.log(yosay(`Welcome to the ${chalk.whiteBright("TypeScript Generator")} generator!`));
        return super.prompting();
    }

    public async writing()
    {
        let moduleRoot = Path.join(__dirname, "..", "..", "..");
        let sourceRoot = "src";
        await super.writing();

        let packageJSON = require(Path.join(moduleRoot, "package.json"));
        packageJSON.name = this.Settings[AppSetting.ModuleName];
        packageJSON.description = this.Settings[AppSetting.Description];
        packageJSON.author = this.user.git.name;
        packageJSON.version = "0.0.0";
        packageJSON.keywords = [];
        delete packageJSON.license;
        delete packageJSON.bugs;
        delete packageJSON.homepage;
        this.fs.writeJSON("package.json", packageJSON);
        this.fs.copy(Path.join(moduleRoot, ".gitignore"), ".gitignore");
        this.fs.copy(Path.join(moduleRoot, ".npmignore"), ".npmignore");
        this.fs.copy(Path.join(moduleRoot, "tsconfig.json"), "tsconfig.json");
        this.fs.copy(Path.join(moduleRoot, "test", "mocha.opts"), Path.join("test", "mocha.opts"));
        this.fs.copyTpl(this.templatePath("main.test.ts.ejs"), Path.join(sourceRoot, "tests", "main.test.ts"), this.Settings);
        this.fs.copy(Path.join(moduleRoot, sourceRoot, "Generator.ts"), Path.join(sourceRoot, "Generator.ts"));
        this.fs.copy(Path.join(moduleRoot, sourceRoot, "GeneratorSetting.ts"), Path.join(sourceRoot, "GeneratorSetting.ts"));
        this.fs.copy(Path.join(moduleRoot, sourceRoot, "IComponent.ts"), Path.join(sourceRoot, "IComponent.ts"));
        this.fs.copy(Path.join(moduleRoot, sourceRoot, "IComponentCategory.ts"), Path.join(sourceRoot, "IComponentCategory.ts"));
        this.fs.copy(Path.join(moduleRoot, sourceRoot, "IComponentDestination.ts"), Path.join(sourceRoot, "IComponentDestination.ts"));
        this.fs.copy(Path.join(moduleRoot, sourceRoot, "IComponentProvider.ts"), Path.join(sourceRoot, "IComponentProvider.ts"));
        this.fs.copy(Path.join(moduleRoot, sourceRoot, "IFileMapping.ts"), Path.join(sourceRoot, "IFileMapping.ts"));
        this.fs.copy(Path.join(moduleRoot, sourceRoot, "IGeneratorSettings.ts"), Path.join(sourceRoot, "IGeneratorSettings.ts"));
    }
}

export = AppGenerator;