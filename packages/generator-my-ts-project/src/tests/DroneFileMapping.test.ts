import { ok } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { ITSProjectSettings } from "@manuth/generator-ts-project";
import { YAMLFileMappingTester } from "@manuth/generator-ts-project-test";
import { DroneFileMapping } from "../DroneFileMapping";
import { MyTSModuleGenerator } from "../generators/module/MyTSModuleGenerator";

/**
 * Registers tests for the {@link DroneFileMapping `DroneFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function DroneFileMappingTests(context: TestContext<MyTSModuleGenerator>): void
{
    suite(
        nameof(DroneFileMapping),
        () =>
        {
            let generator: MyTSModuleGenerator;
            let fileMappingOptions: DroneFileMapping<ITSProjectSettings, GeneratorOptions>;
            let tester: YAMLFileMappingTester<MyTSModuleGenerator, ITSProjectSettings, GeneratorOptions, DroneFileMapping<ITSProjectSettings, GeneratorOptions>>;

            /**
             * Represents a condition for commands.
             */
            type CommandCondition = (command: string) => boolean;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    fileMappingOptions = new DroneFileMapping(generator);
                    tester = new YAMLFileMappingTester(generator, fileMappingOptions);
                });

            setup(
                async () =>
                {
                    await tester.Run();
                });

            /**
             * Asserts the truthiness of the specified {@link condition `condition`}.
             *
             * @param condition
             * The condition to assert.
             *
             * @param all
             * A value indicating whether the assertion should apply to all commands.
             *
             * @returns
             * A value indicating whether the assertion is true.
             */
            async function AssertCommand(condition: CommandCondition, all = false): Promise<boolean>
            {
                let documents = await tester.ParseOutput();
                let filter = <T>(array: T[]) => (condition: (item: T) => boolean) => (all ? array.every(condition) : array.some(condition));

                return filter(documents)(
                    (document) =>
                    {
                        let steps: any[] = document.toJSON().steps;

                        return filter(steps)(
                            (step) =>
                            {
                                let commands: string[] = step.commands;

                                return filter(commands)(
                                    (command) =>
                                    {
                                        return condition(command);
                                    });
                            });
                    });
            }

            suite(
                nameof<DroneFileMapping<any, any>>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    test(
                        "Checking whether `publish` commands are replaced correctly…",
                        async function()
                        {
                            this.timeout(2 * 1000);
                            this.slow(1 * 1000);
                            ok(await AssertCommand((command) => command.startsWith("npm publish")));
                            ok(await AssertCommand((command) => !command.startsWith("npx lerna publish"), true));
                        });

                    test(
                        "Checking whether `lerna exec` commands are replaced correctly…",
                        async function()
                        {
                            this.timeout(2 * 1000);
                            this.slow(1 * 1000);
                            ok(await AssertCommand((command) => !command.startsWith("npx lerna exec"), true));
                        });

                    test(
                        "Checking whether github-releases are adjusted correctly…",
                        async function()
                        {
                            this.timeout(2 * 1000);
                            this.slow(1 * 1000);

                            ok(
                                (await tester.ParseOutput()).every(
                                    (document) =>
                                    {
                                        let steps: any[] = document.toJSON().steps;

                                        return steps.every(
                                            (step) =>
                                            {
                                                if (step.image === "plugins/github-release")
                                                {
                                                    let files = step.settings.files;

                                                    return (files.length === 1) &&
                                                        (files[0] === "*.tgz");
                                                }
                                                else
                                                {
                                                    return true;
                                                }
                                            });
                                    }));
                        });

                    test(
                        "Checking whether the `test`-step is adjusted correctly…",
                        async function()
                        {
                            this.timeout(2 * 1000);
                            this.slow(1 * 1000);

                            ok(
                                (await tester.ParseOutput()).every(
                                    (document) =>
                                    {
                                        let steps: any[] = document.toJSON().steps;

                                        return steps.every(
                                            (step) =>
                                            {
                                                if (step.name === "test")
                                                {
                                                    return !(step.image as string).endsWith(":lts");
                                                }
                                                else
                                                {
                                                    return true;
                                                }
                                            });
                                    }));
                        });
                });
        });
}
