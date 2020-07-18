import { join } from "path";
import { IComponentCollection, IFileMapping } from "@manuth/extended-yo-generator";
import chalk = require("chalk");
import yosay = require("yosay");
import { TSProjectPackageFileMapping } from "../../Project/FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator";
import { TSModuleComponentCollection } from "./Components/TSModuleComponentCollection";
import { TSModulePackageFileMapping } from "./FileMappings/NPMPackaging/TSModulePackageFileMapping";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 */
export class TSModuleGenerator<T extends ITSProjectSettings = ITSProjectSettings> extends TSProjectGenerator<T>
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
        return "module";
    }

    /**
     * @inheritdoc
     */
    protected get Components(): IComponentCollection<T>
    {
        return new TSModuleComponentCollection();
    }

    /**
     * @inheritdoc
     */
    protected get FileMappings(): Array<IFileMapping<T>>
    {
        let result: Array<IFileMapping<T>> = [];

        for (let fileMapping of super.FileMappings)
        {
            if (fileMapping instanceof TSProjectPackageFileMapping)
            {
                result.push(new TSModulePackageFileMapping(this));
            }
            else
            {
                result.push(fileMapping);
            }
        }

        return [
            ...result,
            {
                Source: "index.ts.ejs",
                Destination: "index.ts"
            },
            {
                Source: "main.test.ts.ejs",
                Destination: join(this.SourceRoot, "tests", "main.test.ts"),
                Context: () =>
                {
                    return {
                        Name: this.Settings[TSProjectSettingKey.DisplayName]
                    };
                }
            },
            {
                Source: "README.md",
                Destination: "README.md",
                Context: () =>
                {
                    return {
                        Name: this.Settings[TSProjectSettingKey.DisplayName],
                        Description: this.Settings[TSProjectSettingKey.Description]
                    };
                }
            }
        ];
    }

    /**
     * @inheritdoc
     */
    public async prompting(): Promise<void>
    {
        this.log(yosay(`Welcome to the ${chalk.whiteBright.bold("TypeScript Module")} generator!`));
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
    public async install(): Promise<void>
    {
        return super.install();
    }

    /**
     * @inheritdoc
     */
    public async end(): Promise<void>
    {
        return super.end();
    }
}
