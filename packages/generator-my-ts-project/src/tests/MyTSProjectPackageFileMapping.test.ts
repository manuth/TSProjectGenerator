import { ok, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester, TestContext } from "@manuth/extended-yo-generator-test";
import { ITSProjectSettings, TSProjectPackageFileMapping } from "@manuth/generator-ts-project";
import { Package } from "@manuth/package-json-editor";
import { MyTSProjectPackageFileMapping } from "../MyTSProjectPackageFileMapping.js";
import { TestTSModuleGenerator } from "./TestTSModuleGenerator.js";

/**
 * Registers tests for the {@link MyTSProjectPackageFileMapping `MyTSProjectPackageFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function MyTSProjectPackageFileMappingTests(context: TestContext<TestTSModuleGenerator>): void
{
    suite(
        nameof(MyTSProjectPackageFileMapping),
        () =>
        {
            let transformPlugin = "ts-nameof";
            let patchPackageName = "ts-patch";
            let generator: TestTSModuleGenerator;
            let tester: FileMappingTester<TestTSModuleGenerator, ITSProjectSettings, GeneratorOptions, TestMyTSProjectPackageFileMapping>;
            let npmPackage: Package;

            /**
             * Provides an implementation of the {@link MyTSProjectPackageFileMapping `MyTSProjectPackageFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestMyTSProjectPackageFileMapping extends MyTSProjectPackageFileMapping<ITSProjectSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 */
                public override get Base(): TSProjectPackageFileMapping<ITSProjectSettings, GeneratorOptions>
                {
                    return super.Base;
                }

                /**
                 * @inheritdoc
                 *
                 * @returns
                 * The loaded package.
                 */
                public override async LoadPackage(): Promise<Package>
                {
                    return super.LoadPackage();
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    tester = new FileMappingTester(generator, new TestMyTSProjectPackageFileMapping(generator, new TSProjectPackageFileMapping(generator.Base)));
                });

            setup(
                async () =>
                {
                    await tester.Run();
                    npmPackage = new Package(tester.FileMapping.Destination);
                });

            suite(
                "General",
                () =>
                {
                    test(
                        "Checking whether all scripts from the base file-mapping are included…",
                        () =>
                        {
                            ok(
                                tester.FileMappingOptions.Base.ScriptMappingCollection.Items.every(
                                    (scriptMapping) =>
                                    {
                                        return tester.FileMappingOptions.ScriptMappingCollection.Items.some(
                                            (script) =>
                                            {
                                                return script.Destination === scriptMapping.Destination;
                                            });
                                    }));
                        });
                });

            suite(
                nameof<TestMyTSProjectPackageFileMapping>((fileMapping) => fileMapping.MiscScripts),
                () =>
                {
                    test(
                        `Checking whether all scripts for using \`${patchPackageName}\` are present…`,
                        () =>
                        {
                            let prepareScriptName = "prepare";
                            let patchScriptName = "patch-ts";

                            ok(npmPackage.Scripts.Get(prepareScriptName).includes(patchScriptName));
                            strictEqual(npmPackage.Scripts.Get(patchScriptName), "ts-patch install");
                        });
                });

            suite(
                nameof<TestMyTSProjectPackageFileMapping>((fileMapping) => fileMapping.LoadPackage),
                () =>
                {
                    let dependencies: string[];

                    suiteSetup(
                        () =>
                        {
                            dependencies = [
                                `@types/${transformPlugin}`,
                                transformPlugin,
                                patchPackageName
                            ];
                        });

                    test(
                        `Checking whether all required dependencies for using \`${transformPlugin}\` are present…`,
                        () =>
                        {
                            for (let dependency of dependencies)
                            {
                                ok(npmPackage.AllDependencies.Has(dependency));
                            }
                        });
                });
        });
}
