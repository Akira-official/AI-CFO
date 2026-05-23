import pino from 'pino';
import dotenv from 'dotenv';
import { AgentOrchestrator } from './agents/orchestrator.js';
import { TrendHunterAgent } from './agents/trend-hunter.js';
import { VerificationAgent } from './agents/verification.js';
import { ResearchAgent } from './agents/research.js';
import { ContentScriptAgent } from './agents/content-script.js';
import { setupVectorStore } from './memory/vector-store.js';

dotenv.config();

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

class AIEngine {
  private orchestrator: AgentOrchestrator;
  private vectorStore: any;

  constructor() {
    this.orchestrator = new AgentOrchestrator();
    this.vectorStore = null;
  }

  async initialize() {
    logger.info('🧠 Initializing Vyoma AI Engine...');

    // Setup vector memory
    this.vectorStore = await setupVectorStore();
    logger.info('✅ Vector store initialized');

    // Register agents
    await this.registerAgents();
    logger.info('✅ Agents registered');

    // Start workflow listener
    this.startWorkflowListener();
    logger.info('✅ Workflow listener started');

    logger.info('🎯 AI Engine ready');
  }

  private async registerAgents() {
    // Register all specialized agents
    const trendHunter = new TrendHunterAgent();
    const verification = new VerificationAgent();
    const research = new ResearchAgent();
    const contentScript = new ContentScriptAgent();

    await this.orchestrator.registerAgent('trend-hunter', trendHunter);
    await this.orchestrator.registerAgent('verification', verification);
    await this.orchestrator.registerAgent('research', research);
    await this.orchestrator.registerAgent('content-script', contentScript);

    logger.info(`Registered ${this.orchestrator.getAgentCount()} agents`);
  }

  private startWorkflowListener() {
    // Listen for workflow triggers from Redis/pubsub
    logger.info('Starting workflow listener...');
    
    // This would connect to Redis pub/sub or Kafka
    // For now, we'll set up a polling mechanism
    setInterval(async () => {
      await this.orchestrator.processPendingWorkflows();
    }, 5000);
  }

  async executeWorkflow(workflowId: string, input: any) {
    logger.info(`Executing workflow: ${workflowId}`);
    return await this.orchestrator.executeWorkflow(workflowId, input);
  }

  async triggerAgent(agentName: string, task: any) {
    logger.info(`Triggering agent: ${agentName}`);
    return await this.orchestrator.triggerAgent(agentName, task);
  }

  async searchMemory(query: string, limit: number = 10) {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized');
    }
    return await this.vectorStore.similaritySearch(query, limit);
  }

  async addToMemory(text: string, metadata: any = {}) {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized');
    }
    return await this.vectorStore.addText(text, metadata);
  }
}

// Singleton instance
let aiEngine: AIEngine | null = null;

export function getAIEngine(): AIEngine {
  if (!aiEngine) {
    aiEngine = new AIEngine();
  }
  return aiEngine;
}

export async function initializeAIEngine() {
  const engine = getAIEngine();
  await engine.initialize();
  return engine;
}

// Main entry point
if (process.argv[1]?.includes('index.ts')) {
  (async () => {
    try {
      const engine = await initializeAIEngine();
      
      // Keep process alive
      logger.info('AI Engine running. Press Ctrl+C to exit.');
    } catch (error) {
      logger.error('Failed to start AI Engine:', error);
      process.exit(1);
    }
  })();
}

export { AIEngine };
