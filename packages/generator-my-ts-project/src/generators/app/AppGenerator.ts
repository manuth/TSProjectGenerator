import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { AppGenerator as AppGeneratorBase, IProjectType, ProjectType } from "@manuth/generator-ts-project";
import { join } from "upath";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 */
export class AppGenerator extends AppGeneratorBase
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
    public constructor(args: string | string[], options: GeneratorOptions)
    {
        super(args, options);
    }

    /**
     * @inheritdoc
     */
    protected override get ProjectTypes(): Map<ProjectType, IProjectType>
    {
        return new Map<ProjectType, IProjectType>(
            [
                [
                    ProjectType.Module,
                    {
                        DisplayName: "NPM-Module",
                        Path: join(__dirname, "..", "module")
                    }
                ],
                [
                    ProjectType.Generator,
                    {
                        DisplayName: "Yeoman-Generator",
                        Path: join(__dirname, "..", "generator")
                    }
                ]
            ]);
    }

    /**
     * @inheritdoc
     */
    public override async initializing(): Promise<void>
    {
        return super.initializing();
    }
}
