import { Generator, GeneratorOptions, Question } from "@manuth/extended-yo-generator";
import { IProjectType } from "./IProjectType.js";
import { IProjectSelectorSettings } from "./Settings/IProjectSelectorSettings.js";
import { ProjectSelectorSettingKey } from "./Settings/ProjectSelectorSettingKey.js";

/**
 * Provides the functionality to choose from a set of generators.
 *
 * @template T
 * The type of the project-names.
 */
export abstract class ProjectTypeSelector<T extends string | number> extends Generator<IProjectSelectorSettings<T>>
{
    /**
     * Initializes a new instance of the {@link ProjectTypeSelector `ProjectTypeSelector<T>`} class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: GeneratorOptions)
    {
        super(
            args,
            {
                ...options,
                customPriorities: [
                    ...(options.customPriorities as any[] ?? []),
                    {
                        before: "initializing",
                        priorityName: "projectTypeSelection"
                    }
                ]
            });
    }

    /**
     * Gets the types of the projects to select from.
     */
    protected abstract get ProjectTypes(): Map<T, IProjectType>;

    /**
     * Gets the default project-type.
     */
    protected abstract get DefaultType(): T;

    /**
     * @inheritdoc
     */
    public override get Questions(): Array<Question<IProjectSelectorSettings<T>>>
    {
        return [
            {
                type: "list",
                name: ProjectSelectorSettingKey.ProjectType,
                message: "Please choose the type of project you want to create.",
                choices: Array.from(this.ProjectTypes.entries()).map(
                    (entry) => (
                        {
                            name: entry[1].DisplayName,
                            value: entry[0]
                        }))
            }
        ];
    }

    /**
     * @inheritdoc
     */
    public async projectTypeSelection(): Promise<void>
    {
        await this.prompting();
        return this.LoadGenerator(this.Settings[ProjectSelectorSettingKey.ProjectType]);
    }

    /**
     * Loads the proper generator according to the specified {@link projectType `projectType`}.
     *
     * @param projectType
     * The type of the project to load.
     */
    protected async LoadGenerator(projectType: T): Promise<void>
    {
        if (!this.ProjectTypes.has(projectType))
        {
            projectType = this.DefaultType;
        }

        await (this.composeWith(this.ProjectTypes.get(projectType).Path, this.options) as any);
    }
}
