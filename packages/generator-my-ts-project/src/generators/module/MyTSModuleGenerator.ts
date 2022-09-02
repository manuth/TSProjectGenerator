import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITSProjectSettings, TSModuleGenerator } from "@manuth/generator-ts-project";
import buildResolver from "esm-resolve";
import { MyTSProjectGenerator } from "../../MyTSProjectGenerator.js";

const basePath = createRequire(import.meta.url).resolve(
    buildResolver(fileURLToPath(import.meta.url))("@manuth/generator-ts-project")
);

/**
 * Provides the functionality to generate a module written in TypeScript.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class MyTSModuleGenerator<TSettings extends ITSProjectSettings = ITSProjectSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends MyTSProjectGenerator.Create(TSModuleGenerator, basePath)<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link MyTSModuleGenerator `MyTSModuleGenerator<TSettings, TOptions>`} class.
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
    public override async prompting(): Promise<void>
    {
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public override async writing(): Promise<void>
    {
        return super.writing();
    }

    /**
     * @inheritdoc
     */
    public override async install(): Promise<void>
    {
        return super.install();
    }

    /**
     * @inheritdoc
     */
    public override async cleanup(): Promise<void>
    {
        return super.cleanup();
    }

    /**
     * @inheritdoc
     */
    public override async end(): Promise<void>
    {
        return super.end();
    }
}
