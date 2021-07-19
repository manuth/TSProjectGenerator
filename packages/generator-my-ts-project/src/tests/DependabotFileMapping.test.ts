import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { ITSProjectSettings } from "@manuth/generator-ts-project";
import { YAMLFileMappingTester } from "@manuth/generator-ts-project-test";
import { DependabotFileMapping } from "../DependabotFileMapping";
import { MyTSModuleGenerator } from "../generators/module/MyTSModuleGenerator";

/**
 * Registers tests for the {@link DependabotFileMapping `DependabotFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function DependabotFileMappingTests(context: TestContext<MyTSModuleGenerator>): void
{
    suite(
        nameof(DependabotFileMapping),
        () =>
        {
            let updateKey: string;
            let directoryKey: string;
            let generator: MyTSModuleGenerator;
            let fileMappingOptions: DependabotFileMapping<ITSProjectSettings, GeneratorOptions>;
            let tester: YAMLFileMappingTester<MyTSModuleGenerator, ITSProjectSettings, GeneratorOptions, DependabotFileMapping<ITSProjectSettings, GeneratorOptions>>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    updateKey = "updates";
                    directoryKey = "directory";
                    generator = await context.Generator;
                    fileMappingOptions = new DependabotFileMapping(generator);
                    tester = new YAMLFileMappingTester(generator, fileMappingOptions);
                });

            setup(
                async () =>
                {
                    await tester.Run();
                });

            suite(
                nameof<DependabotFileMapping<any, any>>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    test(
                        "Checking whether only one document is present inside the file…",
                        async () =>
                        {
                            strictEqual((await tester.ParseOutput()).length, 1);
                        });

                    test(
                        "Checking whether only one dependabot-configuration is present…",
                        async () =>
                        {
                            strictEqual((await tester.ParseOutput())[0].get(updateKey).toJSON().length, 1);
                        });

                    test(
                        "Checking whether the dependabot-configuration directory points to the root of the project…",
                        async () =>
                        {
                            strictEqual((await tester.ParseOutput())[0].getIn([updateKey, 0, directoryKey]), "/");
                        });
                });
        });
}
