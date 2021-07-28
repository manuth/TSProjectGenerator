import { ComponentCollection, FileMappingCollectionEditor, GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITSProjectSettings, TSModuleGenerator } from "@manuth/generator-ts-project";
import { MyTSProjectGenerator } from "../../MyTSProjectGenerator";

/**
 * Provides the functionality to generate a module written in TypeScript.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class MyTSModuleGenerator<TSettings extends ITSProjectSettings = ITSProjectSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends MyTSProjectGenerator.Create(TSModuleGenerator, require.resolve("@manuth/generator-ts-project"))<TSettings, TOptions>
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
    public override get BaseComponents(): ComponentCollection<any, any>
    {
        return super.BaseComponents;
    }

    /**
     * @inheritdoc
     */
    public override get BaseFileMappings(): FileMappingCollectionEditor
    {
        return super.BaseFileMappings;
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
