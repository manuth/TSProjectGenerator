import { GeneratorOptions, Generator } from "@manuth/extended-yo-generator";
import { ITSProjectSettings, TSModuleGenerator as TSModuleGeneratorBase } from "@manuth/generator-ts-project";

/**
 * Provides the functionality to generate a module written in TypeScript.
 */
export class TSModuleGenerator<TSettings extends ITSProjectSettings = ITSProjectSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends Generator.ComposeWith(TSModuleGeneratorBase, require.resolve("@manuth/generator-ts-project"))
{
    /**
     * The base of this generator.
     */
    private base: TSModuleGeneratorBase<TSettings, TOptions>;

    /**
     * Initializes a new instance of the `TSModuleGenerator` class.
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
    public async prompting(): Promise<void>
    {
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
    public async cleanup(): Promise<void>
    {
        return super.cleanup();
    }

    /**
     * @inheritdoc
     */
    public async end(): Promise<void>
    {
        return super.end();
    }
}
