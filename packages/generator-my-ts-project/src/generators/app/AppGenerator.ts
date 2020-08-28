import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { AppGenerator as AppGeneratorBase, IAppGeneratorSettings, ProjectType, GeneratorLoader } from "@manuth/generator-ts-project";
import { join } from "upath";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 */
export class AppGenerator<TSettings extends IAppGeneratorSettings = IAppGeneratorSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends AppGeneratorBase<TSettings, TOptions>
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
    public constructor(args: string | string[], options: TOptions)
    {
        super(args, options);
    }

    /**
     * @inheritdoc
     */
    public async initializing(): Promise<void>
    {
        return super.initializing();
    }

    /**
     * @inheritdoc
     *
     * @param projectType
     * The type of the project to load.
     */
    protected LoadGenerator: GeneratorLoader = async (projectType) =>
    {
        switch (projectType)
        {
            case ProjectType.Module:
            default:
                this.composeWith(join(__dirname, "..", "module"), this.options);
        }
    };
}
