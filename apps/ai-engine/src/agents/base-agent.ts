import pino from 'pino';

const logger = pino();

export interface AgentTask {
  description: string;
  input: any;
  context: Record<string, any>;
}

export interface AgentResult {
  success: boolean;
  output: any;
  metadata?: Record<string, any>;
  error?: string;
}

export abstract class BaseAgent {
  protected name: string;
  protected type: string;
  protected status: 'idle' | 'active' | 'processing' | 'error' = 'idle';
  protected tasksCompleted: number = 0;

  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }

  async initialize(): Promise<void> {
    logger.info(`Initializing agent: ${this.name}`);
    await this.onInitialize();
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    this.status = 'processing';
    logger.info(`Agent ${this.name} executing task: ${task.description}`);

    try {
      const result = await this.process(task);
      this.tasksCompleted++;
      this.status = 'idle';
      
      return {
        success: true,
        output: result,
        metadata: {
          agent: this.name,
          type: this.type,
          tasksCompleted: this.tasksCompleted,
        },
      };
    } catch (error) {
      this.status = 'error';
      logger.error(`Agent ${this.name} failed:`, error);
      
      return {
        success: false,
        output: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          agent: this.name,
          type: this.type,
        },
      };
    }
  }

  async onBroadcast(message: string, data: any): Promise<any> {
    return this.handleBroadcast(message, data);
  }

  getStatus() {
    return {
      name: this.name,
      type: this.type,
      status: this.status,
      tasksCompleted: this.tasksCompleted,
    };
  }

  // Abstract methods to be implemented by subclasses
  protected abstract onInitialize(): Promise<void>;
  protected abstract process(task: AgentTask): Promise<any>;
  protected handleBroadcast(message: string, data: any): Promise<any> {
    return Promise.resolve(null);
  }
}

export default BaseAgent;
