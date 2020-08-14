import { IGenerator } from "@manuth/extended-yo-generator";
import { SourceFile, ExportAssignment, Node } from "ts-morph";
import { TypeScriptTransformMapping } from "../../Components/Transformation/TypeScriptTransformMapping";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { LintRuleset } from "../LintRuleset";

/**
 * Provides a file-mapping for the `.eslintrc.js` file.
 */
export class ESLintRCFileMapping<T extends ITSProjectSettings> extends TypeScriptTransformMapping<T>
{
    /**
     * Initializes a new instance of the `ESLintRCFileMapping<T>` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * Gets the prefix of the rule-sets.
     */
    protected get RulesetPrefix(): string
    {
        return "plugin:@manuth/typescript/";
    }

    /**
     * @inheritdoc
     */
    public get Source(): Promise<string>
    {
        return (
            async () =>
            {
                return this.Generator.modulePath(".eslintrc.js");
            })();
    }

    /**
     * @inheritdoc
     */
    public get Destination(): Promise<string>
    {
        return (
            async () =>
            {
                return ".eslintrc.js";
            })();
    }

    /**
     * Processes the specified `data`.
     *
     * @param sourceFile
     * The source-file to process.
     *
     * @returns
     * The processed data.
     */
    protected async Transform(sourceFile: SourceFile): Promise<SourceFile>
    {
        let preset: string;

        switch (this.Generator.Settings[TSProjectSettingKey.LintRuleset])
        {
            case LintRuleset.Weak:
                preset = "weak-requiring-type-checking";
                break;
            case LintRuleset.Recommended:
            default:
                preset = "recommended-requiring-type-checking";
                break;
        }

        let statement = sourceFile.getStatements().find(
            (statement): statement is ExportAssignment =>
            {
                if (Node.isExpressionStatement(statement))
                {
                    let expression = statement.getExpression();

                    if (Node.isBinaryExpression(expression))
                    {
                        return expression.getLeft().getText() === "module.exports";
                    }
                }

                return false;
            });

        let expression = statement.getExpression();

        if (Node.isBinaryExpression(expression))
        {
            let right = expression.getRight();

            if (Node.isObjectLiteralExpression(right))
            {
                let extendsProperty = right.getProperty("extends");
                right.getProperty("root").remove();

                if (Node.isPropertyAssignment(extendsProperty))
                {
                    let extendsValue = extendsProperty.getInitializer();

                    if (Node.isArrayLiteralExpression(extendsValue))
                    {
                        for (let item of extendsValue.getElements())
                        {
                            if (
                                Node.isStringLiteral(item) &&
                                item.getLiteralValue().startsWith(this.RulesetPrefix))
                            {
                                item.setLiteralValue(preset);
                            }
                        }
                    }
                }
            }
        }

        return sourceFile;
    }
}
