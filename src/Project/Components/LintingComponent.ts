import { Question, Component, IGenerator, IFileMapping } from "@manuth/extended-yo-generator";
import { ComponentBase } from "../../Components/ComponentBase";
import { ESLintRCFileMapping } from "../../Linting/FileMappings/ESLintRCFileMapping";
import { ITSProjectSettings } from "../ITSProjectSettings";
import { ProjectLintingQuestion } from "../Inquiry/ProjectLintingQuestion";
import { TSProjectComponent } from "../TSProjectComponent";

/**
 * Provides a component which allows creating files for linting the workspace.
 */
export class LintingComponent<T extends ITSProjectSettings> extends ComponentBase<T>
{
    /**
     * Initializes a new instance of the `LintingComponent<T>` class.
     */
    public constructor()
    {
        super();
    }

    /**
     * @inheritdoc
     */
    public get ID(): string
    {
        return TSProjectComponent.Linting;
    }

    /**
     * @inheritdoc
     */
    public get DisplayName(): string
    {
        return "ESLint configurations";
    }

    /**
     * @inheritdoc
     */
    public get DefaultEnabled(): boolean
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    public get Questions(): Array<Question<T>>
    {
        return [
            new ProjectLintingQuestion()
        ];
    }

    /**
     * @inheritdoc
     *
     * @param component
     * The resolved representation of this component.
     *
     * @param generator
     * The generator of this component
     *
     * @returns
     * The file-mappings of this component.
     */
    public async FileMappings(component: Component<T>, generator: IGenerator<T>): Promise<Array<IFileMapping<T>>>
    {
        return [
            new ESLintRCFileMapping(),
            {
                Source: generator.modulePath("tsconfig.eslint.json"),
                Destination: "tsconfig.eslint.json"
            }
        ];
    }
}
