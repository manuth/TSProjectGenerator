import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { join } from "upath";
import { GeneratorName } from "../../Core/GeneratorName";
import { IProjectType } from "./IProjectType";
import { ProjectType } from "./ProjectType";
import { ProjectTypeSelector } from "./ProjectTypeSelector";

/**
 * Provides the functionality to generate typescript-projects.
 */
export class AppGenerator extends ProjectTypeSelector<ProjectType>
{
    /**
     * Initializes a new instance of the {@link AppGenerator `AppGenerator`} class.
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
    protected get ProjectTypes(): Map<ProjectType, IProjectType>
    {
        return new Map<ProjectType, IProjectType>(
            [
                [
                    ProjectType.Module,
                    {
                        DisplayName: "NPM-Module",
                        Path: join(__dirname, "..", GeneratorName.Module)
                    }
                ],
                [
                    ProjectType.Generator,
                    {
                        DisplayName: "Yeoman-Generator",
                        Path: join(__dirname, "..", GeneratorName.Generator)
                    }
                ]
            ]);
    }

    /**
     * @inheritdoc
     */
    protected get DefaultType(): ProjectType
    {
        return ProjectType.Module;
    }

    /**
     * @inheritdoc
     */
    public override async projectTypeSelection(): Promise<void>
    {
        return super.projectTypeSelection();
    }
}
