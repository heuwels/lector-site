---
title: "Spaced repetition, explained"
description: "Spaced repetition schedules each review just before you forget, using the Ebbinghaus forgetting curve to make vocabulary stick with minimal effort."
oneLiner: "How reviewing a word just before you would forget it turns the forgetting curve into durable memory."
kind: "cluster"
order: 3
blurb: "Why reviewing just before you forget — the forgetting curve — makes vocabulary stick efficiently."
keywords:
  - "spaced repetition"
  - "forgetting curve"
  - "Ebbinghaus"
  - "SRS"
  - "Anki spaced repetition"
  - "spacing effect"
faqs:
  - question: "How is spaced repetition different from cramming?"
    answer: "Cramming packs all your review into one session; it works for an imminent test but fades within days. Spaced repetition spreads reviews across widening intervals, timed to just before you forget. It takes less total time and produces memory that lasts months or years rather than hours."
  - question: "How many new cards should I add per day?"
    answer: "Start conservatively; ten to twenty is often plenty for a beginner, because each new card becomes a recurring review that stacks up fast. If your daily reviews are growing faster than you can clear them, lower the new-card rate. It is easier to raise it later than to dig out of a backlog."
  - question: "Which spaced-repetition app should I use?"
    answer: "Anki is the most widely used, free on most platforms, and well supported, and Lector exports mined cards straight to it. Whatever you pick, the algorithm matters less than showing up daily and rating honestly. Our Anki guide walks through setup."
---

Spaced repetition is a study technique that schedules each review of a fact for the moment you are about to forget it, then stretches the gap wider every time you recall it successfully. By working *with* the brain's natural forgetting instead of against it, it produces durable memory for the least possible effort, which is why it has become the standard tool for learning vocabulary.

## The forgetting curve

The idea rests on a discovery from 1885. In *Memory: A Contribution to Experimental Psychology*, Hermann Ebbinghaus reported the first rigorous experiments on human memory, testing his own recall of hundreds of nonsense syllables over varying delays. He found that forgetting is fast at first and then slows: much of what you learn slips away within hours or a day, after which the decline levels off. Plotted over time, that decay traces the famous **forgetting curve**.

Ebbinghaus noticed something else that matters just as much: reviewing material at spaced intervals produced far better retention than cramming it all at once. Each time you successfully recall something, the curve resets and the next round of forgetting is slower, so the memory decays less steeply than before. That is the **spacing effect**, one of the most reliably replicated findings in the study of learning, and it has held up across more than a century of research from Ebbinghaus's syllables to modern vocabulary studies.

## How an SRS schedules reviews

A spaced-repetition system (SRS) turns the spacing effect into a schedule. After you look at a card you rate how well you recalled it. Rate it easy and the system waits longer before showing it again; rate it hard, or fail, and it comes back sooner. Successful intervals grow roughly geometrically (a day, then a few days, then a week, a month, several months) so a card you know well might resurface only two or three times a year, while one you keep missing stays in heavy rotation.

The classic scheduling algorithm is **SM-2**, built for the SuperMemo software in the late 1980s, which gives each card an "ease" value that speeds up or slows down how fast its intervals grow. Modern tools refine this (Anki now defaults to a newer scheduler called FSRS that predicts your forgetting more precisely) but the principle is identical: review each item just before the forgetting curve would drop you below recall. You do not need to understand the algorithm to benefit from it; you rate each card honestly and let the scheduler do the arithmetic.

## Why it is efficient

Cramming works for tomorrow's test and fails for next month. Spaced practice is the opposite: it beats massed practice for long-term retention, one of the most robust results in memory research. The efficiency comes from timing. You are not re-reviewing words you already know solidly (a waste) nor discovering too late that you have forgotten them (expensive to relearn). You review each item near the edge of forgetting, which is where a review does the most good per minute spent; the trick is not more review but better-timed review. Scaled across thousands of words, that difference is the gap between a study routine that is sustainable and one that collapses under its own review load.

## Using it well

- **Do not over-add.** Every new card is a review you will owe every day for months. Adding hundreds in a burst of enthusiasm is the fastest way to a crushing backlog and a quit. Add steadily.
- **Be honest with your ratings.** The schedule is only as good as your grades. If you half-remembered a card, do not press "easy" to feel productive, or you will see it again too late.
- **Add words you have met in context.** Cards you [mine](/learn/what-is-sentence-mining/) from your own reading, kept in a full sentence, are far easier to recall than isolated words, and worth prioritising over ones you have never encountered.
- **Learn the common words first.** Ordering by [frequency](/learn/frequency-based-vocabulary/) means every card you drill is one you are likely to meet again soon, which reinforces it for free.
- **Show up daily.** The scheduler assumes you clear your due cards; skip days and the backlog compounds.

Spaced repetition is one gear in the wider [reading-first method](/learn/how-to-learn-a-language-by-reading/). This page is the "why"; for the hands-on "how", including installing Anki, choosing a deck, and building the daily habit, see our [getting started with Anki](/docs/anki/) guide, which we will not duplicate here.
