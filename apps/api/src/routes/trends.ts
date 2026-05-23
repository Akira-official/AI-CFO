import { Router } from 'express';
import { getDb, eq, desc, trends, sql } from '../db/index.js';
import { z } from 'zod';

const router = Router();

const trendQuerySchema = z.object({
  category: z.string().optional(),
  limit: z.string().transform(Number).default('20'),
  offset: z.string().transform(Number).default('0'),
  minVelocity: z.string().transform(Number).optional(),
  verified: z.string().transform((v) => v === 'true').optional(),
});

// GET /api/v1/trends - Get all trends
router.get('/', async (req, res, next) => {
  try {
    const { category, limit, offset, minVelocity, verified } = trendQuerySchema.parse(req.query);
    const db = getDb();

    let query = db.select().from(trends);

    // Apply filters
    if (category) {
      query = db.select().from(trends).where(eq(trends.category, category));
    }

    // Order by velocity and detected_at
    query = db.select().from(trends)
      .orderBy(desc(trends.velocity), desc(trends.detectedAt))
      .limit(limit)
      .offset(offset);

    const result = await query;

    res.json({
      success: true,
      data: result,
      meta: {
        total: result.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/trends/:id - Get single trend
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const result = await db.select().from(trends).where(eq(trends.id, id)).limit(1);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Trend not found',
      });
    }

    res.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/trends - Create new trend
router.post('/', async (req, res, next) => {
  try {
    const trendSchema = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      source: z.string().min(1),
      url: z.string().url().optional(),
      category: z.string().optional(),
      velocity: z.number().optional(),
      viralityScore: z.number().optional(),
      sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
      verified: z.boolean().optional(),
      metadata: z.record(z.any()).optional(),
    });

    const data = trendSchema.parse(req.body);
    const db = getDb();

    const result = await db.insert(trends).values(data).returning();

    res.status(201).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/trends/:id - Update trend
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const updateSchema = z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      velocity: z.number().optional(),
      viralityScore: z.number().optional(),
      verified: z.boolean().optional(),
      metadata: z.record(z.any()).optional(),
    });

    const data = updateSchema.parse(req.body);

    const result = await db.update(trends)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(trends.id, id))
      .returning();

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Trend not found',
      });
    }

    res.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/trends/:id - Delete trend
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();

    await db.delete(trends).where(eq(trends.id, id));

    res.json({
      success: true,
      message: 'Trend deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/trends/stats - Get trend statistics
router.get('/stats', async (req, res, next) => {
  try {
    const db = getDb();

    const [totalTrends, avgVelocity, topCategory] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(trends),
      db.select({ avg: sql<number>`AVG(${trends.velocity})` }).from(trends),
      db.select({ 
        category: trends.category, 
        count: sql<number>`count(*)` 
      })
        .from(trends)
        .groupBy(trends.category)
        .orderBy(desc(sql`count(*)`))
        .limit(1),
    ]);

    res.json({
      success: true,
      data: {
        totalTrends: totalTrends[0]?.count || 0,
        avgVelocity: Number(avgVelocity[0]?.avg || 0),
        topCategory: topCategory[0]?.category || 'N/A',
      },
    });
  } catch (error) {
    next(error);
  }
});

export { router as trendsRouter };
