import Path = require("path");
import { isNullOrUndefined } from "util";
import { Generator, IComponentCollection, Question } from "@manuth/extended-yo-generator";
import { IPackageJSON } from "@manuth/package-json-editor";
import chalk = require("chalk");
import JSON = require("comment-json");
import Dedent = require("dedent");
import FileSystem = require("fs-extra");
import KebabCase = require("lodash.kebabcase");
import YoSay = require("yosay");
import { LintRuleset } from "../../Linting/LintRuleset";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { IExtensionFile } from "../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../VSCode/ILaunchFile";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 */
export class ModuleGenerator<T extends ITSProjectSettings = ITSProjectSettings> extends Generator<ITSProjectSettings>
{
    /**
     * Initializes a new instance of the `ModuleGenerator<T>` class.
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
    protected get Questions(): Array<Question<T>>
    {
        return [
            {
                type: "input",
                name: TSProjectSettingKey.Destination,
                message: "Where do you want to save your project to?",
                default: "./",
                filter: async input => Path.isAbsolute(input) ? input : Path.resolve(process.cwd(), input)
            },
            {
                type: "input",
                name: TSProjectSettingKey.DisplayName,
                message: "What's the name of your project?",
                default: (answers: ITSProjectSettings) => Path.basename(answers[TSProjectSettingKey.Destination])
            },
            {
                type: "input",
                name: TSProjectSettingKey.Name,
                message: "What's the name of the module to generate?",
                default: (answers: ITSProjectSettings) => KebabCase(answers[TSProjectSettingKey.DisplayName])
            },
            {
                type: "input",
                name: TSProjectSettingKey.Description,
                message: "Please enter a description."
            }
        ];
    }

    /**
     * @inheritdoc
     */
    protected get ProvidedComponents(): IComponentCollection<ITSProjectSettings>
    {
        return {
            Question: "What do you want to include in your workspace?",
            Categories: [
                {
                    DisplayName: "General",
                    Components: [
                        {
                            ID: TSProjectComponent.Linting,
                            DisplayName: "Linting configurations",
                            DefaultEnabled: true,
                            Questions: [
                                {
                                    name: TSProjectSettingKey.LintRuleset,
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
                                    Destination: "tslint.json",
                                    Processor: async (fileMapping, generator) =>
                                    {
                                        let preset: string;

                                        switch (generator.Settings[TSProjectSettingKey.LintRuleset])
                                        {
                                            case LintRuleset.Weak:
                                                preset = "@manuth/tslint-presets/weak";
                                                break;
                                            case LintRuleset.Recommended:
                                            default:
                                                preset = "@manuth/tslint-presets/recommended";
                                                break;
                                        }

                                        this.fs.writeJSON(await fileMapping.Destination, { extends: preset }, null, 4);
                                    }
                                }
                            ]
                        },
                        {
                            ID: TSProjectComponent.VSCode,
                            DisplayName: "Visual Studio Code-Workspace",
                            DefaultEnabled: true,
                            FileMappings: [
                                {
                                    Source: this.modulePath(".vscode"),
                                    Destination: ".vscode"
                                },
                                {
                                    Source: this.modulePath(".vscode", "extensions.json"),
                                    Destination: Path.join(".vscode", "extensions.json"),
                                    Processor: async (fileMapping) =>
                                    {
                                        let result: IExtensionFile = {};
                                        let extensions: typeof result = JSON.parse((await FileSystem.readFile(await fileMapping.Source)).toString());
                                        result.recommendations = [];

                                        if (!isNullOrUndefined(extensions.recommendations))
                                        {
                                            for (let extension of extensions.recommendations)
                                            {
                                                if (
                                                    (extension !== "qassimfarid.ejs-language-support") &&
                                                    (extension !== "davidanson.vscode-markdownlint"))
                                                {
                                                    result.recommendations.push(extension);
                                                }
                                            }
                                        }

                                        return this.fs.write(await fileMapping.Destination, JSON.stringify(result, null, 4));
                                    }
                                },
                                {
                                    Source: this.modulePath(".vscode", "launch.json"),
                                    Destination: Path.join(".vscode", "launch.json"),
                                    Processor: async (fileMapping) =>
                                    {
                                        let launch: ILaunchFile = JSON.parse((await FileSystem.readFile(await fileMapping.Source)).toString());

                                        if (!isNullOrUndefined(launch.configurations))
                                        {
                                            let validConfigurations: any[] = [];

                                            for (let configuration of launch.configurations)
                                            {
                                                if (configuration.name.toLowerCase().includes("launch tests"))
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

                                        launch.configurations.unshift(
                                            {
                                                type: "node",
                                                request: "launch",
                                                name: "Launch Program",
                                                program: "${workspaceFolder}/lib/index.js",
                                                preLaunchTask: "Build"
                                            });

                                        this.fs.write(await fileMapping.Destination, JSON.stringify(launch, null, 4));
                                    }
                                },
                                {
                                    Source: this.modulePath(".vscode", "settings.json"),
                                    Destination: Path.join(".vscode", "settings.json"),
                                    Processor: async (fileMapping) =>
                                    {
                                        let result: { [key: string]: any } = {};
                                        let settings: typeof result = JSON.parse((await FileSystem.readFile(await fileMapping.Source)).toString());

                                        for (let key in settings)
                                        {
                                            if (
                                                (key !== "files.associations") &&
                                                (key !== "markdownlint.ignore"))
                                            {
                                                result[key] = settings[key];
                                            }
                                        }

                                        this.fs.write(await fileMapping.Destination, JSON.stringify(result, null, 4));
                                    }
                                },
                                {
                                    Source: this.modulePath(".vscode", "tasks.json"),
                                    Destination: Path.join(".vscode", "tasks.json"),
                                    Processor: async (fileMapping) =>
                                    {
                                        let tasks = JSON.parse((await FileSystem.readFile(await fileMapping.Source)).toString());

                                        if (!isNullOrUndefined(tasks.tasks))
                                        {
                                            let validTasks: any[] = [];

                                            for (let task of tasks.tasks)
                                            {
                                                if (!(task.label as string).toLowerCase().includes("lint"))
                                                {
                                                    validTasks.push(task);
                                                }
                                            }

                                            tasks.tasks = validTasks;
                                        }
                                        else
                                        {
                                            tasks.tasks = [];
                                        }

                                        (tasks.tasks as any[]).push(
                                            {
                                                label: "Lint",
                                                type: "npm",
                                                script: "lint",
                                                problemMatcher: "$tslint5",
                                                presentation: {
                                                    reveal: "never"
                                                }
                                            });

                                        this.fs.write(await fileMapping.Destination, JSON.stringify(tasks, null, 4));
                                    }
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
        this.log(YoSay(`Welcome to the ${chalk.whiteBright("TypeScript-Module")} generator!`));
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public async writing(): Promise<void>
    {
        let sourceDir = "src";
        this.log(chalk.whiteBright("Generating the Workspace"));

        this.destinationRoot(this.Settings[TSProjectSettingKey.Destination]);
        this.fs.copy(this.templatePath("index.ts.ejs"), this.destinationPath(sourceDir, "index.ts"));
        this.fs.copyTpl(
            this.templatePath("main.test.ts.ejs"),
            this.destinationPath(sourceDir, "tests", "main.test.ts"),
            {
                Name: this.Settings[TSProjectSettingKey.DisplayName]
            });
        this.fs.copy(this.modulePath("test", "mocha.opts"), this.destinationPath("test", "mocha.opts"));
        this.fs.copy(this.templatePath(".gitignore.ejs"), this.destinationPath(".gitignore"));
        this.fs.copy(this.templatePath(".npmignore.ejs"), this.destinationPath(".npmignore"));
        this.fs.writeJSON(this.destinationPath("package.json"), await this.GetPackageJSON());
        this.fs.copy(this.modulePath("tsconfig.json"), this.destinationPath("tsconfig.json"));
        this.fs.copyTpl(
            this.templatePath("README.md"),
            this.destinationPath("README.md"),
            {
                Name: this.Settings[TSProjectSettingKey.DisplayName],
                Description: this.Settings[TSProjectSettingKey.Description]
            });
        return super.writing();
    }

    /**
     * @inheritdoc
     */
    public async install(): Promise<void>
    {
        this.log(
            Dedent(`
                Your workspace has been generated!

                ${chalk.whiteBright("Installing dependencies...")}`));
        this.npmInstall();
    }

    /**
     * @inheritdoc
     */
    public async end(): Promise<void>
    {
        this.log(
            Dedent(
                `
                ${chalk.whiteBright("Finished")}
                Your module "${this.Settings[TSProjectSettingKey.DisplayName]}" has been created!
                To start editing with Visual Studio Code use following command:

                    code "${this.Settings[TSProjectSettingKey.Destination]}"

                Thanks for using TSModuleGenerator!`));
    }

    /**
     * Gets the package-manifest for the generator to generate.
     *
     * @returns
     * The generated package-metadata.
     */
    protected GetPackageJSON = async (): Promise<IPackageJSON> =>
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
        let dependencies: string[] = [];
        let devDependencies = [
            "@manuth/tsconfig",
            "@manuth/tslint-presets",
            "@types/mocha",
            "@types/node",
            "mocha",
            "rimraf",
            "tslint",
            "typescript",
            "typescript-tslint-plugin"
        ];

        let result: IPackageJSON = {
            name: this.Settings[TSProjectSettingKey.Name],
            version: "0.0.0",
            description: this.Settings[TSProjectSettingKey.Description],
            author: {
                name: this.user.git.name(),
                email: this.user.git.email()
            },
            keywords: [] as string[],
            main: "lib/index.js",
            types: "lib/index.d.ts",
            scripts: {} as { [key: string]: string },
            dependencies: {} as { [key: string]: string },
            devDependencies: {} as { [key: string]: string }
        };

        let packageJSON: IPackageJSON = await import(this.modulePath("package.json"));

        for (let script of scripts)
        {
            if (script in packageJSON.scripts)
            {
                if (script === "lint")
                {
                    result.scripts[script] = "tslint -p ./ -t verbose";
                }
                else
                {
                    result.scripts[script] = packageJSON.scripts[script];
                }
            }
        }

        for (let devDependency of devDependencies)
        {
            if (devDependency in packageJSON.devDependencies)
            {
                result.devDependencies[devDependency] = packageJSON.devDependencies[devDependency];
            }
        }

        for (let dependency of dependencies)
        {
            if (dependency in packageJSON.dependencies)
            {
                result.dependencies[dependency] = packageJSON.dependencies[dependency];
            }
        }

        return result;
    };
}
