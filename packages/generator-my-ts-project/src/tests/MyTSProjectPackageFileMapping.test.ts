import { ok } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester, TestContext } from "@manuth/extended-yo-generator-test";
import { IScriptMapping, ITSProjectSettings } from "@manuth/generator-ts-project";
import { Package } from "@manuth/package-json-editor";
import { MyTSModuleGenerator } from "../generators/module/MyTSModuleGenerator";
import { MyTSProjectPackageFileMapping } from "../MyTSProjectPackageFileMapping";

/**
 * Registers tests for the {@link MyTSProjectPackageFileMapping `MyTSProjectPackageFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function MyTSProjectPackageFileMappingTests(context: TestContext<MyTSModuleGenerator>): void
{
    suite(
        nameof(MyTSProjectPackageFileMapping),
        () =>
        {
            let generator: MyTSModuleGenerator;
            let tester: FileMappingTester<MyTSModuleGenerator, ITSProjectSettings, GeneratorOptions, MyTSProjectPackageFileMapping<ITSProjectSettings, GeneratorOptions>>;
            let npmPackage: Package;

            /**
             * Provides an implementation of the {@link MyTSProjectPackageFileMapping `MyTSProjectPackageFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestMyTSProjectPackageFileMapping extends MyTSProjectPackageFileMapping<ITSProjectSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 */
                public override get MiscScripts(): Array<IScriptMapping<ITSProjectSettings, GeneratorOptions> | string>
                {
                    return super.MiscScripts;
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
                    tester = new FileMappingTester(generator, new MyTSProjectPackageFileMapping(generator));
                });

            setup(
                async () =>
                {
                    await tester.Run();
                    npmPackage = new Package(tester.FileMapping.Destination);
                });

            suite(
                nameof<TestMyTSProjectPackageFileMapping>((fileMapping) => fileMapping.MiscScripts),
                () =>
                {
                    test(
                        "Checking whether all scripts for using `ts-patch` are present…",
                        () =>
                        {
                            let prepareScriptName = "prepare";
                            let patchScriptName = "patchTypeScript";

                            ok(npmPackage.Scripts.Get(prepareScriptName).includes(patchScriptName));
                            ok(npmPackage.Scripts.Has(patchScriptName));
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
                                "@types/ts-nameof",
                                "ts-nameof",
                                "ts-patch"
                            ];
                        });

                    test(
                        "Checking whether all required dependencies for using `ts-nameof` are present…",
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
