import { Generator } from "@manuth/extended-yo-generator";
import { TestContext as GeneratorContext } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";

/**
 * Represents a context for testing.
 */
export class TestContext<TGenerator extends Generator<any, TOptions>, TOptions extends Record<string, any> = Record<string, any>> extends GeneratorContext<TGenerator, TOptions>
{
    /**
     * A component for creating random literals.
     */
    private random: Random = new Random();

    /**
     * A context for testing generators.
     */
    private generatorContext: GeneratorContext<TGenerator, TOptions>;

    /**
     * Initializes a new instance of the `TestContext` class.
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
     * Gets a component for creating random literals.
     */
    public get Random(): Random
    {
        return this.random;
    }

    /**
     * Gets a random value.
     */
    public get RandomString(): string
    {
        return this.Random.string(10);
    }

    /**
     * Gets a random object.
     */
    public get RandomObject(): any
    {
        return {
            randomValue: this.RandomString
        };
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
    public get Generator(): Promise<TGenerator>
    {
        return this.GeneratorContext.Generator;
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
     * A normal workspace-folder directive or a named workspace-folder directive if `name` is passed.
     */
    public GetWorkspaceFolderDirective(name?: string): string
    {
        return `\${workspaceFolder${name ? `:${name}` : ""}}`;
    }
}
