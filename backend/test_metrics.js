import { gauges, counters, register } from "./src/cost/metrics.js";

async function runTest() {
  // Set some gauge values
  gauges.dailyArticles.set(150);
  gauges.dailyQuota.set(200);
  gauges.gnewsDaily.set(30);
  gauges.gnewsQuota.set(50);
  gauges.costSummaryINR.set(0.25);
  gauges.costTransINR.set(0.50);
  gauges.itemsPerHour.set(10);
  gauges.queueDepth.set(5);
  gauges.backlog.set(2);
  gauges.burstActive.set(1);
  gauges.freshnessP95m.set(60);
  gauges.sourceToday.set({ source: "rss" }, 100);
  gauges.sourceToday.set({ source: "gnews" }, 50);

  // Increment some counters
  counters.fetchReq.inc();
  counters.fetchReq.inc();
  counters.fetchErr.inc({ code: "NETWORK_ERROR" });
  counters.circuitOpen.inc();
  counters.dbTxFail.inc();
  counters.overrides.inc({ reason: "manual" });

  // Print Prometheus metrics
  console.log(await register.metrics());
}

runTest();