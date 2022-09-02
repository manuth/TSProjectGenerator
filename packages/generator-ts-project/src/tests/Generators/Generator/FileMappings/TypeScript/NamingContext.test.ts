import { strictEqual } from "node:assert";
import upath from "upath";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext.js";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator.js";
import { TestContext } from "../../../../TestContext.js";

const { join, normalize } = upath;

/**
 * Registers tests for the {@link NamingContext `NamingContext`} class.
 *
 * @param context
 * The test-context.
 */
export function NamingContextTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(NamingContext),
        () =>
        {
            /**
             * Provides an implementation of the {@link NamingContext `NamingContext`} class for testing.
             */
            class TestNamingContext extends NamingContext
            {
                /**
                 * @inheritdoc
                 */
                public override get SourceRoot(): string
                {
                    return super.SourceRoot;
                }

                /**
                 * @inheritdoc
                 */
                public override get GeneratorName(): string
                {
                    return super.GeneratorName;
                }

                /**
                 * @inheritdoc
                 */
                public override get GeneratorDirName(): string
                {
                    return super.GeneratorDirName;
                }

                /**
                 * @inheritdoc
                 */
                public override get TestDirName(): string
                {
                    return super.TestDirName;
                }

                /**
                 * @inheritdoc
                 */
                public override get GeneratorTestDirName(): string
                {
                    return super.GeneratorTestDirName;
                }
            }

            let generator: TSGeneratorGenerator;
            let id: string;
            let displayName: string;
            let sourceRoot: string;
            let namingContext: TestNamingContext;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    id = "theme";
                    displayName = "This is a test";
                    sourceRoot = generator.SourceRoot;
                    namingContext = new TestNamingContext(id, displayName, generator.SourceRoot);
                });

            suite(
                nameof<TestNamingContext>((context) => context.GeneratorID),
                () =>
                {
                    test(
                        "Checking whether the chosen generator-id is returned…",
                        () =>
                        {
                            strictEqual(namingContext.GeneratorID, id);
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.SourceRoot),
                () =>
                {
                    test(
                        "Checking whether the chosen source-root is returned…",
                        () =>
                        {
                            strictEqual(namingContext.SourceRoot, sourceRoot);
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.GeneratorDirName),
                () =>
                {
                    test(
                        "Checking whether the directory-name for the generator-source is determined correctly…",
                        () =>
                        {
                            strictEqual(normalize(namingContext.GeneratorDirName), normalize(join(sourceRoot, "generators", namingContext.GeneratorID)));
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.GeneratorIndexFileName),
                () =>
                {
                    test(
                        "Checking whether the path to the index-file of the generator is determined correctly…",
                        () =>
                        {
                            strictEqual(
                                normalize(namingContext.GeneratorIndexFileName),
                                normalize(join(namingContext.GeneratorDirName, "index.ts")));
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.GeneratorName),
                () =>
                {
                    test(
                        "Checking whether the name of the generator is determined correctly…",
                        () =>
                        {
                            strictEqual(namingContext.GeneratorName, "Theme");
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.GeneratorClassName),
                () =>
                {
                    test(
                        "Checking whether the class-name of the generator is determined correctly…",
                        () =>
                        {
                            strictEqual(namingContext.GeneratorClassName, `${namingContext.GeneratorName}Generator`);
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.GeneratorDisplayName),
                () =>
                {
                    test(
                        "Checking whether the passed display-name is returned…",
                        () =>
                        {
                            strictEqual(namingContext.GeneratorDisplayName, displayName);
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.GeneratorClassFileName),
                () =>
                {
                    test(
                        "Checking whether the file-name of the generator-class is determined correctly…",
                        () =>
                        {
                            strictEqual(
                                normalize(namingContext.GeneratorClassFileName),
                                normalize(join(namingContext.GeneratorDirName, `${namingContext.GeneratorClassName}.ts`)));
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.LicenseTypeFileName),
                () =>
                {
                    test(
                        "Checking whether the file-name of the license-type enum is determined correctly…",
                        () =>
                        {
                            strictEqual(
                                normalize(namingContext.LicenseTypeFileName),
                                normalize(join(namingContext.GeneratorDirName, `${namingContext.LicenseTypeEnumName}.ts`)));
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.SettingKeyEnumName),
                () =>
                {
                    test(
                        "Checking whether the name of the setting-key enumeration is determined correctly…",
                        () =>
                        {
                            strictEqual(namingContext.SettingKeyEnumName, `${namingContext.GeneratorName}SettingKey`);
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.SettingKeyFileName),
                () =>
                {
                    test(
                        "Checking whether the name of the setting-key file is determined correctly…",
                        () =>
                        {
                            strictEqual(
                                normalize(namingContext.SettingKeyFileName),
                                normalize(join(namingContext.GeneratorDirName, `${namingContext.SettingKeyEnumName}.ts`)));
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.SettingsInterfaceName),
                () =>
                {
                    test(
                        "Checking whether the name of the settings-interface is determined correctly…",
                        () =>
                        {
                            strictEqual(namingContext.SettingsInterfaceName, `I${namingContext.GeneratorName}Settings`);
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.SettingsInterfaceFileName),
                () =>
                {
                    test(
                        "Checking whether the name of the settings-interface file is determined correctly…",
                        () =>
                        {
                            strictEqual(
                                normalize(namingContext.SettingsInterfaceFileName),
                                normalize(join(namingContext.GeneratorDirName, `${namingContext.SettingsInterfaceName}.ts`)));
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.TestDirName),
                () =>
                {
                    test(
                        "Checking whether the name of the test-directory is determined correctly…",
                        () =>
                        {
                            strictEqual(
                                normalize(namingContext.TestDirName),
                                normalize(join(sourceRoot, "tests")));
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.MainSuiteFileName),
                () =>
                {
                    test(
                        "Checking whether the name of the main test-file is determined correctly…",
                        () =>
                        {
                            strictEqual(
                                normalize(namingContext.MainSuiteFileName),
                                normalize(join(namingContext.TestDirName, "main.test.ts")));
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.GeneratorTestDirName),
                () =>
                {
                    test(
                        "Checking whether the name of the directory for storing generator-tests is determined correctly…",
                        () =>
                        {
                            strictEqual(
                                normalize(namingContext.GeneratorTestDirName),
                                normalize(join(namingContext.TestDirName, "Generators")));
                        });
                });

            suite(
                nameof<TestNamingContext>((context) => context.GeneratorTestFileName),
                () =>
                {
                    test(
                        "Checking whether the name of the generator-test file is determined correctly…",
                        () =>
                        {
                            strictEqual(
                                normalize(namingContext.GeneratorTestFileName),
                                normalize(join(namingContext.GeneratorTestDirName, `${namingContext.GeneratorClassName}.test.ts`)));
                        });
                });
        });
}
