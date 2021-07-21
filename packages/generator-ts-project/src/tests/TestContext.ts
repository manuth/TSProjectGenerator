import { Generator } from "@manuth/extended-yo-generator";
import { TestContext as GeneratorContext } from "@manuth/extended-yo-generator-test";
import { TasksProcessor } from "../VSCode/TasksProcessor";

/**
 * Represents a context for testing.
 *
 * @template TGenerator
 * The type of the generator to test.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TestContext<TGenerator extends Generator<any, TOptions>, TOptions extends Record<string, any> = Record<string, any>> extends GeneratorContext<TGenerator, TOptions>
{
    /**
     * A context for testing generators.
     */
    private generatorContext: GeneratorContext<TGenerator, TOptions>;

    /**
     * A component for processing tasks.
     */
    private tasksProcessor: TasksProcessor<any, any>;

    /**
     * Initializes a new instance of the {@link TestContext `TestContext<TGenerator, TOptions>`} class.
     *
     * @param generatorContext
     * A context for testing generators.
     */
    public constructor(generatorContext: GeneratorContext<TGenerator, TOptions>)
    {
        super(generatorContext.GeneratorDirectory);
        this.generatorContext = generatorContext;
    }

    /**
     * Gets a context for testing generators.
     */
    public get GeneratorContext(): GeneratorContext<TGenerator, TOptions>
    {
        return this.generatorContext;
    }

    /**
     * @inheritdoc
     */
    public override get Generator(): Promise<TGenerator>
    {
        return this.GeneratorContext.Generator;
    }

    /**
     * Gets a component for processing tasks.
     */
    protected get TasksProcessor(): TasksProcessor<any, any>
    {
        if (this.tasksProcessor === null)
        {
            this.tasksProcessor = new TasksProcessor(null);
        }

        return this.tasksProcessor;
    }

    /**
     * Gets a workspace-folder directive.
     */
    public get WorkspaceFolderDirective(): string
    {
        return this.GetWorkspaceFolderDirective();
    }

    /**
     * Gets a named workspace-folder directive.
     */
    public get NamedWorkspaceFolderDirective(): string
    {
        return this.GetWorkspaceFolderDirective("Test");
    }

    /**
     * Creates a workspace-folder directive.
     *
     * @param name
     * The name of the workspace-folder.
     *
     * @returns
     * A normal workspace-folder directive or a named workspace-folder directive if a {@link name `name`} is passed.
     */
    public GetWorkspaceFolderDirective(name?: string): string
    {
        return this.TasksProcessor.GetWorkspaceFolderDirective(name);
    }
}
