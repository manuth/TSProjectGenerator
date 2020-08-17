import { GeneratorOptions, IComponentCollection, IFileMapping, Question, ComponentCollection, FileMapping } from "@manuth/extended-yo-generator";
import { ITSProjectSettings, TSModuleGenerator as TSModuleGeneratorBase } from "@manuth/generator-ts-project";
import { join } from "upath";

/**
 * Provides the functionality to generate a module written in TypeScript.
 */
export class TSModuleGenerator<TSettings extends ITSProjectSettings = ITSProjectSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends TSModuleGeneratorBase<TSettings, TOptions>
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
        this.base = this.env.create("@manuth/ts-project:module") as any;
    }

    /**
     * @inheritdoc
     */
    public get Settings(): TSettings
    {
        return this.base.Settings;
    }

    /**
     * @inheritdoc
     */
    public get Questions(): Array<Question<TSettings>>
    {
        return this.base.Questions;
    }

    /**
     * @inheritdoc
     */
    public get Components(): IComponentCollection<TSettings, TOptions>
    {
        return this.base.Components;
    }

    /**
     * @inheritdoc
     */
    public get ComponentCollection(): ComponentCollection<TSettings, TOptions>
    {
        return this.base.ComponentCollection;
    }

    /**
     * @inheritdoc
     */
    public get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        return this.base.FileMappings;
    }

    /**
     * @inheritdoc
     */
    public get FileMappingCollection(): Array<FileMapping<TSettings, TOptions>>
    {
        return this.base.FileMappingCollection;
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
