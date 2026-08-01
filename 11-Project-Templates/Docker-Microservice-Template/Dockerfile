FROM python:3.12-slim

RUN useradd --create-home --shell /usr/sbin/nologin worker
WORKDIR /srv/worker

COPY worker.py .

USER worker

ENV HEARTBEAT_FILE=/tmp/worker-heartbeat

# Healthy = heartbeat written within last 30s.
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD python -c "import os,time,sys; p=os.environ['HEARTBEAT_FILE']; sys.exit(0 if time.time()-int(open(p).read())<30 else 1)"

# STOPSIGNAL default is SIGTERM; worker traps it for graceful shutdown.
CMD ["python", "worker.py"]
