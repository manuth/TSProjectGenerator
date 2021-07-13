import { deepStrictEqual, ok } from "assert";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { MyTSModuleGenerator } from "../generators/module/MyTSModuleGenerator";
import type { MyTSProjectGenerator } from "../MyTSProjectGenerator";
import { TestTSModuleGenerator } from "./TestTSModuleGenerator";

/**
 * Registers tests for the {@link MyTSProjectGenerator `MyTSProjectGenerator<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function MyTSProjectGeneratorTests(context: TestContext<TestTSModuleGenerator>): void
{
    suite(
        nameof<MyTSProjectGenerator<any>>(),
        () =>
        {
            let transformPluginName = "ts-nameof";
            let tsconfigFileName = "tsconfig.base.json";
            let generator: TestTSModuleGenerator;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                });

            suite(
                nameof<MyTSModuleGenerator>((generator) => generator.FileMappings),
                () =>
                {
                    test(
                        `Checking whether the \`${transformPluginName}\`-plugin is configured in \`${tsconfigFileName}\`…`,
                        () =>
                        {
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                            let originalTSConfig = require(generator.Base.modulePath(tsconfigFileName));
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                            let tsConfig = require(generator.destinationPath(tsconfigFileName));

                            deepStrictEqual(originalTSConfig.compilerOptions.plugins, tsConfig.compilerOptions.plugins);
                            ok(tsConfig.compilerOptions.plugins.some((plugin: any) => plugin.transform === transformPluginName));
                        });
                });
        });
}
