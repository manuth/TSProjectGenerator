/**
 * Represents a component.
 */
export enum MyGeneratorComponent
{
    /**
     * Indicates the drone-configuration component.
     */
    Drone = "drone-configuration",

    /**
     * Indicates the dependabot-configuration component.
     */
    Dependabot = "dependabot-configuration",

    /**
     * Indicates the auto-merge workflow component.
     */
    AutoMergeWorkflow = "auto-merge-workflow",

    /**
     * Indicates the codeql-analysis workflow component.
     */
    CodeQLAnalysisWorkflow = "codeql-analysis-workflow"
}
