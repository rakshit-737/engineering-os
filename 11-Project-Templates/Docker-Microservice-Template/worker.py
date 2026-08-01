"""Background worker with graceful shutdown, JSON logging, and heartbeat.

Stdlib only. Replace fetch_job/process_job with real queue + business logic.
"""

from __future__ import annotations

import json
import logging
import os
import random
import signal
import sys
import time
from pathlib import Path

HEARTBEAT_FILE = Path(os.environ.get("HEARTBEAT_FILE", "/tmp/worker-heartbeat"))
POLL_INTERVAL_SECONDS = float(os.environ.get("POLL_INTERVAL_SECONDS", "2"))

_shutdown_requested = False


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "ts": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
            "level": record.levelname,
            "msg": record.getMessage(),
            "logger": record.name,
        }
        if record.exc_info:
            payload["exc"] = self.formatException(record.exc_info)
        return json.dumps(payload)


def build_logger() -> logging.Logger:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    logger = logging.getLogger("worker")
    logger.setLevel(os.environ.get("LOG_LEVEL", "INFO").upper())
    logger.addHandler(handler)
    return logger


def request_shutdown(signum: int, _frame: object) -> None:
    global _shutdown_requested
    _shutdown_requested = True


def write_heartbeat() -> None:
    try:
        HEARTBEAT_FILE.write_text(str(int(time.time())))
    except OSError:
        pass  # heartbeat is best-effort; never crash the worker for it


def fetch_job() -> dict | None:
    """Stub job source. Replace with queue pop / DB poll / API pull."""
    if random.random() < 0.5:
        return {"id": random.randint(1000, 9999), "kind": "demo"}
    return None


def process_job(job: dict, logger: logging.Logger) -> None:
    """Stub processor. Replace with real business logic. Keep idempotent."""
    logger.info(f"processing job {job['id']} kind={job['kind']}")
    time.sleep(0.2)


def main() -> int:
    logger = build_logger()
    signal.signal(signal.SIGTERM, request_shutdown)
    signal.signal(signal.SIGINT, request_shutdown)

    logger.info("worker started")
    processed = 0

    while not _shutdown_requested:
        write_heartbeat()
        job = fetch_job()
        if job is None:
            time.sleep(POLL_INTERVAL_SECONDS)
            continue
        try:
            process_job(job, logger)
            processed += 1
        except Exception:
            logger.exception(f"job {job.get('id')} failed")
            # Real systems: retry with backoff, then dead-letter.

    logger.info(f"shutdown complete, processed={processed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
