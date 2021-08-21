import { doesNotThrow, ok, strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester } from "@manuth/extended-yo-generator-test";
import { SourceFile, SyntaxKind } from "ts-morph";
import { TSGeneratorGenerator } from "../../../../..";
import { GeneratorClassFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorClassFileMapping";
import { LicenseTypeFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/LicenseTypeFileMapping";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext";
import { SettingKeyFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/SettingKeyFileMapping";
import { SettingsInterfaceFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/SettingsInterfaceFileMapping";
import { TestContext } from "../../../../TestContext";

/**
 * Registers tests for the {@link SettingsInterfaceFileMapping `SettingsInterfaceFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function SettingsInterfaceFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(SettingsInterfaceFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link SettingsInterfaceFileMapping `SettingsInterfaceFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestSettingsInterfaceFileMapping extends SettingsInterfaceFileMapping<IGeneratorSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 *
                 * @param sourceFile
                 * The source-file to process.
                 *
                 * @returns
                 * The processed data.
                 */
                public override async Transform(sourceFile: SourceFile): Promise<SourceFile>
                {
                    return super.Transform(sourceFile);
                }
            }

            let generator: TSGeneratorGenerator;
            let namingContext: NamingContext;
            let fileMapping: TestSettingsInterfaceFileMapping;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot);
                    await new FileMappingTester(generator, new GeneratorClassFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new SettingKeyFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new SettingsInterfaceFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new LicenseTypeFileMapping(generator, namingContext)).Run();
                    fileMapping = new TestSettingsInterfaceFileMapping(generator, namingContext);
                });

            suite(
                nameof<TestSettingsInterfaceFileMapping>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<TestSettingsInterfaceFileMapping>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.SettingsInterfaceFileName);
                        });
                });

            suite(
                nameof<TestSettingsInterfaceFileMapping>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    let sourceFile: SourceFile;

                    suiteSetup(
                        async function()
                        {
                            this.timeout(10 * 1000);
                            sourceFile = await fileMapping.Transform(await fileMapping.GetSourceObject());
                        });

                    test(
                        "Checking whether an interface with the expected name is present…",
                        function()
                        {
                            this.timeout(30 * 1000);
                            this.slow(15 * 1000);
                            doesNotThrow(() => sourceFile.getExportedDeclarations().get(namingContext.SettingsInterfaceName)[0].asKindOrThrow(SyntaxKind.InterfaceDeclaration));
                        });

                    test(
                        "Checking whether all expected members are present in the interface…",
                        () =>
                        {
                            let interfaceDeclaration = sourceFile.getInterface(namingContext.SettingsInterfaceName);
                            let properties = interfaceDeclaration.getProperties();

                            for (
                                let member of [
                                    namingContext.DestinationMember,
                                    namingContext.NameMember,
                                    namingContext.DescriptionMember,
                                    namingContext.LicenseTypeMember
                                ])
                            {
                                ok(properties.some(
                                    (property) =>
                                    {
                                        let propertyName = property.getNodeProperty("name").asKind(
                                            SyntaxKind.ComputedPropertyName)?.getExpression().asKind(
                                                SyntaxKind.PropertyAccessExpression);

                                        return propertyName?.getExpression().getText() === namingContext.SettingKeyEnumName &&
                                            propertyName.getName() === member;
                                    }));
                            }
                        });
                });
        });
}
