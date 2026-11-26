import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PRIMARY_PAGES = ['/', '/plataforma', '/precios', '/nosotros', '/contacto', '/blog'];
const INNER_HERO_PAGES = ['/plataforma', '/precios', '/nosotros', '/contacto', '/blog', '/search'];
const EXTRA_AXE_ROUTES = [
  '/blog/etiqueta-negociacion-b2b-japon-keigo',
  '/blog/traduccion-literal-vs-inteligencia-intercultural-b2b',
  '/search',
  '/en/',
  '/en/platform',
  '/en/pricing',
  '/en/about',
  '/en/contact',
  '/en/blog',
  '/en/blog/etiqueta-negociacion-b2b-japon-keigo',
  '/en/search',
];

test.describe('NegoNEX AI layout, centered headings, dark mode & motion', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`home KPI stats band has zero overlap and zero horizontal overflow in ${theme} mode`, async ({ page }) => {
      await page.addInitScript((scheme) => localStorage.setItem('theme', scheme), theme);

      for (const viewport of [
        { width: 1280, height: 800 },
        { width: 390, height: 844 },
      ]) {
        await page.setViewportSize(viewport);
        await page.goto('/');

        // Verify zero horizontal overflow
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${theme} @ ${viewport.width}px`).toBeLessThanOrEqual(1);

        // Verify stats KPI cards do not overlap each other
        const statsDl = page.locator('dl[data-reveal-stagger]').first();
        await statsDl.scrollIntoViewIfNeeded();
        const rects = await statsDl.locator('> div').evaluateAll((els) =>
          els.map((el) => {
            const r = el.getBoundingClientRect();
            return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
          }),
        );
        expect(rects).toHaveLength(4);
        for (let i = 0; i < rects.length; i++) {
          for (let j = i + 1; j < rects.length; j++) {
            const a = rects[i];
            const b = rects[j];
            const overlaps = !(a.right <= b.left + 1 || b.right <= a.left + 1 || a.bottom <= b.top + 1 || b.bottom <= a.top + 1);
            expect(overlaps, `KPI card ${i} and ${j} overlap in ${theme} @ ${viewport.width}px`).toBe(false);
          }
        }
      }
    });
  }

  for (const path of INNER_HERO_PAGES) {
    test(`${path} centers PageHero heading and has zero horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(path);

      const hero = page.locator('.negonex-page-hero');
      await expect(hero).toBeVisible();
      const textAlign = await hero.locator('> div').evaluate((el) => getComputedStyle(el).textAlign);
      expect(textAlign).toBe('center');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  for (const path of PRIMARY_PAGES) {
    test(`${path} reveals all animated blocks on scroll and pauses off-screen loops`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(path);

      // Scroll stepwise through the full page so IntersectionObserver sees every block
      const totalHeight = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y <= totalHeight; y += 450) {
        await page.evaluate((pos) => window.scrollTo(0, pos), y);
        await page.waitForTimeout(80);
      }
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(550);

      const hiddenRevealCount = await page.evaluate(() => {
        const targets = document.querySelectorAll<HTMLElement>(
          '[data-reveal], .negonex-reveal-section, [data-reveal-stagger] > *, ul.negonex-reveal-cards > li, section.negonex-reveal-cards > div > ul > li, ol.negonex-reveal-timeline > li, .negonex-reveal-faq > details',
        );
        return Array.from(targets).filter((el) => Number(getComputedStyle(el).opacity) < 0.99).length;
      });
      expect(hiddenRevealCount, `${path} had stuck invisible reveal elements`).toBe(0);

      if (path === '/') {
        const offscreenAttr = await page.locator('.negonex-hero').getAttribute('data-offscreen');
        expect(offscreenAttr).toBe('true');
        const playState = await page
          .locator('.negonex-hero .pipeline-dot')
          .first()
          .evaluate((el) => getComputedStyle(el).animationPlayState);
        expect(playState).toBe('paused');
      }
    });
  }

  test('deep-link hash navigation immediately reveals elements above and in the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/precios#garantias');

    await expect(page.locator('#garantias')).toHaveCSS('opacity', '1');

    // Scroll back up to verify earlier bands didn't stay stuck hidden
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    const hiddenBefore = await page.evaluate(() => {
      const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
      return Array.from(els).filter((el) => el.dataset.reveal !== 'visible' && el.getBoundingClientRect().top < window.innerHeight).length;
    });
    expect(hiddenBefore).toBe(0);
  });

  test('prefers-reduced-motion disables motion-ready and shows all reveal elements immediately', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const hasMotionReady = await page.evaluate(() => document.documentElement.classList.contains('motion-ready'));
    expect(hasMotionReady).toBe(false);

    const hiddenCount = await page.evaluate(() => {
      const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger] > *');
      return Array.from(targets).filter((el) => Number(getComputedStyle(el).opacity) < 0.99).length;
    });
    expect(hiddenCount).toBe(0);
  });

  test('Intercultural Sandbox switches scenarios, markets, keyboard focus, RTL Arabic, and compare view cleanly', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));

    await page.goto('/#sandbox');
    const sandbox = page.locator('#sandbox');
    await sandbox.scrollIntoViewIfNeeded();

    // Wait for client:visible hydration and verify localized Spanish market names
    const jpTab = sandbox.getByRole('tab', { name: /Japón/i });
    await expect(jpTab).toBeVisible();
    await jpTab.click();
    await expect(
      sandbox.locator('p:not([aria-hidden="true"])', { hasText: /いつも大変お世話になっております/ }),
    ).toBeVisible();

    // Verify roving tabindex keyboard navigation moves BOTH focus and selection
    await jpTab.focus();
    await page.keyboard.press('Home');
    const usTab = sandbox.getByRole('tab', { name: /Estados Unidos/i });
    await expect(usTab).toBeFocused();
    await expect(usTab).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowRight');
    const deTab = sandbox.getByRole('tab', { name: /Alemania/i });
    await expect(deTab).toBeFocused();
    await expect(deTab).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowRight');
    const aeTab = sandbox.getByRole('tab', { name: /EAU/i });
    await expect(aeTab).toBeFocused();
    await expect(aeTab).toHaveAttribute('aria-selected', 'true');
    await expect(sandbox.locator('p[dir="rtl"]:not([aria-hidden="true"])')).toBeVisible();

    // Switch to compare mode and verify compiled error-light badge styling + RTL blockquotes
    await sandbox.getByRole('tab', { name: /Comparar vs/i }).click();
    const riskBadge = sandbox.getByText(/Riesgo de traductor genérico/i);
    await expect(riskBadge).toBeVisible();
    const bgColor = await riskBadge.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(sandbox.locator('blockquote[dir="rtl"]')).toHaveCount(2);

    expect(errors).toEqual([]);
  });

  test('staggered .card-interactive cards lift cleanly on hover with 0s delay and valid <dl> HTML', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Home hero left column and aside both animate on load, and CTA buttons stay single-line
    const heroH1Anim = await page.locator('.negonex-hero h1').evaluate((el) => {
      const parent = el.parentElement;
      return parent ? getComputedStyle(parent).animationName : 'none';
    });
    expect(heroH1Anim).toBe('negonex-hero-rise');

    const ctaHeights = await page
      .locator('.negonex-hero > div > div:first-child > div:last-child a')
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
    expect(ctaHeights.length).toBeGreaterThanOrEqual(2);
    for (const h of ctaHeights) {
      expect(h).toBeLessThanOrEqual(56);
    }

    // Valid HTML5 inside <dl> > <div>: only <dt> and <dd> children
    const invalidDlChildren = await page.locator('dl[data-reveal-stagger] > div').evaluateAll((divs) =>
      divs.flatMap((d) => Array.from(d.children).map((c) => c.tagName)).filter((t) => t !== 'DT' && t !== 'DD'),
    );
    expect(invalidDlChildren).toEqual([]);

    // Hover lift & zero leaked transition-delay on 3rd KPI card after reveal finishes
    const card = page.locator('dl[data-reveal-stagger] > div.card-interactive').nth(2);
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await card.hover();
    await page.waitForTimeout(260);
    const hoverStyle = await card.evaluate((el) => {
      const s = getComputedStyle(el);
      return { transform: s.transform, transitionDelay: s.transitionDelay };
    });
    expect(hoverStyle.transform).toBe('matrix(1, 0, 0, 1, 0, -2)');
    expect(hoverStyle.transitionDelay).toBe('0s, 0s, 0s');
  });

  test('Pricing table exposes valid region semantics and 3-column plan prices align horizontally', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/precios');

    const tableRegion = page.locator('[role="region"][tabindex="0"]').first();
    await expect(tableRegion).toBeVisible();
    await expect(tableRegion).toHaveAttribute('aria-label', /.+/);

    const pricingGrid = page.locator('.negonex-pricing-3col');
    await pricingGrid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    const priceTops = await pricingGrid
      .locator('ul > li p span.text-4xl')
      .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(priceTops).toHaveLength(3);
    expect(Math.max(...priceTops) - Math.min(...priceTops)).toBeLessThanOrEqual(2);
  });

  test('Blog index centers single regular post and Blog post avatar meets dark-mode contrast', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/blog');

    const regularCard = page.locator('section').nth(1).locator('article').first();
    const cardRect = await regularCard.boundingBox();
    expect(cardRect).not.toBeNull();
    // Centered within 1280px viewport (left + right margins approximately equal)
    const leftMargin = cardRect!.x;
    const rightMargin = 1280 - (cardRect!.x + cardRect!.width);
    expect(Math.abs(leftMargin - rightMargin)).toBeLessThanOrEqual(4);

    // Verify dark-mode ArticleHero avatar uses calibrated --brand-600 background
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto('/blog/etiqueta-negociacion-b2b-japon-keigo');
    const [avatarBg, brand600Bg] = await page.evaluate(() => {
      const avatar = document.querySelector('main > header .bg-brand-500.text-white');
      const probe = document.createElement('div');
      probe.style.backgroundColor = 'var(--brand-600)';
      document.body.append(probe);
      const result = [
        avatar ? getComputedStyle(avatar).backgroundColor : '',
        getComputedStyle(probe).backgroundColor,
      ];
      probe.remove();
      return result;
    });
    expect(avatarBg).toBe(brand600Bg);
  });

  test('Pricing Estimator calculates Overage, shows upgrade banner, and uses accessible stepper labels', async ({
    page,
  }) => {
    await page.goto('/precios#estimador');
    const estimator = page.locator('#estimador');
    await estimator.scrollIntoViewIfNeeded();

    // Verify descriptive accessible labels on stepper buttons
    const addPackBtn = estimator.getByRole('button', { name: /Aumentar paquetes adicionales/i });
    await expect(addPackBtn).toBeVisible();
    await addPackBtn.click();
    await addPackBtn.click();

    // Raise conversations to trigger Overage + algorithmic Enterprise upgrade banner
    const range = estimator.locator('input[type="range"]');
    await range.fill('6000');

    const upgradeBanner = estimator.getByText(/Recomendación algorítmica de migración/i);
    await expect(upgradeBanner).toBeVisible();
    const bannerBg = await upgradeBanner
      .locator('xpath=ancestor::div[contains(@class, "bg-info-light")]')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bannerBg).not.toBe('rgba(0, 0, 0, 0)');
  });

  for (const path of [...PRIMARY_PAGES, ...EXTRA_AXE_ROUTES]) {
    test(`${path} has no serious accessibility violations in dark mode`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
      await page.goto(path);

      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .exclude('astro-dev-toolbar')
        .analyze();
      const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }

  for (const path of PRIMARY_PAGES) {
    test(`${path} ships zero CSP violations after theme toggle and zero mobile horizontal overflow`, async ({ page }) => {
      const violations: string[] = [];
      await page.exposeFunction('reportNegoCspViolation', (v: string) => violations.push(v));
      await page.addInitScript(() => {
        document.addEventListener('securitypolicyviolation', (e) => {
          (window as unknown as { reportNegoCspViolation: (v: string) => void }).reportNegoCspViolation(
            `${e.violatedDirective} blocked ${e.blockedURI || 'inline'}`,
          );
        });
      });

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${path} mobile overflow`).toBeLessThanOrEqual(1);

      await page.locator('[data-theme-toggle]:visible').first().click();
      expect(violations).toEqual([]);
    });
  }
});
