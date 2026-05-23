import { BaseAgent, AgentTask } from './base-agent.js';
import pino from 'pino';

const logger = pino();

export class VerificationAgent extends BaseAgent {
  private trustDatabase: Map<string, number>;

  constructor() {
    super('Verification', 'fact-checking');
    this.trustDatabase = new Map([
      ['reuters.com', 0.95],
      ['apnews.com', 0.94],
      ['bloomberg.com', 0.88],
      ['techcrunch.com', 0.82],
      ['nature.com', 0.96],
    ]);
  }

  protected async onInitialize(): Promise<void> {
    logger.info('Verification Agent initialized');
    logger.info(`Loaded ${this.trustDatabase.size} trusted sources`);
  }

  protected async process(task: AgentTask): Promise<any> {
    const { input } = task;
    
    logger.info(`Verifying content: ${input.title || 'Unknown'}`);

    const results = await this.verifyContent(input);

    return {
      verified: results.confidence > 0.7,
      confidence: results.confidence,
      trustScore: results.trustScore,
      sources: results.sources,
      flags: results.flags,
      recommendations: results.recommendations,
    };
  }

  private async verifyContent(content: any): Promise<any> {
    const sources = content.sources || [];
    const title = content.title || '';
    const url = content.url || '';

    // Calculate source trust score
    let trustScore = 0.5;
    const domain = this.extractDomain(url);
    
    if (domain && this.trustDatabase.has(domain)) {
      trustScore = this.trustDatabase.get(domain)!;
    }

    // Cross-reference multiple sources
    const crossReferenceScore = await this.crossReference(title, sources);

    // Check for misinformation patterns
    const flags = this.detectMisinformationPatterns(title, content);

    // Calculate overall confidence
    const confidence = (trustScore * 0.4 + crossReferenceScore * 0.4 + (1 - flags.length) * 0.2);

    return {
      confidence: Math.round(confidence * 100) / 100,
      trustScore: Math.round(trustScore * 100) / 100,
      sources: sources.map((s: any) => ({
        ...s,
        trustScore: this.getSourceTrustScore(s.domain),
      })),
      flags,
      recommendations: this.generateRecommendations(flags, confidence),
    };
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return '';
    }
  }

  private getSourceTrustScore(domain: string): number {
    return this.trustDatabase.get(domain) || 0.5;
  }

  private async crossReference(title: string, sources: any[]): Promise<number> {
    // Simulate cross-referencing across multiple sources
    // In production, this would query fact-checking APIs and databases
    
    if (sources.length === 0) return 0.3;
    if (sources.length >= 3) return 0.9;
    if (sources.length >= 2) return 0.7;
    
    return 0.5;
  }

  private detectMisinformationPatterns(title: string, content: any): string[] {
    const flags: string[] = [];
    const lowerTitle = title.toLowerCase();

    // Clickbait detection
    const clickbaitPatterns = [
      'you won\'t believe',
      'shocking',
      'miracle',
      'doctors hate',
      'one weird trick',
    ];

    if (clickbaitPatterns.some(p => lowerTitle.includes(p))) {
      flags.push('clickbait_language');
    }

    // Excessive capitalization
    if ((title.match(/[A-Z]/g) || []).length > title.length * 0.5) {
      flags.push('excessive_capitalization');
    }

    // Missing author/source info
    if (!content.author && !content.source) {
      flags.push('missing_attribution');
    }

    return flags;
  }

  private generateRecommendations(flags: string[], confidence: number): string[] {
    const recommendations: string[] = [];

    if (confidence < 0.5) {
      recommendations.push('Low confidence - recommend additional verification');
    }

    if (flags.includes('clickbait_language')) {
      recommendations.push('Consider rewriting headline to avoid clickbait language');
    }

    if (flags.includes('missing_attribution')) {
      recommendations.push('Add proper source attribution before publishing');
    }

    if (recommendations.length === 0) {
      recommendations.push('Content appears reliable for publication');
    }

    return recommendations;
  }
}

export default VerificationAgent;
