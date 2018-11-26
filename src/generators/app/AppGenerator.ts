import chalk from "chalk";
import dedent = require("dedent");
import { Generator, GeneratorSetting, IComponentProvider, IFileMapping, Question } from "extended-yo-generator";
import FileSystem = require("fs-extra");
import camelCase = require("lodash.camelcase");
import kebabCase = require("lodash.kebabcase");
import Path = require("path");
import yosay = require("yosay");
import { AppComponent } from "./AppComponent";
import { AppSetting } from "./AppSetting";
import { IAppSettings } from "./IAppSettings";
import { LintMode } from "./LintMode";
import { SubGeneratorSetting } from "./SubGeneratorSetting";

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
    public constructor(args: string | string[], options: {})
    {
        super(args, options);
    }

    protected get TemplateRoot(): string
    {
        return "app";
    }

    protected get Questions(): Question<IAppSettings>[]
    {
        return [
            {
                type: "input",
                name: AppSetting.Destination,
                message: "Where do you want to save your generator to?",
                default: "./",
                filter: async input => Path.isAbsolute(input) ? input : Path.resolve(process.cwd(), input)
            },
            {
                type: "input",
                name: AppSetting.DisplayName,
                message: "What's the name of your project?",
                default: (answers: IAppSettings) => Path.basename(answers[AppSetting.Destination]),
                validate: (input: string) => /.+/.test(input.trim()) ? true : "The name must not be empty!"
            },
            {
                type: "input",
                name: AppSetting.Name,
                message: "What's the name of the node-module?",
                default: (answers: IAppSettings) => "generator-" + kebabCase(answers[AppSetting.DisplayName].replace(/(generator-)?(.*?)(generator)?$/i, "$2")),
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
                            ID: AppComponent.TSLint,
                            DisplayName: "TSLint configurations",
                            Default: true,
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
                                                return this.modulePath("tslint.json");
                                        }
                                    },
                                    Destination: "tslint.json"
                                }
                            ]
                        },
                        {
                            ID: AppComponent.VSCode,
                            DisplayName: "Visual Studio Code-Workspace",
                            Default: true,
                            FileMappings: [
                                {
                                    Source: this.modulePath(".vscode"),
                                    Destination: ".vscode"
                                },
                                {
                                    Source: "launch.json",
                                    Destination: () => this.destinationPath(".vscode", "launch.json")
                                }
                            ]
                        },
                        {
                            ID: AppComponent.GeneratorExample,
                            DisplayName: "Example Generator (recommended)",
                            FileMappings: (settings) => this.GetGeneratorFileMappings("app", settings[AppSetting.DisplayName])
                        },
                        {
                            ID: AppComponent.SubGeneratorExample,
                            DisplayName: "Example Sub-Generator",
                            Questions: [
                                {
                                    type: "input",
                                    name: `${AppSetting.SubGenerator}.${SubGeneratorSetting.DisplayName}`,
                                    message: "What's the human-readable name of your sub-generator?",
                                    validate: (input: string) => /.+/.test(input.trim()) ? true : "The name must not be empty!"
                                },
                                {
                                    type: "input",
                                    name: `${AppSetting.SubGenerator}.${SubGeneratorSetting.Name}`,
                                    message: "What's the unique name of the sub-generator?",
                                    default: (settings: IAppSettings) => kebabCase(settings[AppSetting.SubGenerator][SubGeneratorSetting.DisplayName] || ""),
                                    validate: (input: string) => /[\w-]+/.test(input) ? true : "Please provide a name according to the npm naming-conventions."
                                }
                            ],
                            FileMappings: (settings) => this.GetGeneratorFileMappings(settings[AppSetting.SubGenerator][SubGeneratorSetting.Name], settings[AppSetting.SubGenerator][SubGeneratorSetting.DisplayName])
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
        this.destinationRoot(this.Settings[AppSetting.Destination]);
        this.fs.writeJSON(this.destinationPath("package.json"), this.GetPackageJSON());
        this.fs.copy(this.templatePath(".gitignore.ejs"), this.destinationPath(".gitignore"));
        this.fs.copy(this.templatePath(".npmignore.ejs"), this.destinationPath(".npmignore"));
        this.fs.copy(this.modulePath("tsconfig.json"), this.destinationPath("tsconfig.json"));
        this.fs.copy(this.modulePath("test", "mocha.opts"), this.destinationPath("test", "mocha.opts"));
        this.fs.copyTpl(
            this.templatePath("GettingStarted.md.ejs"),
            this.destinationPath("GettingStarted.md"),
            {
                Name: this.Settings[AppSetting.Name],
                HasCodeWorkspace: this.Settings[GeneratorSetting.Components].includes(AppComponent.VSCode),
                SubGeneratorName: this.Settings[GeneratorSetting.Components].includes(AppComponent.SubGeneratorExample) ? this.Settings[AppSetting.SubGenerator][SubGeneratorSetting.Name] : null
            });
        this.fs.copyTpl(
            this.templatePath("README.md.ejs"),
            this.destinationPath("README.md"),
            {
                Name: this.Settings[AppSetting.Name],
                DisplayName: this.Settings[AppSetting.DisplayName],
                Description: this.Settings[AppSetting.Description]
            });
        this.fs.copyTpl(
            this.templatePath("tests", "main.test.ts.ejs"),
            this.destinationPath(sourceRoot, "tests", "main.test.ts"),
            {
                Name: this.Settings[AppSetting.DisplayName]
            });
        this.fs.copyTpl(
            this.templatePath("tests", "Generators", "index.test.ts.ejs"),
            this.destinationPath(sourceRoot, "tests", "Generators", "index.test.ts"),
            {
                Name: this.Settings[AppSetting.Name]
            });
        this.fs.copyTpl(
            this.templatePath("tests", "Generators", "app.test.ts.ejs"),
            this.destinationPath(sourceRoot, "tests", "Generators", `${this.Settings[AppSetting.Name]}.test.ts`),
            {
                Name: this.Settings[AppSetting.DisplayName]
            });
        FileSystem.ensureDir(this.destinationPath(sourceRoot, "generators"));
        FileSystem.ensureDir(this.destinationPath("templates"));
        return super.writing();
    }

    public async install()
    {
        this.log("Your workspace has been generated!");
        this.log();
        this.log(chalk.whiteBright("Installing dependencies..."));
        this.npmInstall();
    }

    public async end()
    {
        this.log(dedent(`
            Your package "${this.Settings[AppSetting.DisplayName]}" has been created!
            To start editing with Visual Studio Code use following commands:

                code "${this.Settings[AppSetting.Destination]}"

            Open "GettingStarted.md" in order to learn more about how to create your very own generator.`));
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
    protected GetGeneratorFileMappings = (id: string, displayName: string): IFileMapping<IAppSettings>[] =>
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
            "compile",
            "watch",
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
            "@types/yeoman-generator",
            "mocha",
            "tslint",
            "typescript",
            "typescript-tslint-plugin",
            "yo"
        ];

        if (
            this.Settings[GeneratorSetting.Components].includes(AppComponent.GeneratorExample) ||
            this.Settings[GeneratorSetting.Components].includes(AppComponent.SubGeneratorExample))
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
            name: this.Settings[AppSetting.Name],
            version: "0.0.0",
            description: this.Settings[AppSetting.Description],
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