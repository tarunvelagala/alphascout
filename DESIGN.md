# alphascout – System Design

This document describes the architectural and design decisions behind **alphascout**.
It focuses on *why* the system is structured the way it is, not just *what* it does.

alphascout is intentionally conservative in scope. The design optimizes for robustness,
clarity, and long-term maintainability rather than short-term performance.

---

## Design Goals

1. **Determinism First**
   - Financial rules and risk constraints are deterministic.
   - AI agents assist interpretation, not decision authority.

2. **Risk as a First-Class Citizen**
   - Capital protection has priority over return maximization.
   - Risk logic can veto any downstream decision.

3. **Explainability**
   - Every alert must answer:
     - Why was this triggered?
     - Is action required?

4. **Low Operational Complexity**
   - Serverless execution
   - Minimal infrastructure
   - Near-zero idle cost

5. **Validation-Driven Evolution**
   - Strategy changes require historical validation.
   - No curve fitting or per-stock heuristics.

---

## Architectural Overview

alphascout follows a **pipeline architecture** with clear stage boundaries.

Each stage:
- Has a single responsibility
- Produces structured outputs
- Can be independently validated or replaced

Execution is triggered by scheduled events (cron), not user interaction.

---

## Agent-Oriented Design

Agents are used where:
- Interpretation is required
- Multiple weak signals need aggregation
- Deterministic rules alone are insufficient

Agents are *not* used for:
- Direct stock picking
- Risk rule enforcement
- Capital limits
- Trade execution

This ensures AI remains advisory, not authoritative.

---

## Agent Layers

### 1. Screening Layer
Purpose:
- Reduce the universe to financially survivable candidates

Characteristics:
- Fully deterministic
- No news, sentiment, or AI influence
- Conservative by design

Failure mode:
- False negatives are acceptable
- False positives are not

---

### 2. Contextual Intelligence Layer
Includes:
- News Agent
- Sector Trend Agent
- Earnings & Guidance Agent

Purpose:
- Adjust conviction
- Provide regime awareness
- Prevent static rule behavior

Key constraint:
- Cannot override screening or risk constraints

All outputs are numeric or structured.

---

### 3. Analysis & Ranking Layer
Purpose:
- Combine multiple signals into a ranked list

Inputs:
- Fundamental quality score
- Sector-relative ranking
- Sector strength score
- Earnings impact score

Output:
- Ordered candidates with composite scores

This layer is where trade-offs occur, but not rule-breaking.

---

### 4. Capital Allocation Layer
Purpose:
- Allocate small SIP capital efficiently

Design considerations:
- Avoid over-diversification
- Respect minimum ticket sizes
- Prefer fewer, higher-conviction positions

This layer is constrained by both upstream analysis and downstream risk rules.

---

### 5. Risk Management Layer
Purpose:
- Protect capital under all circumstances

Controls:
- Max stock exposure
- Max sector exposure
- Trailing stop-loss
- Fundamental deterioration checks

Design decision:
- Risk agent has **absolute veto authority**
- No agent may bypass this layer

---

### 6. Communication Layer
Purpose:
- Inform the user, not overwhelm them

Principles:
- Alerts are decision-based, not data-based
- Silence implies system health
- Every alert must be explainable

Telegram is used for its simplicity and low friction.

---

## Scheduling & Execution Model

alphascout uses **time-based execution**, not event-driven trading.

Typical schedules:
- Monthly SIP run
- Daily earnings scan
- Daily risk checks
- Quarterly validation runs

This enforces long-term behavior and reduces noise sensitivity.

---

## Validation Strategy

Validation is intentionally separated from production execution.

The Validation Agent:
- Replays historical data
- Uses identical agents and rules
- Produces diagnostic metrics

Validation outputs are reviewed manually before any system changes.

No automatic self-optimization is allowed.

---

## Infrastructure Design

alphascout runs on AWS Free Tier:

- **EventBridge** for scheduling
- **Lambda** for execution
- **CloudWatch Logs** for observability
- **Lambda environment variables** for secrets (v1)

Infrastructure is replaceable without changing core logic.

---

## Failure Philosophy

The system is designed to fail:
- Loudly (clear logs)
- Early (fail-fast configuration)
- Safely (no silent capital risk)

Missed opportunities are acceptable.
Uncontrolled risk is not.

---

## Extensibility Guidelines

When adding new features:
- Prefer new agents over modifying existing ones
- Validate historical impact before enabling
- Never weaken risk constraints
- Keep alerts minimal

---

## Summary

alphascout is not optimized for excitement.
It is optimized for **survivability, clarity, and discipline**.

If it feels boring, the design is working.
