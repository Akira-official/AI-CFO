import { pgTable, text, timestamp, integer, boolean, uuid, jsonb, decimal, index } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'editor', 'viewer'] }).default('viewer'),
  avatar: text('avatar'),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  workspaceIdx: index('users_workspace_idx').on(table.workspaceId),
}));

// Workspaces table
export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  plan: text('plan', { enum: ['free', 'pro', 'team', 'enterprise'] }).default('free'),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Trends table
export const trends = pgTable('trends', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  source: text('source').notNull(),
  url: text('url'),
  category: text('category'),
  velocity: decimal('velocity').default('0'),
  viralityScore: decimal('virality_score').default('0'),
  sentiment: text('sentiment', { enum: ['positive', 'negative', 'neutral'] }),
  verified: boolean('verified').default(false),
  trustScore: decimal('trust_score'),
  metadata: jsonb('metadata').default({}),
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
}, (table) => ({
  categoryIdx: index('trends_category_idx').on(table.category),
  velocityIdx: index('trends_velocity_idx').on(table.velocity),
  detectedAtIdx: index('trends_detected_at_idx').on(table.detectedAt),
}));

// Agents table
export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  status: text('status', { enum: ['active', 'inactive', 'processing', 'error'] }).default('inactive'),
  config: jsonb('config').default({}),
  tasksCompleted: integer('tasks_completed').default(0),
  lastActiveAt: timestamp('last_active_at'),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  workspaceIdx: index('agents_workspace_idx').on(table.workspaceId),
  statusIdx: index('agents_status_idx').on(table.status),
}));

// Content Pipeline table
export const contentPipeline = pgTable('content_pipeline', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  type: text('type', { enum: ['article', 'video', 'short', 'script', 'social'] }).notNull(),
  stage: text('stage', { enum: ['research', 'draft', 'review', 'publish'] }).default('research'),
  progress: integer('progress').default(0),
  content: text('content'),
  metadata: jsonb('metadata').default({}),
  assignedTo: uuid('assigned_to').references(() => users.id),
  trendId: uuid('trend_id').references(() => trends.id),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  stageIdx: index('pipeline_stage_idx').on(table.stage),
  workspaceIdx: index('pipeline_workspace_idx').on(table.workspaceId),
}));

// Workflows table
export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  steps: jsonb('steps').notNull().default([]),
  triggers: jsonb('triggers').default({}),
  active: boolean('active').default(true),
  executionCount: integer('execution_count').default(0),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  workspaceIdx: index('workflows_workspace_idx').on(table.workspaceId),
  activeIdx: index('workflows_active_idx').on(table.active),
}));

// Workflow executions table
export const workflowExecutions = pgTable('workflow_executions', {
  id: uuid('id').primaryKey().defaultRandom(),
  workflowId: uuid('workflow_id').references(() => workflows.id).notNull(),
  status: text('status', { enum: ['pending', 'running', 'completed', 'failed'] }).default('pending'),
  input: jsonb('input').default({}),
  output: jsonb('output').default({}),
  error: text('error'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  workflowIdx: index('executions_workflow_idx').on(table.workflowId),
  statusIdx: index('executions_status_idx').on(table.status),
}));

// Sources table (for verification)
export const sources = pgTable('sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type', { enum: ['news', 'social', 'rss', 'api', 'manual'] }).notNull(),
  trustScore: decimal('trust_score').default('0.5'),
  bias: text('bias', { enum: ['left', 'center-left', 'center', 'center-right', 'right', 'unknown'] }).default('unknown'),
  active: boolean('active').default(true),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  typeIdx: index('sources_type_idx').on(table.type),
  trustIdx: index('sources_trust_idx').on(table.trustScore),
}));

// Trend sources (many-to-many relationship)
export const trendSources = pgTable('trend_sources', {
  trendId: uuid('trend_id').references(() => trends.id).notNull(),
  sourceId: uuid('source_id').references(() => sources.id).notNull(),
  relevanceScore: decimal('relevance_score').default('1'),
  citedAt: timestamp('cited_at').defaultNow().notNull(),
}, (table) => ({
  pk: index('trend_sources_pk').on(table.trendId, table.sourceId),
}));

// API Keys table
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  key: text('key').notNull().unique(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  permissions: jsonb('permissions').default({}),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  keyIdx: index('api_keys_key_idx').on(table.key),
  userIdx: index('api_keys_user_idx').on(table.userId),
}));

// Activity logs table
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  resource: text('resource'),
  resourceId: uuid('resource_id'),
  metadata: jsonb('metadata').default({}),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('activity_logs_user_idx').on(table.userId),
  actionIdx: index('activity_logs_action_idx').on(table.action),
  createdAtIdx: index('activity_logs_created_at_idx').on(table.createdAt),
}));
