import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITSProjectSettings, TSModuleGenerator } from "@manuth/generator-ts-project";
import { MyTSModuleGenerator } from "../generators/module/MyTSModuleGenerator";

/**
 * Provides an implementation of the {@link MyTSModuleGenerator `MyTSModuleGenerator<TSettings, TOptions>`} for testing.
 */
export class TestTSModuleGenerator<TSettings extends ITSProjectSettings = ITSProjectSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends MyTSModuleGenerator<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TestTSModuleGenerator `TestTSModuleGenerator<TSettings, TOptions>`} class.
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
    public override get Base(): TSModuleGenerator<TSettings, TOptions>
    {
        return super.Base as TSModuleGenerator<TSettings, TOptions>;
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
