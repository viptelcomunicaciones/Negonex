import { useId, useState } from 'react';
import { ArrowRight, CheckCircle2, Info, Minus, Plus } from 'lucide-react';

export interface PricingEstimatorLabels {
  eyebrow?: string;
  heading: string;
  subheading: string;
  planLabel: string;
  starterTitle: string;
  starterMeta: string;
  enterpriseTitle: string;
  enterpriseMeta: string;
  commitmentLabel: string;
  starterMonthlyLabel: string;
  starterAnnualLabel: string;
  enterprise12Label: string;
  enterprise24Label: string;
  conversationsLabel: string;
  conversationsIncluded: string;
  extraPacksLabel: string;
  extraPacksHint: string;
  decreaseExtraPacksLabel?: string;
  increaseExtraPacksLabel?: string;
  intelligenceLabel: string;
  intelligenceHint: string;
  intelligenceFreePromo: string;
  consultingLabel: string;
  consultingHint: string;
  decreaseConsultingLabel?: string;
  increaseConsultingLabel?: string;
  summaryTitle: string;
  setupRow: string;
  baseMonthlyRow: string;
  extraPacksRow: string;
  intelligenceRow: string;
  consultingRow: string;
  overageRow: string;
  overageBlocksDetail: string;
  totalMonthlyRow: string;
  annualRenewalNote: string;
  upgradeBannerTitle: string;
  upgradeBannerBody: string;
  upgradeActionLabel: string;
  ctaLabel: string;
  ctaHref: string;
  currencyNote: string;
}

export interface PricingEstimatorProps {
  labels: PricingEstimatorLabels;
}

type PlanId = 'starter' | 'enterprise';

const STARTER_BASE = 450;
const STARTER_ANNUAL = 4590; // 15% discount on renewal ($382.50/mo equivalent)
const STARTER_SETUP = 1200;
const STARTER_INCLUDED_CONV = 2500;
const STARTER_OVERAGE_BLOCK = 250;
const STARTER_OVERAGE_PRICE = 60;

const ENTERPRISE_BASE = 1100;
const ENTERPRISE_SETUP_12M = 2800;
const ENTERPRISE_SETUP_24M = 1400; // 50% discount on 24m commitment
const ENTERPRISE_INCLUDED_CONV = 10000;
const ENTERPRISE_OVERAGE_BLOCK = 500;
const ENTERPRISE_OVERAGE_PRICE = 90;

const EXTRA_PACK_PRICE = 150;
const INTELLIGENCE_PRICE = 250;
const CONSULTING_PRICE = 400;

function formatUsd(amount: number): string {
  return `USD $${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function PricingEstimator({ labels }: PricingEstimatorProps) {
  const [plan, setPlan] = useState<PlanId>('starter');
  const [starterAnnual, setStarterAnnual] = useState(false);
  const [enterprise24m, setEnterprise24m] = useState(false);
  const [conversations, setConversations] = useState(2500);
  const [extraPacks, setExtraPacks] = useState(0);
  const [includeIntelligence, setIncludeIntelligence] = useState(false);
  const [consultingSessions, setConsultingSessions] = useState(0);
  const baseId = useId();

  const isStarter = plan === 'starter';
  const includedConv = isStarter ? STARTER_INCLUDED_CONV : ENTERPRISE_INCLUDED_CONV;
  const excessConv = Math.max(0, conversations - includedConv);
  const blockSize = isStarter ? STARTER_OVERAGE_BLOCK : ENTERPRISE_OVERAGE_BLOCK;
  const blockPrice = isStarter ? STARTER_OVERAGE_PRICE : ENTERPRISE_OVERAGE_PRICE;
  const overageBlocks = excessConv > 0 ? Math.ceil(excessConv / blockSize) : 0;
  const overageMonthly = overageBlocks * blockPrice;

  const setupFee = isStarter
    ? STARTER_SETUP
    : enterprise24m
      ? ENTERPRISE_SETUP_24M
      : ENTERPRISE_SETUP_12M;

  const baseMonthly = isStarter
    ? starterAnnual
      ? Math.round((STARTER_ANNUAL / 12) * 100) / 100
      : STARTER_BASE
    : ENTERPRISE_BASE;

  const extraPacksCost = extraPacks * EXTRA_PACK_PRICE;
  const intelligenceMonthly = includeIntelligence ? (isStarter ? INTELLIGENCE_PRICE : 0) : 0;
  const consultingMonthly = consultingSessions * CONSULTING_PRICE;
  const totalMonthly = Math.round(baseMonthly + extraPacksCost + intelligenceMonthly + consultingMonthly + overageMonthly);

  // Algorithmic recommendation from PDF §4.4 (when Enterprise becomes more economical)
  const comparableEnterpriseMonthly =
    ENTERPRISE_BASE +
    Math.max(0, extraPacks - 2) * EXTRA_PACK_PRICE +
    Math.ceil(Math.max(0, conversations - ENTERPRISE_INCLUDED_CONV) / ENTERPRISE_OVERAGE_BLOCK) *
      ENTERPRISE_OVERAGE_PRICE +
    consultingMonthly;
  const recommendUpgrade = isStarter && totalMonthly >= comparableEnterpriseMonthly;

  const overageDetailText = labels.overageBlocksDetail
    .replace('{blocks}', String(overageBlocks))
    .replace('{size}', String(blockSize))
    .replace('{rate}', String(blockPrice));

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        {labels.eyebrow && (
          <p className="negonex-eyebrow text-xs font-bold uppercase">{labels.eyebrow}</p>
        )}
        <h2 className="font-display text-foreground text-3xl font-bold tracking-tight text-balance md:text-4xl">
          {labels.heading}
        </h2>
        <p className="text-foreground-muted text-lg leading-relaxed text-pretty">{labels.subheading}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 text-left lg:grid-cols-12">
        {/* Left: Controls */}
        <div className="bg-card border-border space-y-6 rounded-2xl border p-5 shadow-sm sm:p-6 lg:col-span-7">
          {/* Plan selection */}
          <div className="space-y-2.5">
            <p className="text-foreground text-sm font-semibold">{labels.planLabel}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPlan('starter')}
                aria-pressed={isStarter}
                className={`min-h-14 cursor-pointer rounded-lg border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                  isStarter
                    ? 'border-brand-600 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/35'
                    : 'border-border bg-background hover:bg-background-secondary'
                }`}
              >
                <span className="text-foreground block text-base font-bold">{labels.starterTitle}</span>
                <span className="text-foreground-muted mt-0.5 block text-xs">{labels.starterMeta}</span>
              </button>

              <button
                type="button"
                onClick={() => setPlan('enterprise')}
                aria-pressed={!isStarter}
                className={`min-h-14 cursor-pointer rounded-lg border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                  !isStarter
                    ? 'border-brand-600 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/35'
                    : 'border-border bg-background hover:bg-background-secondary'
                }`}
              >
                <span className="text-foreground block text-base font-bold">{labels.enterpriseTitle}</span>
                <span className="text-foreground-muted mt-0.5 block text-xs">{labels.enterpriseMeta}</span>
              </button>
            </div>
          </div>

          {/* Commitment / Renewal toggle */}
          <div className="space-y-2">
            <p className="text-foreground text-sm font-semibold">{labels.commitmentLabel}</p>
            {isStarter ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setStarterAnnual(false)}
                  aria-pressed={!starterAnnual}
                  className={`min-h-11 cursor-pointer rounded-lg border px-3.5 py-2 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                    !starterAnnual
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:bg-background-secondary'
                  }`}
                >
                  {labels.starterMonthlyLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setStarterAnnual(true)}
                  aria-pressed={starterAnnual}
                  className={`min-h-11 cursor-pointer rounded-lg border px-3.5 py-2 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                    starterAnnual
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:bg-background-secondary'
                  }`}
                >
                  {labels.starterAnnualLabel}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setEnterprise24m(false)}
                  aria-pressed={!enterprise24m}
                  className={`min-h-11 cursor-pointer rounded-lg border px-3.5 py-2 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                    !enterprise24m
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:bg-background-secondary'
                  }`}
                >
                  {labels.enterprise12Label}
                </button>
                <button
                  type="button"
                  onClick={() => setEnterprise24m(true)}
                  aria-pressed={enterprise24m}
                  className={`min-h-11 cursor-pointer rounded-lg border px-3.5 py-2 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                    enterprise24m
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:bg-background-secondary'
                  }`}
                >
                  {labels.enterprise24Label}
                </button>
              </div>
            )}
          </div>

          {/* Monthly conversations */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <label htmlFor={`${baseId}-conv`} className="text-foreground text-sm font-semibold">
                {labels.conversationsLabel}
              </label>
              <span className="text-brand-700 dark:text-brand-300 font-mono text-sm font-bold tabular-nums">
                {conversations.toLocaleString('en-US')}
              </span>
            </div>
            <input
              id={`${baseId}-conv`}
              type="range"
              min={500}
              max={15000}
              step={250}
              value={conversations}
              onChange={(e) => setConversations(Number(e.target.value))}
              className="accent-brand-600 h-2 w-full cursor-pointer rounded-lg"
            />
            <p className="text-foreground-muted text-xs">
              {labels.conversationsIncluded.replace('{included}', includedConv.toLocaleString('en-US'))}
            </p>
          </div>

          {/* Extra users / branch packs */}
          <div className="border-border flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-foreground text-sm font-semibold">{labels.extraPacksLabel}</p>
              <p className="text-foreground-muted text-xs">{labels.extraPacksHint}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={labels.decreaseExtraPacksLabel ?? 'Decrease extra packs'}
                onClick={() => setExtraPacks((v) => Math.max(0, v - 1))}
                disabled={extraPacks === 0}
                className="border-border bg-background hover:bg-secondary flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-8 text-center font-mono text-sm font-bold tabular-nums">{extraPacks}</span>
              <button
                type="button"
                aria-label={labels.increaseExtraPacksLabel ?? 'Increase extra packs'}
                onClick={() => setExtraPacks((v) => Math.min(6, v + 1))}
                disabled={extraPacks === 6}
                className="border-border bg-background hover:bg-secondary flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Plan Intelligence Add-on */}
          <div className="border-border flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
            <div>
              <label htmlFor={`${baseId}-bi`} className="text-foreground cursor-pointer text-sm font-semibold">
                {labels.intelligenceLabel}
              </label>
              <p className="text-foreground-muted text-xs">
                {!isStarter ? labels.intelligenceFreePromo : labels.intelligenceHint}
              </p>
            </div>
            <input
              id={`${baseId}-bi`}
              type="checkbox"
              checked={includeIntelligence}
              onChange={(e) => setIncludeIntelligence(e.target.checked)}
              className="accent-brand-600 h-5 w-5 shrink-0 cursor-pointer rounded"
            />
          </div>

          {/* Executive consulting sessions */}
          <div className="border-border flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-foreground text-sm font-semibold">{labels.consultingLabel}</p>
              <p className="text-foreground-muted text-xs">{labels.consultingHint}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={labels.decreaseConsultingLabel ?? 'Decrease consulting sessions'}
                onClick={() => setConsultingSessions((v) => Math.max(0, v - 1))}
                disabled={consultingSessions === 0}
                className="border-border bg-background hover:bg-secondary flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-8 text-center font-mono text-sm font-bold tabular-nums">{consultingSessions}</span>
              <button
                type="button"
                aria-label={labels.increaseConsultingLabel ?? 'Increase consulting sessions'}
                onClick={() => setConsultingSessions((v) => Math.min(4, v + 1))}
                disabled={consultingSessions === 4}
                className="border-border bg-background hover:bg-secondary flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <aside className="bg-card border-border flex flex-col justify-between rounded-2xl border p-5 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
          <div className="space-y-4">
            <h3 className="font-display text-foreground text-xl font-bold">{labels.summaryTitle}</h3>

            <dl className="divide-border divide-y text-sm">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-foreground-muted">{labels.setupRow}</dt>
                <dd className="text-foreground font-mono font-semibold tabular-nums">{formatUsd(setupFee)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-foreground-muted">{labels.baseMonthlyRow}</dt>
                <dd className="text-foreground font-mono font-semibold tabular-nums">
                  {formatUsd(Math.round(baseMonthly))}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-foreground-muted">{labels.extraPacksRow}</dt>
                <dd className="text-foreground font-mono font-semibold tabular-nums">{formatUsd(extraPacksCost)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-foreground-muted">{labels.intelligenceRow}</dt>
                <dd className="text-foreground font-mono font-semibold tabular-nums">
                  {formatUsd(intelligenceMonthly)}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-foreground-muted">{labels.consultingRow}</dt>
                <dd className="text-foreground font-mono font-semibold tabular-nums">{formatUsd(consultingMonthly)}</dd>
              </div>
              <div className="flex items-start justify-between gap-3 py-2.5">
                <dt className="text-foreground-muted">
                  <span>{labels.overageRow}</span>
                  {overageBlocks > 0 && (
                    <span className="text-foreground-muted mt-1 block text-xs">{overageDetailText}</span>
                  )}
                </dt>
                <dd className="text-foreground shrink-0 font-mono font-semibold tabular-nums">
                  {formatUsd(overageMonthly)}
                </dd>
              </div>
            </dl>

            <div className="bg-background-secondary border-border rounded-lg border p-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-foreground text-sm font-semibold">{labels.totalMonthlyRow}</span>
                <span className="font-display text-brand-700 dark:text-brand-300 text-2xl font-bold tabular-nums">
                  {formatUsd(totalMonthly)}
                </span>
              </div>
              {isStarter && starterAnnual && (
                <p className="text-foreground-muted mt-1.5 text-xs">{labels.annualRenewalNote}</p>
              )}
            </div>

            {recommendUpgrade && (
              <div className="sandbox-bubble-enter bg-info-light text-info-foreground border-border rounded-lg border p-4 text-xs leading-relaxed">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <div className="space-y-2">
                    <p className="font-semibold">{labels.upgradeBannerTitle}</p>
                    <p>{labels.upgradeBannerBody}</p>
                    <button
                      type="button"
                      onClick={() => setPlan('enterprise')}
                      className="cursor-pointer font-semibold underline"
                    >
                      {labels.upgradeActionLabel}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <a
              href={labels.ctaHref}
              className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 text-primary-foreground inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>{labels.ctaLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="text-foreground-muted text-center text-xs">{labels.currencyNote}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PricingEstimator;
