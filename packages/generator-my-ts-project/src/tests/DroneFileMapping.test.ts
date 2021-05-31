import { ok } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { ITSProjectSettings } from "@manuth/generator-ts-project";
import { DroneFileMapping } from "../DroneFileMapping";
import { MyTSModuleGenerator } from "../generators/module/MyTSModuleGenerator";

/**
 * Registers tests for the `DroneFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function DroneFileMappingTests(context: TestContext<MyTSModuleGenerator>): void
{
    suite(
        "DroneFileMapping",
        () =>
        {
            let fileMappingOptions: DroneFileMapping<ITSProjectSettings, GeneratorOptions>;

            /**
             * Represents a condition for commands.
             */
            type CommandCondition = (command: string) => boolean;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    fileMappingOptions = new DroneFileMapping(await context.Generator);
                });

            /**
             * Asserts the truthyness of the spceified `condition`.
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
                let documents = await fileMappingOptions.Transform(await fileMappingOptions.Metadata);
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

            test(
                "Checking whether `publish` commands are replaced correctly…",
                async function()
                {
                    this.timeout(20 * 1000);
                    ok(await AssertCommand((command) => command.startsWith("npm publish")));
                    ok(await AssertCommand((command) => !command.startsWith("npx lerna publish"), true));
                });

            test(
                "Checking whether `lerna exec` commands are replaced correctly…",
                async function()
                {
                    this.timeout(20 * 1000);
                    ok(await AssertCommand((command) => !command.startsWith("npx lerna exec"), true));
                });

            test(
                "Checking whether github-releases are adjusted correctly…",
                async function()
                {
                    this.timeout(20 * 1000);

                    ok(
                        (await fileMappingOptions.Transform(await fileMappingOptions.Metadata)).every(
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
                    this.timeout(20 * 1000);

                    ok(
                        (await fileMappingOptions.Transform(await fileMappingOptions.Metadata)).every(
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
}
