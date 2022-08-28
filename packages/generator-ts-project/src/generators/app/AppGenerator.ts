import { fileURLToPath } from "url";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import upath from "upath";
import { GeneratorName } from "../../Core/GeneratorName.js";
import { IProjectType } from "./IProjectType.js";
import { ProjectType } from "./ProjectType.js";
import { ProjectTypeSelector } from "./ProjectTypeSelector.js";

const { join } = upath;

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
        let dirName = fileURLToPath(new URL(".", import.meta.url));

        return new Map<ProjectType, IProjectType>(
            [
                [
                    ProjectType.Module,
                    {
                        DisplayName: "NPM-Module",
                        Path: join(dirName, "..", GeneratorName.Module)
                    }
                ],
                [
                    ProjectType.Generator,
                    {
                        DisplayName: "Yeoman-Generator",
                        Path: join(dirName, "..", GeneratorName.Generator)
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
