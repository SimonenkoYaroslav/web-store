#!/usr/bin/env node
/**
 * statusline.js — prints the Claude Code status line: model + remaining limits.
 *
 * Claude Code passes context as a JSON object via stdin, e.g.:
 * {
 *   "model": { "display_name": "Sonnet 4.6" },
 *   "workspace": { "current_dir": "..." },
 *   "cost": { "total_cost_usd": 0.42 },
 *   "usage": { "limit_remaining_pct": 63 }
 * }
 *
 * Wired up via .claude/settings.json -> statusLine.command
 */

let input = "";

process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  let ctx = {};

  try {
    ctx = JSON.parse(input);
  } catch {
    ctx = {};
  }

  const model = ctx?.model?.display_name || "unknown-model";

  const dir = ctx?.workspace?.current_dir
    ? ctx.workspace.current_dir.split(/[\\/]/).pop()
    : "";

  const costUsd = ctx?.cost?.total_cost_usd;
  const limitPct = ctx?.usage?.limit_remaining_pct;

  const parts = [`🤖 ${model}`];

  if (dir) {parts.push(`📁 ${dir}`);}

  if (typeof limitPct === "number") {
    const icon = limitPct > 50 ? "🟢" : limitPct > 20 ? "🟡" : "🔴";
    parts.push(`${icon} limit: ${limitPct}%`);
  }

  if (typeof costUsd === "number") {
    parts.push(`💰 $${costUsd.toFixed(2)}`);
  }

  process.stdout.write(parts.join("  │  "));
});
