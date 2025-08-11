
import json
from kafka import KafkaConsumer

# Stubs for rolling average calculation
rolling_avg_cost = 100
rolling_avg_rss = 100

def main():
    consumer = KafkaConsumer(
        'metrics',
        bootstrap_servers=['localhost:9092'],
        value_deserializer=lambda m: json.loads(m.decode('ascii'))
    )

    for message in consumer:
        metric = message.value
        if metric['name'] == 'amogh_article_cost_inr_hourly':
            if metric['value'] >= 2 * rolling_avg_cost:
                print(f"ALERT: Cost spike detected! Hourly cost is {metric['value']}")
        elif metric['name'] == 'amogh_source_items_today' and metric['labels']['source'] == 'rss':
            if metric['value'] <= 0.5 * rolling_avg_rss:
                print(f"ALERT: RSS feed drop detected! RSS items today is {metric['value']}")

if __name__ == '__main__':
    main()
