import chalk from "chalk";
import JSON = require("comment-json");
import dedent = require("dedent");
import { Generator, GeneratorSetting, IComponentProvider, IFileMapping, Question } from "extended-yo-generator";
import FileSystem = require("fs-extra");
import camelCase = require("lodash.camelcase");
import kebabCase = require("lodash.kebabcase");
import Path = require("path");
import { Linter } from "tslint";
import { isNullOrUndefined } from "util";
import yosay = require("yosay");
import { ITSGeneratorSettings } from "./ITSGeneratorSettings";
import { LintMode } from "./LintMode";
import { SubGeneratorSetting } from "./SubGeneratorSetting";
import { TSGeneratorComponent } from "./TSGeneratorComponent";
import { TSGeneratorSetting } from "./TSGeneratorSetting";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 */
export class TSGeneratorGenerator extends Generator<ITSGeneratorSettings>
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

    protected get TemplateRoot(): string
    {
        return "app";
    }

    protected get Questions(): Question<ITSGeneratorSettings>[]
    {
        return [
            {
                type: "input",
                name: TSGeneratorSetting.Destination,
                message: "Where do you want to save your generator to?",
                default: "./",
                filter: async input => Path.isAbsolute(input) ? input : Path.resolve(process.cwd(), input)
            },
            {
                type: "input",
                name: TSGeneratorSetting.DisplayName,
                message: "What's the name of your project?",
                default: (answers: ITSGeneratorSettings) => Path.basename(answers[TSGeneratorSetting.Destination]),
                validate: (input: string) => /.+/.test(input.trim()) ? true : "The name must not be empty!"
            },
            {
                type: "input",
                name: TSGeneratorSetting.Name,
                message: "What's the name of the node-module?",
                default: (answers: ITSGeneratorSettings) => "generator-" + kebabCase(answers[TSGeneratorSetting.DisplayName].replace(/(generator-)?(.*?)(generator)?$/i, "$2")),
                filter: input => kebabCase(input),
                validate: (input: string) =>
                {
                    if (/[\w-]+/.test(input))
                    {
                        return input.startsWith("generator-") ? true : 'The name must start with "generator-"';
                    }
                    else
                    {
                        return "Please provide a name according to the npm naming-conventions.";
                    }
                }
            },
            {
                type: "input",
                name: TSGeneratorSetting.Description,
                message: "Please enter a description for your generator."
            }
        ];
    }

    protected get ProvidedComponents(): IComponentProvider<ITSGeneratorSettings>
    {
        return {
            Question: "What do you want to include in your workspace?",
            Categories: [
                {
                    DisplayName: "General",
                    Components: [
                        {
                            ID: TSGeneratorComponent.TSLint,
                            DisplayName: "TSLint configurations",
                            Default: true,
                            FileMappings: [
                                {
                                    Source: settings =>
                                    {
                                        switch (settings[TSGeneratorSetting.LintMode])
                                        {
                                            case LintMode.Weak:
                                                return "tslint.json";
                                            case LintMode.Strong:
                                            default:
                                                return this.modulePath("tslint.json");
                                        }
                                    },
                                    Destination: "tslint.json"
                                }
                            ],
                            Questions: [
                                {
                                    name: TSGeneratorSetting.LintMode,
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
                            ]
                        },
                        {
                            ID: TSGeneratorComponent.VSCode,
                            DisplayName: "Visual Studio Code-Workspace",
                            Default: true,
                            FileMappings: [
                                {
                                    Source: this.modulePath(".vscode"),
                                    Destination: ".vscode"
                                },
                                {
                                    Source: this.modulePath(".vscode", "launch.json"),
                                    Destination: () => this.destinationPath(".vscode", "launch.json"),
                                    Process: async (source, destination) =>
                                    {
                                        let configurations: any[] = [];
                                        let launch: {
                                            configurations?: any[]
                                        } = JSON.parse((await FileSystem.readFile(source)).toString());
                                        let generators: string[] = [
                                            "app"
                                        ];

                                        if (!isNullOrUndefined(launch.configurations))
                                        {
                                            let validConfigurations: any[] = [];

                                            for (let configuration of launch.configurations)
                                            {
                                                if ((configuration.name as string).toLowerCase().includes("launch tests"))
                                                {
                                                    validConfigurations.push(configuration);
                                                }
                                            }

                                            launch.configurations = validConfigurations;
                                        }
                                        else
                                        {
                                            launch.configurations = [];
                                        }

                                        if (this.Settings[GeneratorSetting.Components].includes(TSGeneratorComponent.SubGeneratorExample))
                                        {
                                            generators.push(this.Settings[TSGeneratorSetting.SubGenerator][SubGeneratorSetting.Name]);
                                        }

                                        for (let generatorName of generators)
                                        {
                                            configurations.push(
                                                {
                                                    type: "node",
                                                    request: "launch",
                                                    name: generatorName === "app" ? "Launch Yeoman" : `Launch ${generatorName}`,
                                                    program: "${workspaceFolder}/node_modules/yo/lib/cli.js",
                                                    args: [
                                                        `\${workspaceFolder}/lib/generators/${generatorName}`
                                                    ],
                                                    console: "integratedTerminal",
                                                    internalConsoleOptions: "neverOpen",
                                                    preLaunchTask: "Build",
                                                    cwd: "${workspaceFolder}/..",
                                                    sourceMaps: true
                                                });
                                        }

                                        launch.configurations.unshift(...configurations);
                                        this.fs.write(destination, JSON.stringify(launch, null, 4));
                                    }
                                },
                                {
                                    Source: this.modulePath(".vscode", "settings.json"),
                                    Destination: () => this.destinationPath(".vscode", "settings.json"),
                                    Process: async (source, destination) =>
                                    {
                                        let result: any = {};
                                        let settings = JSON.parse((await FileSystem.readFile(source)).toString());

                                        for (let key in settings)
                                        {
                                            if (key !== "files.associations")
                                            {
                                                result[key] = settings[key];
                                            }
                                        }

                                        this.fs.write(destination, JSON.stringify(result, null, 4));
                                    }
                                }
                            ]
                        },
                        {
                            ID: TSGeneratorComponent.GeneratorExample,
                            DisplayName: "Example Generator (recommended)",
                            FileMappings: (settings) => this.GetGeneratorFileMappings("app", settings[TSGeneratorSetting.DisplayName])
                        },
                        {
                            ID: TSGeneratorComponent.SubGeneratorExample,
                            DisplayName: "Example Sub-Generator",
                            FileMappings: (settings) => this.GetGeneratorFileMappings(
                                settings[TSGeneratorSetting.SubGenerator][SubGeneratorSetting.Name],
                                settings[TSGeneratorSetting.SubGenerator][SubGeneratorSetting.DisplayName]),
                            Questions: [
                                {
                                    type: "input",
                                    name: `${TSGeneratorSetting.SubGenerator}.${SubGeneratorSetting.DisplayName}`,
                                    message: "What's the human-readable name of your sub-generator?",
                                    validate: (input: string) => /.+/.test(input.trim()) ? true : "The name must not be empty!"
                                },
                                {
                                    type: "input",
                                    name: `${TSGeneratorSetting.SubGenerator}.${SubGeneratorSetting.Name}`,
                                    message: "What's the unique name of the sub-generator?",
                                    default: (settings: ITSGeneratorSettings) => kebabCase(settings[TSGeneratorSetting.SubGenerator][SubGeneratorSetting.DisplayName] || ""),
                                    validate: (input: string) => /[\w-]+/.test(input) ? true : "Please provide a name according to the npm naming-conventions."
                                }
                            ]
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
        let sourceRoot = "src";
        this.log();
        this.log(chalk.whiteBright("Generating the Workspace"));

        this.destinationRoot(this.Settings[TSGeneratorSetting.Destination]);
        this.fs.writeJSON(this.destinationPath("package.json"), this.GetPackageJSON());
        this.fs.copy(this.templatePath(".gitignore.ejs"), this.destinationPath(".gitignore"));
        this.fs.copy(this.templatePath(".npmignore.ejs"), this.destinationPath(".npmignore"));
        this.fs.copy(this.modulePath("tsconfig.json"), this.destinationPath("tsconfig.json"));
        this.fs.copy(this.modulePath("test", "mocha.opts"), this.destinationPath("test", "mocha.opts"));
        this.fs.copyTpl(
            this.templatePath("GettingStarted.md.ejs"),
            this.destinationPath("GettingStarted.md"),
            {
                Name: this.Settings[TSGeneratorSetting.Name],
                HasCodeWorkspace: this.Settings[GeneratorSetting.Components].includes(TSGeneratorComponent.VSCode),
                SubGeneratorName: this.Settings[GeneratorSetting.Components].includes(TSGeneratorComponent.SubGeneratorExample) ? this.Settings[TSGeneratorSetting.SubGenerator][SubGeneratorSetting.Name] : null
            });
        this.fs.copyTpl(
            this.templatePath("README.md.ejs"),
            this.destinationPath("README.md"),
            {
                Name: this.Settings[TSGeneratorSetting.Name],
                DisplayName: this.Settings[TSGeneratorSetting.DisplayName],
                Description: this.Settings[TSGeneratorSetting.Description]
            });
        this.fs.copyTpl(
            this.templatePath("tests", "main.test.ts.ejs"),
            this.destinationPath(sourceRoot, "tests", "main.test.ts"),
            {
                Name: this.Settings[TSGeneratorSetting.DisplayName]
            });
        this.fs.copyTpl(
            this.templatePath("tests", "Generators", "index.test.ts.ejs"),
            this.destinationPath(sourceRoot, "tests", "Generators", "index.test.ts"),
            {
                Name: this.Settings[TSGeneratorSetting.Name]
            });
        this.fs.copyTpl(
            this.templatePath("tests", "Generators", "app.test.ts.ejs"),
            this.destinationPath(sourceRoot, "tests", "Generators", `${this.Settings[TSGeneratorSetting.Name]}.test.ts`),
            {
                Name: this.Settings[TSGeneratorSetting.DisplayName]
            });
        FileSystem.ensureDir(this.destinationPath(sourceRoot, "generators"));
        FileSystem.ensureDir(this.destinationPath("templates"));
        return super.writing();
    }

    public async install()
    {
        this.log("Your workspace has been generated!");
        this.log();
        this.log(chalk.whiteBright("Installing Dependencies..."));
        this.npmInstall();
    }

    public async end()
    {
        this.log();
        this.log(chalk.whiteBright("Cleaning up the TypeScript-Files..."));
        let tsConfigFile = this.destinationPath("tsconfig.json");
        let program = Linter.createProgram(tsConfigFile);
        let config = Linter.loadConfigurationFromPath(this.destinationPath("tslint.json"));
        config.defaultSeverity = "off";

        let linter = new Linter(
            {
                fix: true
            },
            program);

        for (let fileName of program.getRootFileNames())
        {
            this.log(chalk.gray(`Cleaning up "${Path.relative(this.destinationPath(), fileName)}"...`));
            linter.lint(fileName, (await FileSystem.readFile(fileName)).toString(), config);
        }

        this.log();
        this.log(chalk.whiteBright("Finished"));
        this.log(dedent(`
            Your package "${this.Settings[TSGeneratorSetting.DisplayName]}" has been created!
            To start editing with Visual Studio Code use following command:

                code "${this.Settings[TSGeneratorSetting.Destination]}"

            Open "GettingStarted.md" in order to learn more about how to create your very own generator.
            Thanks for using TSGeneratorGenerator!`));
        this.log();
    }

    /**
     * Creates file-mappings for a generator.
     *
     * @param id
     * The id of the generator.
     *
     * @param displayName
     * The human readable name of the generator.
     *
     * @returns
     * File-mappings for a generator.
     */
    protected GetGeneratorFileMappings = (id: string, displayName: string): IFileMapping<ITSGeneratorSettings>[] =>
    {
        let name = (id.charAt(0).toUpperCase() + camelCase(id).slice(1));
        let source = "generator";
        let destination = `src/generators/${id}`;
        let generatorName = `${name}Generator`;
        let identities = `${name}Setting`;
        let settings = `I${name}Settings`;

        return [
            {
                Source: Path.join(source, "LicenseType.ts.ejs"),
                Destination: Path.join(destination, "LicenseType.ts")
            },
            {
                Source: Path.join(source, "Setting.ts.ejs"),
                Context: () =>
                {
                    return { Name: identities };
                },
                Destination: Path.join(destination, `${identities}.ts`)
            },
            {
                Source: Path.join(source, "ISettings.ts.ejs"),
                Context: () =>
                {
                    return {
                        Name: generatorName,
                        SettingsInterface: settings,
                        Identities: identities
                    };
                },
                Destination: Path.join(destination, `${settings}.ts`)
            },
            {
                Source: Path.join(source, "Generator.ts.ejs"),
                Context: () =>
                {
                    return {
                        Name: generatorName,
                        SettingsInterface: settings,
                        Identities: identities,
                        ID: id,
                        DisplayName: displayName
                    };
                },
                Destination: Path.join(destination, `${generatorName}.ts`)
            },
            {
                Source: Path.join(source, "index.ts.ejs"),
                Context: () =>
                {
                    return {
                        Name: generatorName
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

    /**
     * Gets the package-manifest for the generator to generate.
     */
    protected GetPackageJSON = (): {} =>
    {
        let scripts = [
            "build",
            "rebuild",
            "watch",
            "clean",
            "lint",
            "test",
            "prepare"
        ];

        let dependencies = [
            "extended-yo-generator"
        ];

        let devDependencies = [
            "@types/mocha",
            "@types/node",
            "mocha",
            "rimraf",
            "tslint",
            "typescript",
            "typescript-tslint-plugin",
            "yo"
        ];

        if (
            this.Settings[GeneratorSetting.Components].includes(TSGeneratorComponent.GeneratorExample) ||
            this.Settings[GeneratorSetting.Components].includes(TSGeneratorComponent.SubGeneratorExample))
        {
            dependencies.push(
                "chalk",
                "dedent",
                "yosay");

            devDependencies.push(
                "@types/dedent",
                "@types/yosay");
        }

        let result = {
            name: this.Settings[TSGeneratorSetting.Name],
            version: "0.0.0",
            description: this.Settings[TSGeneratorSetting.Description],
            author: {
                name: this.user.git.name(),
                email: this.user.git.email()
            },
            keywords: ["yeoman-generator"],
            scripts: {} as { [key: string]: string },
            dependencies: {} as { [key: string]: string },
            devDependencies: {} as { [key: string]: string }
        };

        let packageJSON: typeof result = require(Path.join(__dirname, "..", "..", "..", "package.json"));

        for (let script of scripts)
        {
            if (script in packageJSON.scripts)
            {
                result.scripts[script] = packageJSON.scripts[script];
            }
        }

        for (let devDependency of devDependencies.sort())
        {
            if (devDependency in packageJSON.devDependencies)
            {
                result.devDependencies[devDependency] = packageJSON.devDependencies[devDependency];
            }
        }

        for (let dependency of dependencies.sort())
        {
            if (dependency in packageJSON.dependencies)
            {
                result.dependencies[dependency] = packageJSON.dependencies[dependency];
            }
        }

        return result;
    }
}