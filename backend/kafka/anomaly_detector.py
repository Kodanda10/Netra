# Stub: wire to your Kafka topics; prints alerts on spikes
import time, random

def rolling_avg(xs): return sum(xs) / max(1, len(xs))
cost_window = []
rss_window = []

while True:
    cost = 10 + random.random() * 5
    rss = 60 + random.random() * 20
    cost_window = (cost_window + [cost])[-20:]
    rss_window  = (rss_window + [rss])[-20:]
    if len(cost_window) >= 5 and cost > 2 * rolling_avg(cost_window[:-1]):
        print("ALERT cost spike >=2x rolling avg")
    if len(rss_window) >= 5 and rss < 0.5 * rolling_avg(rss_window[:-1]):
        print("ALERT RSS drop >=50% from rolling avg")
    time.sleep(5)