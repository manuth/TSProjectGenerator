import { strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { TSConfigFileMapping } from "../../../Components/Transformation/TSConfigFileMapping";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link TSConfigFileMapping<TSettings, TOptions> `TSConfigFileMapping<TSettings, TOptions>`} class.
 */
export function TSConfigFileMappingTests(): void
{
    suite(
        nameof(TSConfigFileMapping),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let defaultFileName: string;
            let sourceFile: TempFile;
            let fileMapping: TestTSConfigFileMapping;

            /**
             * Provides an implementation of the {@link TSConfigFileMapping<TSettings, TOptions> `TSConfigFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestTSConfigFileMapping extends TSConfigFileMapping<IGeneratorSettings, GeneratorOptions>
            {
                /**
                 * The middle file-extension of the output-file.
                 */
                private middleExtension: string;

                /**
                 * @inheritdoc
                 */
                public override get MiddleExtension(): string
                {
                    return this.middleExtension;
                }

                /**
                 * @inheritdoc
                 */
                public override set MiddleExtension(value: string)
                {
                    this.middleExtension = value;
                }

                /**
                 * @inheritdoc
                 */
                public override get Source(): string
                {
                    return sourceFile.FullName;
                }
            }

            suiteSetup(
                async function()
                {
                    defaultFileName = "tsconfig.json";
                    generator = await context.Generator;
                });

            setup(
                () =>
                {
                    sourceFile = new TempFile();
                    fileMapping = new TestTSConfigFileMapping(generator);
                });

            suite(
                nameof(TSConfigFileMapping.FileName),
                () =>
                {
                    test(
                        "Checking whether the proper file-name is returned…",
                        () =>
                        {
                            strictEqual(TSConfigFileMapping.FileName, defaultFileName);
                        });
                });

            suite(
                nameof<TSConfigFileMapping<any, any>>((fileMapping) => fileMapping.DefaultBaseName),
                () =>
                {
                    test(
                        "Checking whether the expected value is returned…",
                        () =>
                        {
                            strictEqual(fileMapping.DefaultBaseName, defaultFileName);
                        });
                });

            suite(
                nameof<TSConfigFileMapping<any, any>>((fileMapping) => fileMapping.BaseName),
                () =>
                {
                    test(
                        "Checking whether the base-name is generated as expected…",
                        () =>
                        {
                            fileMapping.MiddleExtension = null;
                            strictEqual(fileMapping.BaseName, defaultFileName);
                            fileMapping.MiddleExtension = "";
                            strictEqual(fileMapping.BaseName, defaultFileName);
                            fileMapping.MiddleExtension = "base";
                            strictEqual(fileMapping.BaseName, "tsconfig.base.json");
                        });
                });

            suite(
                nameof(TSConfigFileMapping.GetFileName),
                () =>
                {
                    test(
                        "Checking whether file-names can be generated as expected…",
                        () =>
                        {
                            strictEqual(TSConfigFileMapping.GetFileName(null, defaultFileName), defaultFileName);
                            strictEqual(TSConfigFileMapping.GetFileName("", defaultFileName), defaultFileName);
                            strictEqual(TSConfigFileMapping.GetFileName("base", defaultFileName), "tsconfig.base.json");
                        });
                });
        });
}
