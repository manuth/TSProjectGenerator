import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITSGeneratorSettings, TSGeneratorGenerator } from "@manuth/generator-ts-project";
import { MyTSProjectGenerator } from "../../MyTSProjectGenerator";

/**
 * Provides the functionality to generate a custom generator written in TypeScript.
 */
export class MyTSGeneratorGenerator<TSettings extends ITSGeneratorSettings = ITSGeneratorSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends MyTSProjectGenerator.Create(TSGeneratorGenerator, require.resolve("@manuth/generator-ts-project"))<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `MyTSGeneratorGenerator` class.
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
