import { TempFileSystem } from "@manuth/temp-files";
import { CompilerNodeToWrappedType, Expression, ExpressionStatement, FormatCodeSettings, printNode, Project, SourceFile, ts } from "ts-morph";
import { TextConverter } from "./TextConverter";

/**
 * Provides the functionality to parse and dump `.ts`-code.
 */
export class TypeScriptConverter extends TextConverter<SourceFile>
{
    /**
     * The path the resulting code is supposed to be saved to.
     */
    private destinationPath: string;

    /**
     * The settings for formatting the code.
     */
    private formatSettings: FormatCodeSettings;

    /**
     * Initializes a new instance of the {@link TypeScriptConverter `TypeScriptConverter`} class.
     *
     * @param destinationPath
     * The path the resulting code is supposed to be saved to.
     */
    public constructor(destinationPath?: string)
    {
        super();

        this.destinationPath = destinationPath;

        this.formatSettings = {
            convertTabsToSpaces: true,
            ensureNewLineAtEndOfFile: true,
            indentSize: 4,
            insertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
            placeOpenBraceOnNewLineForControlBlocks: true,
            placeOpenBraceOnNewLineForFunctions: true,
            tabSize: 4,
            trimTrailingWhitespace: true
        };
    }

    /**
     * Gets or sets the path the resulting code is supposed to be saved to.
     */
    public get DestinationPath(): string
    {
        return this.destinationPath;
    }

    /**
     * @inheritdoc
     */
    public set DestinationPath(value: string)
    {
        this.destinationPath = value;
    }

    /**
     * Gets or sets the settings for formatting the code.
     */
    public get FormatSettings(): FormatCodeSettings
    {
        return this.formatSettings;
    }

    /**
     * @inheritdoc
     */
    public set FormatSettings(value: FormatCodeSettings)
    {
        this.formatSettings = value;
    }

    /**
     * @inheritdoc
     *
     * @param text
     * The text to parse.
     *
     * @returns
     * The parsed representation of the specified {@link text `text`}.
     */
    public Parse(text: string): SourceFile
    {
        return new Project().createSourceFile(
            this.DestinationPath ?? TempFileSystem.TempName(),
            text,
            {
                overwrite: true
            });
    }

    /**
     * Dumps the specified {@link sourceFile `sourceFile`}.
     *
     * @param sourceFile
     * The source-file to dump.
     *
     * @returns
     * A {@link String `string`} representing the specified {@link sourceFile `sourceFile`}.
     */
    public Dump(sourceFile: SourceFile): string
    {
        sourceFile.formatText(this.FormatSettings);
        return sourceFile.getFullText();
    }

    /**
     * Wraps the specified {@link node `node`} in a file.
     *
     * @template TNode
     * The type of the node to wrap.
     *
     * @param node
     * The node to wrap into a file.
     *
     * @returns
     * The wrapped node.
     */
    public WrapNode<TNode extends ts.Node>(node: TNode): CompilerNodeToWrappedType<TNode>
    {
        let file = new Project().createSourceFile(TempFileSystem.TempName(), null, { overwrite: true });
        file.addStatements(printNode(node));
        let result = file.getFirstDescendantByKind(node.kind) as CompilerNodeToWrappedType<TNode>;
        result.formatText(this.FormatSettings);
        return result;
    }

    /**
     * Wraps the specified {@link expression `expression`} into an {@link ExpressionStatement `ExpressionStatement`}.
     *
     * @template TExpression
     * The type of the expression to wrap.
     *
     * @param expression
     * The expression to wrap into an {@link ExpressionStatement `ExpressionStatement`}.
     *
     * @returns
     * The wrapped {@link expression `expression`}.
     */
    public WrapExpression<TExpression extends Expression>(expression: TExpression): ExpressionStatement
    {
        let result = this.WrapNode(ts.factory.createExpressionStatement(ts.factory.createStringLiteral("")));
        result.setExpression(expression.getFullText());
        return result;
    }
}
