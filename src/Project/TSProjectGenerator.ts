import { createRequire } from "module";
import { relative } from "path";
import { Generator, Question, IComponentCollection, IFileMapping, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import chalk = require("chalk");
import JSON = require("comment-json");
import dedent = require("dedent");
import { ESLint } from "eslint";
import { readFile, writeJSON } from "fs-extra";
import npmWhich = require("npm-which");
import { TempDirectory } from "temp-filesystem";
import { Linter } from "tslint";
import { Program } from "typescript";
import { join } from "upath";
import { BuildDependencies } from "../NPMPackaging/Dependencies/BuildDependencies";
import { LintDependencies } from "../NPMPackaging/Dependencies/LintDependencies";
import { TSProjectComponentCollection } from "./Components/TSProjectComponentCollection";
import { TSProjectPackageFileMapping } from "./FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { TSProjectQuestionCollection } from "./Inquiry/TSProjectQuestionCollection";
import { ITSProjectSettings } from "./Settings/ITSProjectSettings";
import { TSProjectComponent } from "./Settings/TSProjectComponent";
import { TSProjectSettingKey } from "./Settings/TSProjectSettingKey";

/**
 * Provides the functionality to generate a project writtein in TypeScript.
 */
export class TSProjectGenerator<T extends ITSProjectSettings = ITSProjectSettings> extends Generator<T>
{
    /**
     * Initializes a new instance of the `TSProjectGenerator<T>` class.
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
     * Gets the path to the directory for the source-files.
     */
    protected get SourceRoot(): string
    {
        return "src";
    }

    /**
     * @inheritdoc
     */
    protected get Questions(): Array<Question<T>>
    {
        return new TSProjectQuestionCollection().Questions;
    }

    /**
     * @inheritdoc
     */
    protected get Components(): IComponentCollection<T>
    {
        return new TSProjectComponentCollection();
    }

    /**
     * @inheritdoc
     */
    protected get FileMappings(): Array<IFileMapping<T>>
    {
        return [
            new TSProjectPackageFileMapping(this),
            {
                Source: this.commonTemplatePath(".gitignore.ejs"),
                Destination: ".gitignore"
            },
            {
                Source: this.commonTemplatePath(".npmignore.ejs"),
                Destination: ".npmignore"
            },
            {
                Source: this.modulePath(".mocharc.jsonc"),
                Destination: ".mocharc.jsonc"
            },
            {
                Source: this.modulePath("tsconfig.base.json"),
                Destination: "tsconfig.base.json"
            },
            {
                Source: this.modulePath("tsconfig.json"),
                Destination: "tsconfig.json",
                Processor: async (target, generator) =>
                {
                    let tsConfig = JSON.parse((await readFile(await target.Source)).toString());

                    if (!this.Settings[GeneratorSettingKey.Components].includes(TSProjectComponent.Linting))
                    {
                        delete tsConfig.references;
                    }

                    generator.fs.write(await target.Destination, JSON.stringify(tsConfig, null, 4));
                }
            }
        ];
    }

    /**
     * @inheritdoc
     */
    public async prompting(): Promise<void>
    {
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public async writing(): Promise<void>
    {
        this.log(chalk.whiteBright("Generating the Workspace"));
        this.destinationRoot(this.Settings[TSProjectSettingKey.Destination]);
        return super.writing();
    }

    /**
     * @inheritdoc
     */
    public async install(): Promise<void>
    {
        this.log(
            dedent(
                `Your workspace has been generated!

                ${chalk.whiteBright("Installing Dependencies...")}`));

        this.npmInstall();
    }

    /**
     * @inheritdoc
     */
    public async end(): Promise<void>
    {
        let tempDir = new TempDirectory();
        let lintPackage = new Package(tempDir.MakePath("package.json"), {});
        let workspaceRequire: NodeRequire;
        let linterConstructor: typeof Linter;
        let eslintConstructor: typeof ESLint;
        let program: Program;
        let linter: ESLint;
        let tsConfigFile = this.destinationPath("tsconfig.json");
        this.log();
        this.log(chalk.whiteBright("Cleaning up the TypeScript-Files…"));
        this.log(chalk.whiteBright("Creating a temporary linting-environment…"));
        lintPackage.Register(new BuildDependencies());
        lintPackage.Register(new LintDependencies());
        await writeJSON(lintPackage.FileName, lintPackage.ToJSON());

        this.spawnCommandSync(
            npmWhich(__dirname).sync("npm"),
            [
                "install",
                "--silent"
            ],
            {
                cwd: tempDir.FullName
            });

        workspaceRequire = createRequire(join(tempDir.FullName, ".js"));
        linterConstructor = workspaceRequire("tslint").Linter;
        eslintConstructor = workspaceRequire("eslint").ESLint;
        program = linterConstructor.createProgram(tsConfigFile);

        linter = new eslintConstructor(
            {
                cwd: tempDir.FullName,
                fix: true,
                useEslintrc: false,
                overrideConfigFile: join(__dirname, "..", "..", ".eslintrc.js"),
                overrideConfig: {
                    parserOptions: {
                        project: tsConfigFile
                    }
                }
            });

        for (let fileName of program.getRootFileNames())
        {
            this.log(chalk.gray(`Cleaning up "${relative(this.destinationPath(), fileName)}"…`));
            await ESLint.outputFixes(await linter.lintFiles(fileName));
        }

        this.log();

        this.log(
            dedent(
                `
                    ${chalk.whiteBright("Finished!")}
                    Your package "${this.Settings[TSProjectSettingKey.DisplayName]}" has been created!
                    To start editing with Visual Studio Code use the following command:

                        code "${this.Settings[TSProjectSettingKey.Destination]}"`));
    }
}
