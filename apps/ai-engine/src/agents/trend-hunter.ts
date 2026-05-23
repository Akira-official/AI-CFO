import { BaseAgent, AgentTask } from './base-agent.js';
import pino from 'pino';

const logger = pino();

export class TrendHunterAgent extends BaseAgent {
  private sources: string[];
  private lastCheck: Date | null = null;

  constructor() {
    super('Trend Hunter', 'trend-detection');
    this.sources = [
      'twitter',
      'reddit',
      'news-api',
      'google-trends',
      'youtube',
      'rss-feeds',
    ];
  }

  protected async onInitialize(): Promise<void> {
    logger.info('Trend Hunter Agent initialized');
    logger.info(`Monitoring ${this.sources.length} sources`);
  }

  protected async process(task: AgentTask): Promise<any> {
    const { input, context } = task;
    
    logger.info('Scanning for trending topics...');

    // Simulate trend detection from multiple sources
    const trends = await this.scanSources(input.category || 'all');
    
    // Score and rank trends
    const scoredTrends = await this.scoreTrends(trends);
    
    // Detect velocity spikes
    const highVelocityTrends = this.detectVelocitySpikes(scoredTrends);

    this.lastCheck = new Date();

    return {
      trends: highVelocityTrends,
      scannedAt: new Date().toISOString(),
      sourcesChecked: this.sources,
    };
  }

  private async scanSources(category: string): Promise<any[]> {
    // In production, this would call actual APIs
    // For now, simulate with mock data
    logger.info(`Scanning category: ${category}`);
    
    return [
      {
        title: 'AI Regulation Summit Announced',
        source: 'TechCrunch',
        url: 'https://example.com/ai-summit',
        category: 'Technology',
        mentions: 1247,
        growthRate: 0.85,
      },
      {
        title: 'Breaking: Major Climate Agreement Reached',
        source: 'Reuters',
        url: 'https://example.com/climate',
        category: 'Politics',
        mentions: 2341,
        growthRate: 0.92,
      },
      {
        title: 'New Quantum Computing Breakthrough',
        source: 'Nature',
        url: 'https://example.com/quantum',
        category: 'Science',
        mentions: 892,
        growthRate: 0.67,
      },
    ];
  }

  private async scoreTrends(trends: any[]): Promise<any[]> {
    return trends.map((trend) => ({
      ...trend,
      velocity: Math.round(trend.growthRate * 100),
      viralityScore: Math.min(100, Math.round(
        (trend.mentions / 100) * trend.growthRate * 10
      )),
      sentiment: this.analyzeSentiment(trend.title),
    }));
  }

  private detectVelocitySpikes(trends: any[], threshold: number = 70): any[] {
    return trends
      .filter((t) => t.velocity >= threshold)
      .sort((a, b) => b.velocity - a.velocity);
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['breakthrough', 'agreement', 'announced', 'success'];
    const negativeWords = ['crisis', 'failure', 'scandal', 'warning'];
    
    const lowerText = text.toLowerCase();
    
    if (positiveWords.some((w) => lowerText.includes(w))) {
      return 'positive';
    }
    if (negativeWords.some((w) => lowerText.includes(w))) {
      return 'negative';
    }
    return 'neutral';
  }

  protected override handleBroadcast(message: string, data: any): Promise<any> {
    if (message === 'new-source-added') {
      this.sources.push(data.source);
      logger.info(`Added new source: ${data.source}`);
    }
    return Promise.resolve(null);
  }
}

export default TrendHunterAgent;
