import { basename } from "path";
import { ComponentTests } from "./Components";
import { ExtensionsProcessorTests } from "./ExtensionsProcessor.test";
import { FileMappingTests } from "./FileMappings";
import { LaunchSettingsProcessorTests } from "./LaunchSettingsProcessor.test";
import { SettingsProcessorTest } from "./SettingsProcessor.test";
import { TasksProcessorTests } from "./TasksProcessor.test";
import { VSCodeJSONProcessorTests } from "./VSCodeJSONProcessor.test";
import { WorkspaceProcessorTests } from "./WorkspaceProcessor.test";

/**
 * Registers tests for `VSCode` components.
 */
export function VSCodeTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            VSCodeJSONProcessorTests();
            ExtensionsProcessorTests();
            LaunchSettingsProcessorTests();
            SettingsProcessorTest();
            TasksProcessorTests();
            WorkspaceProcessorTests();
            FileMappingTests();
            ComponentTests();
        });
}
