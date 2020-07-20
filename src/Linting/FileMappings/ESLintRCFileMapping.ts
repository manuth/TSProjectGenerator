import { FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { diffLines, applyPatch, createPatch, structuredPatch, parsePatch } from "diff";
import { readFile } from "fs-extra";
import { transform, ScriptTarget, createStringLiteral, Node, TransformerFactory, Visitor, visitNode, visitEachChild, transpileModule, ModuleKind, SyntaxKind, isExpressionStatement, isBinaryExpression, isPropertyAccessExpression, isPropertyAssignment, isIdentifier, isArrayLiteralExpression, isStringLiteral, SourceFile, createSourceFile, ScriptKind, createPrinter } from "typescript";
import { FileMappingBase } from "../../Components/FileMappingBase";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { LintRuleset } from "../LintRuleset";
import { Transpiler } from "./Transpiler";

/**
 * Provides a file-mapping for the `.eslintrc.js` file.
 */
export class ESLintRCFileMapping<T extends ITSProjectSettings> extends FileMappingBase<T>
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
     * @inheritdoc
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public async Processor(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<void>
    {
        let transformCode: Transpiler<SourceFile> = (code, transformers) =>
        {
            let fileName = ".ts";

            let transformResult = transform(
                createSourceFile(fileName, code, ScriptTarget.Latest, true, ScriptKind.TS),
                transformers);

            return createPrinter().printFile(
                transformResult.transformed.find((transformedFile) => transformedFile.fileName === fileName));
        };

        let originalContent = (await readFile(await fileMapping.Source)).toString();
        let contentWithoutNewLines = transformCode(originalContent, []);
        let newContent = transformCode(originalContent, [this.GetTransformer(fileMapping, generator)]);

        let patch = parsePatch(
            createPatch(
                await fileMapping.Source,
                contentWithoutNewLines,
                originalContent,
                undefined,
                undefined,
                {
                    context: 1
                }
            ))[0];

        newContent = applyPatch(newContent, patch);
        generator.fs.write(await fileMapping.Destination, newContent);
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
    protected GetTransformer<TNode extends Node>(fileMapping: FileMapping<T>, generator: IGenerator<T>): TransformerFactory<TNode>
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

        return (context) =>
        {
            let mainVisitor: Visitor;
            let sourceFileVisitor: Visitor;
            let exportObjectVisitor: Visitor;
            let configBaseVisitor: Visitor;

            mainVisitor = (node: TNode) =>
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

            sourceFileVisitor = (node: TNode) =>
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

            exportObjectVisitor = (node: TNode) =>
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

            configBaseVisitor = (node: TNode) =>
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
        };
    }
}
