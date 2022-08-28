import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TempFileSystem } from "@manuth/temp-files";
import { CompilerNodeToWrappedType, createWrappedNode, Expression, ExpressionStatement, printNode, Project, SourceFile, ts } from "ts-morph";
import { DumpCreatorFileMapping } from "./DumpCreatorFileMapping.js";
import { IDumper } from "./Transformation/Conversion/IDumper.js";
import { TypeScriptConverter } from "./Transformation/Conversion/TypeScriptConverter.js";

/**
 * Provides the functionality to create typescript-files.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class TypeScriptCreatorMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends DumpCreatorFileMapping<TSettings, TOptions, SourceFile>
{
    /**
     * The cached projects of this mapping.
     */
    private projects: Project[] = [];

    /**
     * Initializes a new instance of the {@link TypeScriptCreatorMapping `TypeScriptCreatorMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     *
     * @param sourceFile
     * The sourceFile to write to the file.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, sourceFile?: SourceFile)
    {
        super(generator, null, sourceFile);
    }

    /**
     * @inheritdoc
     */
    public abstract override get Destination(): string;

    /**
     * @inheritdoc
     */
    public get Converter(): TypeScriptConverter
    {
        return new TypeScriptConverter(this.Resolved.Destination);
    }

    /**
     * @inheritdoc
     */
    public get Dumper(): IDumper<SourceFile>
    {
        return new TypeScriptConverter(this.Resolved.Destination);
    }

    /**
     * Gets the cached projects of this mapping.
     */
    protected get Projects(): Project[]
    {
        return this.projects;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The source-file to dump.
     */
    public override async GetSourceObject(): Promise<SourceFile>
    {
        let result = await super.GetSourceObject();

        return result ??
            new Project().createSourceFile(this.Resolved.Destination, null, { overwrite: true });
    }

    /**
     * @inheritdoc
     */
    public override async Processor(): Promise<void>
    {
        let data = await this.GetOutputObject();
        let result = this.WriteOutput(this.Dump(data));
        data.forget();
        return result;
    }

    /**
     * Processes the specified {@link sourceFile `sourceFile`}.
     *
     * @param sourceFile
     * The source-file to process.
     *
     * @returns
     * The processed data.
     */
    protected override async Transform(sourceFile: SourceFile): Promise<SourceFile>
    {
        let result = await super.Transform(sourceFile);
        this.Dispose();
        return result;
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
    protected WrapNode<TNode extends ts.Node>(node: TNode): CompilerNodeToWrappedType<TNode>
    {
        if (!node.getSourceFile())
        {
            let project = new Project();
            let file = project.createSourceFile(TempFileSystem.TempName(), null, { overwrite: true });
            this.projects.push(project);
            file.addStatements(printNode(node));
            let result = file.getFirstDescendantByKind(node.kind) as CompilerNodeToWrappedType<TNode>;
            result.formatText(this.Converter.FormatSettings);
            return result;
        }
        else
        {
            return createWrappedNode(node);
        }
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
    protected WrapExpression<TExpression extends Expression>(expression: TExpression): ExpressionStatement
    {
        let result = this.WrapNode(ts.factory.createExpressionStatement(ts.factory.createStringLiteral("")));
        result.setExpression(expression.getFullText());
        return result;
    }

    /**
     * Releases all resources used by this file-mapping.
     */
    protected Dispose(): void
    {
        for (let project of this.Projects)
        {
            for (let file of project.getSourceFiles())
            {
                file.forget();
            }
        }
    }
}
