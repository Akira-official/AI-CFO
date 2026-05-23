import pino from 'pino';
import { BaseAgent, AgentTask, AgentResult } from './base-agent.js';

const logger = pino();

export interface WorkflowStep {
  agent: string;
  task: string;
  input?: any;
  outputKey?: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  triggers: Record<string, any>;
}

export class AgentOrchestrator {
  private agents: Map<string, BaseAgent>;
  private workflows: Map<string, Workflow>;
  private pendingWorkflows: Array<{ workflowId: string; input: any }>;

  constructor() {
    this.agents = new Map();
    this.workflows = new Map();
    this.pendingWorkflows = [];
  }

  async registerAgent(name: string, agent: BaseAgent) {
    this.agents.set(name, agent);
    logger.info(`Registered agent: ${name}`);
    
    // Initialize the agent
    await agent.initialize();
    logger.info(`Initialized agent: ${name}`);
  }

  getAgent(name: string): BaseAgent | undefined {
    return this.agents.get(name);
  }

  getAgentCount(): number {
    return this.agents.size;
  }

  registerWorkflow(workflow: Workflow) {
    this.workflows.set(workflow.id, workflow);
    logger.info(`Registered workflow: ${workflow.id}`);
  }

  async executeWorkflow(workflowId: string, input: any): Promise<any> {
    const workflow = this.workflows.get(workflowId);
    
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    logger.info(`Executing workflow: ${workflow.name}`);

    let context: Record<string, any> = { ...input };

    for (const step of workflow.steps) {
      const agent = this.agents.get(step.agent);
      
      if (!agent) {
        throw new Error(`Agent not found: ${step.agent}`);
      }

      logger.info(`Running step: ${step.task} with agent: ${step.agent}`);

      const task: AgentTask = {
        description: step.task,
        input: step.input ? { ...context, ...step.input } : context,
        context,
      };

      const result = await agent.execute(task);
      
      if (step.outputKey) {
        context[step.outputKey] = result.output;
      }
    }

    return context;
  }

  async triggerAgent(agentName: string, task: any): Promise<AgentResult> {
    const agent = this.agents.get(agentName);
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`);
    }

    const agentTask: AgentTask = {
      description: task.description || 'Execute task',
      input: task,
      context: {},
    };

    return await agent.execute(agentTask);
  }

  async processPendingWorkflows() {
    while (this.pendingWorkflows.length > 0) {
      const { workflowId, input } = this.pendingWorkflows.shift()!;
      
      try {
        await this.executeWorkflow(workflowId, input);
      } catch (error) {
        logger.error(`Failed to execute workflow ${workflowId}:`, error);
      }
    }
  }

  queueWorkflow(workflowId: string, input: any) {
    this.pendingWorkflows.push({ workflowId, input });
    logger.info(`Queued workflow: ${workflowId}`);
  }

  async broadcastToAgents(message: string, data: any) {
    const results = await Promise.all(
      Array.from(this.agents.entries()).map(async ([name, agent]) => {
        try {
          return { agent: name, result: await agent.onBroadcast(message, data) };
        } catch (error) {
          logger.error(`Agent ${name} failed to handle broadcast:`, error);
          return { agent: name, error };
        }
      })
    );

    return results;
  }
}

export default AgentOrchestrator;
