import { FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { createStringLiteral, Node, TransformerFactory, Visitor, visitNode, visitEachChild, SyntaxKind, isExpressionStatement, isBinaryExpression, isPropertyAccessExpression, isPropertyAssignment, isIdentifier, isArrayLiteralExpression, isStringLiteral, SourceFile } from "typescript";
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
     */
    public constructor()
    {
        super();
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
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @returns
     * The source of the file-mapping.
     */
    public async Source(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return generator.modulePath(".eslintrc.js");
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @returns
     * The destination of the file-mapping.
     */
    public async Destination(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return ".eslintrc.js";
    }

    /**
     * Gets a component for transforming the `.eslintrc.js` file.
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @returns
     * A component for transforming the `.eslintrc.js` file.
     */
    protected async GetTransformers(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<Array<TransformerFactory<SourceFile>>>
    {
        let preset: string;

        switch (generator.Settings[TSProjectSettingKey.LintRuleset])
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
                        (node.expression.left.getText() === "module.exports"))
                    {
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
    }
}
