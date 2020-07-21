import { Question, IGenerator, IFileMapping } from "@manuth/extended-yo-generator";
import { ComponentBase } from "../../Components/ComponentBase";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { ESLintRCFileMapping } from "../FileMappings/ESLintRCFileMapping";
import { LintingQuestion } from "../Inquiry/LintingQuestion";

/**
 * Provides a component which allows creating files for linting the workspace.
 */
export class LintingComponent<T extends ITSProjectSettings> extends ComponentBase<T>
{
    /**
     * Initializes a new instance of the `LintingComponent<T>` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
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
            new LintingQuestion()
        ];
    }

    /**
     * @inheritdoc
     */
    public get FileMappings(): Promise<Array<IFileMapping<T>>>
    {
        return (
            async () =>
            {
                return [
                    new ESLintRCFileMapping(this.Generator),
                    {
                        Source: this.Generator.modulePath("tsconfig.eslint.json"),
                        Destination: "tsconfig.eslint.json"
                    }
                ];
            })();
    }
}
