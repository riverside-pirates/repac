# REPAC-Riverside.org Site Analysis

## Fact Sheet

### What It Is

**REPAC** = **Riverside Engineering Parent Action Council** -- a 501(c)(3) nonprofit parent booster organization supporting the [Project Lead The Way (PLTW) engineering program](https://www.repac-riverside.org/engineering-program) at **Riverside High School in Durham, NC**.

### History

- Founded **February 2008** to advocate for PLTW accreditation at Riverside High
- After accreditation was achieved, evolved into an ongoing parent support organization
- Registered as a **NC nonprofit corporation** in July 2016; received **501(c)(3) status** in September 2016

### What It Does

- Supports engineering faculty with funding and volunteers
- Provides extracurricular activities, community service, and social events for ~425 engineering students
- Sells spirit wear (t-shirts, sweatshirts, hats, magnets) via a [separate Square site](https://repac-riverside-engineering-parent-action-council.square.site/)
- Runs fundraisers (e.g., shifts at Durham Bulls games)
- Accepts donations (up to $5,000)
- Meets monthly (2nd Thursday, 6pm, Riverside Media Center)

### The Engineering Program It Supports

- PLTW-accredited, **Distinguished School** recognition 4 years running
- 96% of engineering students go on to attend college
- 3 foundation courses (grades 9-11) + specialty courses (cybersecurity, digital electronics, aerospace, civil engineering & architecture)
- Students can earn college credit with a B grade + passing score on national PLTW exam

### Current Site Structure (16 pages on Wix)

| Page | Purpose |
|------|---------|
| [Home](https://www.repac-riverside.org/) | Landing page |
| [REPAC](https://www.repac-riverside.org/repac) | About the organization |
| [REPAC FAQ](https://www.repac-riverside.org/repac-faq) | FAQs about the parent org |
| [REPAC Officers](https://www.repac-riverside.org/repac-officers) | Board/leadership listing |
| [Meetings and Minutes](https://www.repac-riverside.org/meetings-and-minutes) | Meeting schedule & records |
| [Support](https://www.repac-riverside.org/support) | How to donate/volunteer |
| [Fundraising](https://www.repac-riverside.org/fundraising) | Fundraising opportunities |
| [Engineering Program](https://www.repac-riverside.org/engineering-program) | Program overview |
| [Engineering FAQ](https://www.repac-riverside.org/engineering-faq) | Program-related FAQs |
| [Engineering Course Descriptions](https://www.repac-riverside.org/engineering-course-descriptions) | Course catalog |
| [Four-Year Course Recommendations](https://www.repac-riverside.org/four-year-course-recommendations) | Planning guide |
| [Details for Freshman](https://www.repac-riverside.org/details-for-freshman) | New student info |
| [College and Career Readiness](https://www.repac-riverside.org/college-and-career-readiness) | Post-graduation planning |
| [Student Activities](https://www.repac-riverside.org/student-activities) | Clubs, competitions, events |
| [Events Calendar](https://www.repac-riverside.org/events-calendar) | Calendar view |
| [Event List](https://www.repac-riverside.org/event-list) | List view of events |

---

## Recommendations for Refactoring

### 1. Consolidate the Information Architecture (16 pages -> ~6-7)

The current site has significant page sprawl. Many pages serve overlapping purposes:

**Proposed structure:**

| New Page | Merges |
|----------|--------|
| **Home** | Landing + quick links to key actions (donate, volunteer, join) |
| **About REPAC** | REPAC + REPAC FAQ + Officers (use accordion/tabs for FAQ & officers) |
| **Engineering Program** | Engineering Program + Course Descriptions + Four-Year Recommendations + Engineering FAQ (use tabs or sections) |
| **New Families** | Details for Freshman + College and Career Readiness (natural onboarding flow) |
| **Get Involved** | Support + Fundraising + Student Activities (one place for all engagement) |
| **Meetings & Events** | Meetings and Minutes + Events Calendar + Event List (single calendar with meeting integration) |

### 2. Ditch Wix

> **Superseded.** The decision is to stay on Wix, via Wix-Managed Headless — Wix is load-bearing for
> the org and moving off it is a separate fight. The critique below still explains why the *classic
> Editor* site is being replaced. See [`docs/deploy.md`](docs/deploy.md).

Wix is a poor choice for this type of site:

- **Terrible SEO/crawlability** -- all content renders client-side via JavaScript, meaning search engines and tools struggle to index it
- **Slow load times** -- Wix Thunderbolt adds massive JavaScript overhead for what is fundamentally a static content site
- **Split commerce** -- merchandise lives on a completely separate Square site, fragmenting the experience
- **Vendor lock-in** -- content is trapped in Wix's proprietary format

**Better alternatives:**

- **Hugo / Eleventy / Astro** (static site generators) -- fast, free hosting on GitHub Pages/Netlify/Cloudflare Pages, easy for volunteers to maintain via Markdown files
- **Google Sites** -- if the team wants zero-code simplicity, this is free and more accessible
- **Squarespace** -- if they want a paid builder, it generates real HTML and has better SEO

### 3. Unify Commerce

The spirit wear lives on a separate [Square site](https://repac-riverside-engineering-parent-action-council.square.site/) with a comically long subdomain. Donations presumably go through another flow. These should be:

- Embedded directly on the main site (Square offers embeddable widgets)
- Or use a single donation/shop page with clear CTAs

### 4. Improve Content Hierarchy and CTAs

The current site is **informational but passive**. For a nonprofit that needs donations and volunteers, every page should have clear calls-to-action:

- "Donate Now" button in the header/nav
- "Volunteer" prominently linked
- Meeting dates visible on the homepage, not buried 3 clicks deep

### 5. Reduce Redundant FAQ Patterns

Having two separate FAQ pages (REPAC FAQ + Engineering FAQ) creates confusion. Instead:

- Put engineering program questions inline on the Engineering Program page
- Put organizational questions on the About page
- Use expandable accordion sections rather than dedicated FAQ pages

### 6. Mobile-First Design

As a parent-facing site, the majority of traffic is likely from phones. The rebuilt site should prioritize mobile usability with:

- Large tap targets for donation/volunteer buttons
- Collapsible navigation
- Fast load times (static site generators excel here)

---

**Bottom line:** This is a simple nonprofit informational site that's over-engineered on Wix with too many pages for too little content. A static site generator with ~6 well-structured pages, embedded Square commerce, and prominent CTAs would serve the audience far better.

## Sources

- [REPAC Home](https://www.repac-riverside.org/)
- [REPAC About](https://www.repac-riverside.org/repac)
- [Engineering Program](https://www.repac-riverside.org/engineering-program)
- [REPAC Square Store](https://repac-riverside-engineering-parent-action-council.square.site/)
- [REPAC FAQ](https://www.repac-riverside.org/repac-faq)
- [Engineering FAQ](https://www.repac-riverside.org/engineering-faq)
- [Fundraising](https://www.repac-riverside.org/fundraising)
- [Durham Public Schools - PLTW](https://www.dpsnc.net/Page/2042)
- [Duke Engineering - Riverside Outreach](https://pratt.duke.edu/news/riverside-high-school-outreach/)
