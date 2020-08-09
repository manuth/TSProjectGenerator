import { IGenerator } from "@manuth/extended-yo-generator";
import { createStringLiteral, Node, TransformerFactory, Visitor, visitNode, visitEachChild, SyntaxKind, isExpressionStatement, isBinaryExpression, isPropertyAccessExpression, isPropertyAssignment, isIdentifier, isArrayLiteralExpression, isStringLiteral, SourceFile, isObjectLiteralExpression, createObjectLiteral } from "typescript";
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
     * Gets a component for transforming the `.eslintrc.js` file.
     */
    protected get Transformers(): Promise<Array<TransformerFactory<SourceFile>>>
    {
        return (
            async (): Promise<Array<TransformerFactory<SourceFile>>> =>
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

                return [
                    (context) =>
                    {
                        let mainVisitor: Visitor;
                        let sourceFileVisitor: Visitor;
                        let exportObjectVisitor: Visitor;
                        let configBaseVisitor: Visitor;

                        mainVisitor = (node: SourceFile) =>
                        {
                            let result: Node;

                            if (node.kind === SyntaxKind.SourceFile)
                            {
                                result = visitEachChild(node, sourceFileVisitor, context);
                            }
                            else
                            {
                                result = node;
                            }

                            return result;
                        };

                        sourceFileVisitor = <TNode extends Node>(node: TNode) =>
                        {
                            if (
                                isExpressionStatement(node) &&
                                isBinaryExpression(node.expression) &&
                                isPropertyAccessExpression(node.expression.left) &&
                                (node.expression.left.getText() === "module.exports") &&
                                isObjectLiteralExpression(node.expression.right))
                            {
                                node.expression.right = createObjectLiteral(
                                    node.expression.right.properties.filter(
                                        (property) => property.name?.getText() !== "root"),
                                    true);

                                node.expression.right = visitEachChild(node.expression.right, exportObjectVisitor, context);
                            }

                            return node;
                        };

                        exportObjectVisitor = <TNode extends Node>(node: TNode) =>
                        {
                            if (
                                isPropertyAssignment(node) &&
                                isIdentifier(node.name) &&
                                (node.name.text === "extends") &&
                                isArrayLiteralExpression(node.initializer))
                            {
                                node.initializer = visitEachChild(node.initializer, configBaseVisitor, context);
                            }

                            return node;
                        };

                        configBaseVisitor = <TNode extends Node>(node: TNode) =>
                        {
                            if (
                                isStringLiteral(node) &&
                                node.text.startsWith(this.RulesetPrefix))
                            {
                                return createStringLiteral(`${this.RulesetPrefix}${preset}`);
                            }
                            else
                            {
                                return node;
                            }
                        };

                        return (node) =>
                        {
                            return visitNode(node, mainVisitor);
                        };
                    }
                ];
            })();
    }
}
