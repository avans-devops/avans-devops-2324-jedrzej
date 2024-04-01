FROM prom/prometheus:latest AS builder

COPY ./prometheus.yml /tmp/prometheus.yml

FROM prom/prometheus:latest

COPY --from=builder /tmp/prometheus.yml /etc/prometheus/prometheus.yml

EXPOSE 9090
CMD ["--web.enable-lifecycle", "--config.file=/etc/prometheus/prometheus.yml"]
