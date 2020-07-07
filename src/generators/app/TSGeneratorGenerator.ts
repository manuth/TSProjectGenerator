import Path = require("path");
import { isNullOrUndefined } from "util";
import chalk = require("chalk");
import JSON = require("comment-json");
import Dedent = require("dedent");
import { ESLint } from "eslint";
import { Generator, GeneratorSetting, IComponentCollection, IFileMapping, Question } from "extended-yo-generator";
import FileSystem = require("fs-extra");
import CamelCase = require("lodash.camelcase");
import KebabCase = require("lodash.kebabcase");
import { Linter } from "tslint";
import YoSay = require("yosay");
import { LintRuleset } from "../../Linting/LintRuleset";
import { IScriptMapping } from "../../NPMPackaging/IScriptMapping";
import { ILaunchFile } from "../../VSCode/ILaunchFile";
import { ITSGeneratorSettings } from "./ITSGeneratorSettings";
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
    protected get Questions(): Array<Question<ITSGeneratorSettings>>
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
                default: (answers: ITSGeneratorSettings) => "generator-" + KebabCase(answers[TSGeneratorSetting.DisplayName].replace(/(generator-)?(.*?)(generator)?$/i, "$2")),
                filter: input => KebabCase(input),
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

    /**
     * @inheritdoc
     */
    protected get Components(): IComponentCollection<ITSGeneratorSettings>
    {
        return {
            Question: "What do you want to include in your workspace?",
            Categories: [
                {
                    DisplayName: "General",
                    Components: [
                        {
                            ID: TSGeneratorComponent.Linting,
                            DisplayName: "ESLint configurations",
                            DefaultEnabled: true,
                            Questions: [
                                {
                                    name: TSGeneratorSetting.LintRuleset,
                                    type: "list",
                                    message: "What ruleset do you want to use for linting?",
                                    choices: [
                                        {
                                            value: LintRuleset.Weak,
                                            name: "manuth's weak ruleset"
                                        },
                                        {
                                            value: LintRuleset.Recommended,
                                            name: "manuth's recommended ruleset"
                                        }
                                    ],
                                    default: LintRuleset.Recommended
                                }
                            ],
                            FileMappings: [
                                {
                                    Source: ".eslintrc.js.ejs",
                                    Destination: ".eslintrc.js",
                                    Context: (fileMapping, generator) =>
                                    {
                                        let preset: string;

                                        switch (generator.Settings[TSGeneratorSetting.LintRuleset])
                                        {
                                            case LintRuleset.Weak:
                                                preset = "weak-requiring-type-checking";
                                                break;
                                            case LintRuleset.Recommended:
                                            default:
                                                preset = "recommended-requiring-type-checking";
                                                break;
                                        }

                                        return {
                                            preset
                                        };
                                    }
                                },
                                {
                                    Source: this.modulePath("tsconfig.eslint.json"),
                                    Destination: "tsconfig.eslint.json"
                                }
                            ]
                        },
                        {
                            ID: TSGeneratorComponent.VSCode,
                            DisplayName: "Visual Studio Code-Workspace",
                            DefaultEnabled: true,
                            FileMappings: [
                                {
                                    Source: this.modulePath(".vscode"),
                                    Destination: ".vscode"
                                },
                                {
                                    Source: this.modulePath(".vscode", "launch.json"),
                                    Destination: this.destinationPath(".vscode", "launch.json"),
                                    Processor: async (fileMapping) =>
                                    {
                                        let configurations: any[] = [];
                                        let launch: ILaunchFile = JSON.parse((await FileSystem.readFile(await fileMapping.Source)).toString());

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
                                                    name: generatorName === "app" ? "Launch Yeoman" : `Launch ${generatorName} generator`,
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
                                        this.fs.write(await fileMapping.Destination, JSON.stringify(launch, null, 4));
                                    }
                                },
                                {
                                    Source: this.modulePath(".vscode", "settings.json"),
                                    Destination: this.destinationPath(".vscode", "settings.json"),
                                    Processor: async (fileMapping) =>
                                    {
                                        let result: any = {};
                                        let settings = JSON.parse((await FileSystem.readFile(await fileMapping.Source)).toString());

                                        for (let key in settings)
                                        {
                                            if (key !== "files.associations")
                                            {
                                                result[key] = settings[key];
                                            }
                                        }

                                        this.fs.write(await fileMapping.Destination, JSON.stringify(result, null, 4));
                                    }
                                }
                            ]
                        },
                        {
                            ID: TSGeneratorComponent.GeneratorExample,
                            DisplayName: "Example Generator (recommended)",
                            DefaultEnabled: true,
                            FileMappings: (fileMapping, generator) => this.GetGeneratorFileMappings("app", generator.Settings[TSGeneratorSetting.DisplayName])
                        },
                        {
                            ID: TSGeneratorComponent.SubGeneratorExample,
                            DisplayName: "Example Sub-Generator",
                            FileMappings: (fileMapping, generator) => this.GetGeneratorFileMappings(
                                generator.Settings[TSGeneratorSetting.SubGenerator][SubGeneratorSetting.Name],
                                generator.Settings[TSGeneratorSetting.SubGenerator][SubGeneratorSetting.DisplayName]),
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
                                    default: (settings: ITSGeneratorSettings) => KebabCase(settings[TSGeneratorSetting.SubGenerator][SubGeneratorSetting.DisplayName] || ""),
                                    validate: (input: string) => /[\w-]+/.test(input) ? true : "Please provide a name according to the npm naming-conventions."
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
        this.log(YoSay(`Welcome to the ${chalk.whiteBright("TypeScript Generator")} generator!`));
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public async writing(): Promise<void>
    {
        let sourceRoot = "src";
        this.log(chalk.whiteBright("Generating the Workspace"));

        this.destinationRoot(this.Settings[TSGeneratorSetting.Destination]);
        this.fs.writeJSON(this.destinationPath("package.json"), await this.GetPackageJSON());
        this.fs.copy(this.templatePath(".gitignore.ejs"), this.destinationPath(".gitignore"));
        this.fs.copy(this.templatePath(".markdownlint.json"), this.destinationPath(".markdownlint.json"));
        this.fs.copy(this.templatePath(".npmignore.ejs"), this.destinationPath(".npmignore"));
        this.fs.copy(this.modulePath(".mocharc.jsonc"), this.destinationPath(".mocharc.jsonc"));
        this.fs.copyTpl(
            this.templatePath("GettingStarted.md.ejs"),
            this.destinationPath("GettingStarted.md"),
            {
                ID: this.Settings[TSGeneratorSetting.Name].replace(/^generator-/, ""),
                Name: this.Settings[TSGeneratorSetting.Name],
                HasCodeWorkspace: this.Settings[GeneratorSetting.Components].includes(TSGeneratorComponent.VSCode),
                HasLinting: this.Settings[GeneratorSetting.Components].includes(TSGeneratorComponent.Linting),
                HasGenerator: this.Settings[GeneratorSetting.Components].includes(TSGeneratorComponent.GeneratorExample),
                HasSubGenerator: this.Settings[GeneratorSetting.Components].includes(TSGeneratorComponent.SubGeneratorExample),
                SubGeneratorName: this.Settings[TSGeneratorSetting.SubGenerator]?.[SubGeneratorSetting.Name] ?? null,
                SubGeneratorPath: Path.join(sourceRoot, "generators", this.Settings[TSGeneratorSetting.SubGenerator]?.[SubGeneratorSetting.Name] ?? "")
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

        let tsConfig = await FileSystem.readJSON(this.modulePath("tsconfig.json"));

        if (!this.Settings[GeneratorSetting.Components].includes(TSGeneratorComponent.Linting))
        {
            delete tsConfig.references;
        }

        this.fs.copy(this.modulePath("tsconfig.base.json"), this.destinationPath("tsconfig.base.json"));
        this.fs.writeJSON(this.destinationPath("tsconfig.json"), tsConfig, null, 4);
        return super.writing();
    }

    /**
     * @inheritdoc
     */
    public async install(): Promise<void>
    {
        this.log(
            Dedent(
                `Your workspace has been generated!

                ${chalk.whiteBright("Installing Dependencies...")}`));
        this.npmInstall();
    }

    /**
     * @inheritdoc
     */
    public async end(): Promise<void>
    {
        this.log();
        this.log(chalk.whiteBright("Cleaning up the TypeScript-Files..."));

        let tsConfigFile = this.destinationPath("tsconfig.json");
        let program = Linter.createProgram(tsConfigFile);
        let linter = new ESLint(
            {
                cwd: __dirname,
                fix: true,
                useEslintrc: false,
                overrideConfigFile: Path.join(__dirname, "..", "..", "..", ".eslintrc.js")
            });

        for (let fileName of program.getRootFileNames())
        {
            this.log(chalk.gray(`Cleaning up "${Path.relative(this.destinationPath(), fileName)}"...`));
            await ESLint.outputFixes(await linter.lintFiles(fileName));
        }

        this.log();
        this.log(Dedent(`
            ${chalk.whiteBright("Finished")}
            Your package "${this.Settings[TSGeneratorSetting.DisplayName]}" has been created!
            To start editing with Visual Studio Code use following command:

                code "${this.Settings[TSGeneratorSetting.Destination]}"

            Open "GettingStarted.md" in order to learn more about how to create your very own generator.
            Thanks for using TSGeneratorGenerator!`));
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
    protected GetGeneratorFileMappings =
        (id: string, displayName: string): Array<IFileMapping<ITSGeneratorSettings>> =>
        {
            let name = (id.charAt(0).toUpperCase() + CamelCase(id).slice(1));
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
        };

    /**
     * Gets the package-manifest for the generator to generate.
     *
     * @returns
     * The `package.json`-metadata.
     */
    protected GetPackageJSON =
        async (): Promise<Record<string, unknown>> =>
        {
            let scripts: Array<IScriptMapping | string> = [
                "build",
                "rebuild",
                "watch",
                "clean",
                {
                    Source: "lint-code",
                    Destination: "lint"
                },
                {
                    Source: "lint-code-compact",
                    Destination: "lint-compact",
                    Processor: (script) => script.replace("lint-code", "lint")
                },
                "test",
                "prepare"
            ];

            let dependencies = [
                "extended-yo-generator"
            ];

            let devDependencies = [
                "@manuth/tsconfig",
                "@types/mocha",
                "@types/node",
                "mocha",
                "rimraf",
                "typescript",
                "yo"
            ];

            if (this.Settings[GeneratorSetting.Components].includes(TSGeneratorComponent.Linting))
            {
                devDependencies.push(
                    "@manuth/eslint-plugin-typescript",
                    "@typescript-eslint/eslint-plugin",
                    "@typescript-eslint/parser",
                    "@typescript-eslint/eslint-plugin-tslint",
                    "eslint",
                    "eslint-plugin-import",
                    "eslint-plugin-jsdoc",
                    "tslint",
                    "typescript-eslint-plugin"
                );
            }

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

            let packageJSON: typeof result = await import(Path.join(__dirname, "..", "..", "..", "package.json"));
            let sourceDependencies = { ...packageJSON.dependencies, ...packageJSON.devDependencies };

            for (let script of scripts)
            {
                if (typeof script === "string")
                {
                    script = {
                        Source: script,
                        Destination: script
                    };
                }

                if (script.Source in packageJSON.scripts)
                {
                    let processor = script.Processor ?? ((script) => script);
                    result.scripts[script.Destination] = processor(packageJSON.scripts[script.Source]);
                }
            }

            for (let devDependency of devDependencies.sort())
            {
                if (devDependency in sourceDependencies)
                {
                    result.devDependencies[devDependency] = sourceDependencies[devDependency];
                }
            }

            for (let dependency of dependencies.sort())
            {
                if (dependency in sourceDependencies)
                {
                    result.dependencies[dependency] = sourceDependencies[dependency];
                }
            }

            return result;
        };
}
