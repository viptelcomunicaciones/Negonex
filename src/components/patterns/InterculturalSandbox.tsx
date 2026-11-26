import { useEffect, useId, useState, type KeyboardEvent } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Globe2,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export interface MarketAdaptation {
  id: string;
  code: string;
  marketName: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
  languageLabel: string;
  registerLabel: string;
  literalTranslation: string;
  literalRisk: string;
  adaptedMessage: string;
  glossNote: string;
  protocolBullets: string[];
  channelLabel: string;
}

export interface SandboxScenario {
  id: string;
  title: string;
  contextTag: string;
  sourceLabel: string;
  sourceMessage: string;
  markets: MarketAdaptation[];
}

export interface InterculturalSandboxLabels {
  eyebrow?: string;
  heading: string;
  subheading: string;
  scenarioSelectorLabel: string;
  marketSelectorLabel: string;
  viewAdaptedTab: string;
  viewCompareTab: string;
  senderBadge: string;
  receiverBadge: string;
  processingLabel: string;
  buyerReceivesPrefix: string;
  replayLabel: string;
  sourceTitle: string;
  literalTitle: string;
  literalBadge: string;
  literalRiskTitle: string;
  adaptedTitle: string;
  adaptedBadge: string;
  protocolTitle: string;
  glossLabel: string;
  disclaimer: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface InterculturalSandboxProps {
  labels: InterculturalSandboxLabels;
  scenarios: SandboxScenario[];
}

type SimulatorViewMode = 'adapted' | 'compare';

export function InterculturalSandbox({ labels, scenarios }: InterculturalSandboxProps) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [marketIdx, setMarketIdx] = useState(0);
  const [viewMode, setViewMode] = useState<SimulatorViewMode>('adapted');
  const [replayNonce, setReplayNonce] = useState(0);
  const baseId = useId();

  const currentScenario = scenarios[scenarioIdx] ?? scenarios[0];
  const currentMarket = currentScenario.markets[marketIdx] ?? currentScenario.markets[0];
  const fullAdapted = currentMarket.adaptedMessage;

  const [typedLength, setTypedLength] = useState(fullAdapted.length);

  useEffect(() => {
    if (viewMode !== 'adapted') {
      setTypedLength(fullAdapted.length);
      return;
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setTypedLength(fullAdapted.length);
      return;
    }

    setTypedLength(0);
    const total = fullAdapted.length;
    const stepSize = Math.max(2, Math.ceil(total / 36));
    let current = 0;

    const timer = window.setInterval(() => {
      current = Math.min(total, current + stepSize);
      setTypedLength(current);
      if (current >= total) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [fullAdapted, viewMode, replayNonce]);

  const isTyping = viewMode === 'adapted' && typedLength < fullAdapted.length;
  const visibleAdaptedText = fullAdapted.slice(0, typedLength);

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    total: number,
    onSelect: (next: number) => void,
  ) {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % total;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + total) % total;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = total - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    onSelect(nextIndex);

    const tablist = event.currentTarget.closest('[role="tablist"]');
    const tabs = tablist?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[nextIndex]?.focus();
  }

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

      {/* Unified B2B Chat Simulator Frame (single elevation layer) */}
      <div className="bg-card border-border overflow-hidden rounded-2xl border text-left shadow-sm">
        {/* Step 1 & 2 Controls */}
        <div className="border-border bg-background-secondary/50 space-y-5 border-b p-4 sm:p-6">
          <div className="space-y-2.5">
            <p
              className="text-foreground-muted flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
              id={`${baseId}-scenario-label`}
            >
              <span
                className="bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold"
                aria-hidden="true"
              >
                1
              </span>
              <span>{labels.scenarioSelectorLabel}</span>
            </p>
            <div
              role="tablist"
              aria-labelledby={`${baseId}-scenario-label`}
              className="flex flex-wrap gap-2"
            >
              {scenarios.map((scenario, idx) => {
                const selected = idx === scenarioIdx;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    role="tab"
                    id={`${baseId}-scenario-tab-${scenario.id}`}
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setScenarioIdx(idx)}
                    onKeyDown={(e) => handleTabKeyDown(e, idx, scenarios.length, setScenarioIdx)}
                    className={`min-h-[44px] cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      selected
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-card text-foreground border-border hover:bg-secondary'
                    }`}
                  >
                    {scenario.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5">
            <p
              className="text-foreground-muted flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
              id={`${baseId}-market-label`}
            >
              <span
                className="bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold"
                aria-hidden="true"
              >
                2
              </span>
              <span>{labels.marketSelectorLabel}</span>
            </p>
            <div
              role="tablist"
              aria-labelledby={`${baseId}-market-label`}
              className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
            >
              {currentScenario.markets.map((market, idx) => {
                const selected = idx === marketIdx;
                return (
                  <button
                    key={market.id}
                    type="button"
                    role="tab"
                    id={`${baseId}-market-tab-${market.id}`}
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setMarketIdx(idx)}
                    onKeyDown={(e) =>
                      handleTabKeyDown(e, idx, currentScenario.markets.length, setMarketIdx)
                    }
                    className={`min-h-[44px] cursor-pointer rounded-lg border px-3.5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      selected
                        ? 'bg-brand-50 dark:bg-brand-900/35 text-brand-700 dark:text-brand-300 border-brand-500/60 shadow-sm'
                        : 'bg-card text-foreground border-border hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-semibold">{market.marketName}</span>
                      <span className="bg-secondary text-foreground-secondary rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
                        {market.code}
                      </span>
                    </div>
                    <p className="text-foreground-muted mt-0.5 text-xs">{market.languageLabel}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mode Switcher Bar */}
        <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
          <div
            role="tablist"
            aria-label={labels.viewAdaptedTab}
            className="bg-background-secondary inline-flex flex-wrap gap-1 rounded-xl p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'adapted'}
              tabIndex={viewMode === 'adapted' ? 0 : -1}
              onClick={() => setViewMode('adapted')}
              onKeyDown={(e) =>
                handleTabKeyDown(e, 0, 2, (next) => setViewMode(next === 0 ? 'adapted' : 'compare'))
              }
              className={`min-h-[44px] cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                viewMode === 'adapted'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {labels.viewAdaptedTab}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'compare'}
              tabIndex={viewMode === 'compare' ? 0 : -1}
              onClick={() => setViewMode('compare')}
              onKeyDown={(e) =>
                handleTabKeyDown(e, 1, 2, (next) => setViewMode(next === 0 ? 'adapted' : 'compare'))
              }
              className={`min-h-[44px] cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                viewMode === 'compare'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {labels.viewCompareTab}
            </button>
          </div>

          {viewMode === 'adapted' && (
            <button
              type="button"
              onClick={() => setReplayNonce((n) => n + 1)}
              className="text-foreground-muted hover:text-foreground hover:bg-secondary inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{labels.replayLabel}</span>
            </button>
          )}
        </div>

        {/* Single-announcement polite status for assistive tech (avoids typewriter live-region spam) */}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {`${currentScenario.title} — ${labels.buyerReceivesPrefix} ${currentMarket.marketName} (${currentMarket.registerLabel})`}
        </p>

        {/* Interactive Conversation / Comparison Canvas */}
        <div
          className="p-4 sm:p-6"
          role="tabpanel"
          aria-labelledby={`${baseId}-market-tab-${currentMarket.id}`}
        >
          {viewMode === 'adapted' ? (
            <div className="space-y-5">
              {/* Outgoing Spanish Exporter Message */}
              <div className="ml-auto max-w-2xl space-y-2">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span className="bg-secondary text-foreground-secondary rounded-md px-2 py-0.5 text-xs font-medium">
                    {currentScenario.contextTag}
                  </span>
                  <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                    <MessageSquare
                      className="text-brand-600 dark:text-brand-400 h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    {labels.senderBadge}
                  </span>
                </div>
                <div className="bg-secondary/80 border-border/60 rounded-2xl rounded-tr-sm border px-5 py-4">
                  <p className="text-foreground-muted text-xs">{currentScenario.sourceLabel}</p>
                  <p className="text-foreground mt-1.5 text-sm leading-relaxed font-medium sm:text-base">
                    “{currentScenario.sourceMessage}”
                  </p>
                </div>
              </div>

              {/* Transformation Matrix Connector */}
              <div className="flex items-center gap-3 py-1">
                <div className="bg-border h-px flex-1" aria-hidden="true" />
                <div className="bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800/70 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{labels.processingLabel}</span>
                  <span className="hidden sm:inline" aria-hidden="true">
                    ·
                  </span>
                  <span className="hidden sm:inline">{currentMarket.registerLabel}</span>
                </div>
                <div className="bg-border h-px flex-1" aria-hidden="true" />
              </div>

              {/* Incoming Adapted Buyer Bubble (zero-CLS grid sizing overlay) */}
              <div
                key={`${currentScenario.id}-${currentMarket.id}-${replayNonce}`}
                className="sandbox-bubble-enter mr-auto max-w-2xl space-y-2.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                    <Globe2
                      className="text-brand-600 dark:text-brand-400 h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    {labels.buyerReceivesPrefix} {currentMarket.marketName}
                  </span>
                  <span className="bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                    {currentMarket.channelLabel}
                  </span>
                </div>

                <div className="bg-brand-50/75 dark:bg-brand-900/35 border-brand-200/80 dark:border-brand-800/60 grid rounded-2xl rounded-tl-sm border px-5 py-4">
                  <p
                    lang={currentMarket.lang}
                    dir={currentMarket.dir ?? 'ltr'}
                    className="invisible col-start-1 row-start-1 text-sm leading-relaxed select-none sm:text-base"
                    aria-hidden="true"
                  >
                    {fullAdapted}
                  </p>
                  <p
                    lang={currentMarket.lang}
                    dir={currentMarket.dir ?? 'ltr'}
                    className="text-foreground col-start-1 row-start-1 text-sm leading-relaxed sm:text-base"
                  >
                    {visibleAdaptedText}
                    {isTyping && (
                      <span
                        className="bg-brand-600 dark:bg-brand-400 ml-1 inline-block h-4 w-0.5 animate-pulse align-middle"
                        aria-hidden="true"
                      />
                    )}
                  </p>
                </div>

                <div className="bg-background-secondary/70 border-border/60 space-y-3 rounded-xl border px-4 py-3.5">
                  <p className="text-foreground-muted text-xs leading-relaxed">
                    <span className="text-foreground font-semibold">{labels.glossLabel}: </span>
                    {currentMarket.glossNote}
                  </p>
                  <div className="border-border border-t pt-2.5">
                    <p className="text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-wide uppercase">
                      {labels.protocolTitle}
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {currentMarket.protocolBullets.map((item) => (
                        <li
                          key={item}
                          className="text-foreground-secondary flex items-start gap-2 text-xs leading-relaxed sm:text-sm"
                        >
                          <span
                            className="bg-brand-500 mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key={`compare-${currentScenario.id}-${currentMarket.id}`} className="sandbox-bubble-enter space-y-5">
              {/* Source Reminder */}
              <div className="bg-background-secondary/70 border-border/60 rounded-xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-foreground text-xs font-semibold tracking-wide uppercase">
                    {labels.sourceTitle}
                  </span>
                  <span className="bg-secondary text-foreground-secondary rounded-md px-2 py-0.5 text-xs font-medium">
                    {currentScenario.contextTag}
                  </span>
                </div>
                <p className="text-foreground mt-2 text-sm leading-relaxed font-medium">
                  “{currentScenario.sourceMessage}”
                </p>
              </div>

              {/* Side-by-side Comparison */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <article className="bg-background-secondary/60 border-border flex flex-col justify-between rounded-xl border p-5">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          className="text-error-foreground h-5 w-5 shrink-0"
                          aria-hidden="true"
                        />
                        <h3 className="font-display text-foreground text-lg font-semibold">
                          {labels.literalTitle}
                        </h3>
                      </div>
                      <span className="bg-error-light text-error-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        {labels.literalBadge}
                      </span>
                    </div>

                    <blockquote
                      lang={currentMarket.lang}
                      dir={currentMarket.dir ?? 'ltr'}
                      className="bg-card border-border/70 text-foreground-secondary mt-4 rounded-lg border p-4 text-sm leading-relaxed"
                    >
                      {currentMarket.literalTranslation}
                    </blockquote>
                  </div>

                  <div className="border-border mt-5 border-t pt-4">
                    <p className="text-error-foreground text-xs font-semibold tracking-wide uppercase">
                      {labels.literalRiskTitle}
                    </p>
                    <p className="text-foreground-muted mt-1.5 text-sm leading-relaxed">
                      {currentMarket.literalRisk}
                    </p>
                  </div>
                </article>

                <article className="bg-brand-50/60 dark:bg-brand-900/30 border-brand-200/80 dark:border-brand-800/60 flex flex-col justify-between rounded-xl border p-5">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck
                          className="text-brand-600 dark:text-brand-400 h-5 w-5 shrink-0"
                          aria-hidden="true"
                        />
                        <h3 className="font-display text-foreground text-lg font-semibold">
                          {labels.adaptedTitle}
                        </h3>
                      </div>
                      <span className="bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        {labels.adaptedBadge}
                      </span>
                    </div>

                    <div className="text-foreground-muted mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <Globe2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{currentMarket.registerLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{currentMarket.channelLabel}</span>
                    </div>

                    <blockquote
                      lang={currentMarket.lang}
                      dir={currentMarket.dir ?? 'ltr'}
                      className="bg-card border-border/70 text-foreground mt-4 rounded-lg border p-4 text-sm leading-relaxed"
                    >
                      {currentMarket.adaptedMessage}
                    </blockquote>

                    <p className="text-foreground-muted mt-3 text-xs leading-relaxed">
                      <span className="text-foreground font-semibold">{labels.glossLabel}: </span>
                      {currentMarket.glossNote}
                    </p>
                  </div>

                  <div className="border-border mt-5 border-t pt-4">
                    <p className="text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-wide uppercase">
                      {labels.protocolTitle}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {currentMarket.protocolBullets.map((item) => (
                        <li
                          key={item}
                          className="text-foreground-secondary flex items-start gap-2 text-sm"
                        >
                          <span
                            className="bg-brand-500 mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer & CTA */}
      <div className="flex flex-col items-start justify-between gap-4 text-left sm:flex-row sm:items-center">
        <p className="text-foreground-muted max-w-2xl text-xs leading-relaxed">{labels.disclaimer}</p>
        <a
          href={labels.ctaHref}
          className="bg-primary text-primary-foreground hover:opacity-90 inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span>{labels.ctaLabel}</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export default InterculturalSandbox;
