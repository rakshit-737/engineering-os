"""SSRF defense: validate user-supplied URLs before the server fetches them.

Threat: 'fetch this URL for me' features aimed at internal services
(cloud metadata endpoints, localhost admin panels, private ranges).
Principle: allowlist schemes, resolve the host, reject private/loopback/
link-local/reserved addresses. Validation only — no requests made here.

Production notes: re-check after redirects (attacker can 302 to internal),
and beware DNS rebinding — pin the resolved IP for the actual request.
"""

from __future__ import annotations

import ipaddress
import socket
from urllib.parse import urlparse

ALLOWED_SCHEMES = {"http", "https"}


class UnsafeUrlError(ValueError):
    pass


def validate_outbound_url(url: str, resolver=socket.getaddrinfo) -> str:
    parsed = urlparse(url)

    if parsed.scheme.lower() not in ALLOWED_SCHEMES:
        raise UnsafeUrlError(f"scheme not allowed: {parsed.scheme!r}")
    if not parsed.hostname:
        raise UnsafeUrlError("missing hostname")
    if parsed.username or parsed.password:
        raise UnsafeUrlError("credentials in URL not allowed")

    try:
        results = resolver(parsed.hostname, parsed.port or 80, proto=socket.IPPROTO_TCP)
    except socket.gaierror as exc:
        raise UnsafeUrlError(f"hostname does not resolve: {parsed.hostname}") from exc

    for family, _type, _proto, _canon, sockaddr in results:
        address = ipaddress.ip_address(sockaddr[0])
        if (
            address.is_private
            or address.is_loopback
            or address.is_link_local
            or address.is_reserved
            or address.is_multicast
            or address.is_unspecified
        ):
            raise UnsafeUrlError(f"resolves to blocked address space: {address}")

    return url


if __name__ == "__main__":
    def fake_resolver_for(ip: str):
        def resolver(_host, port, proto=0):
            return [(socket.AF_INET, socket.SOCK_STREAM, proto, "", (ip, port or 80))]
        return resolver

    ok = validate_outbound_url("https://example.com/page", resolver=fake_resolver_for("93.184.216.34"))
    assert ok.startswith("https://")

    blocked_cases = [
        ("file:///etc/passwd", "8.8.8.8"),
        ("http://169.254.169.254/latest/meta-data/", "169.254.169.254"),
        ("http://localhost:8080/admin", "127.0.0.1"),
        ("http://internal.corp/", "10.0.0.5"),
        ("http://user:pass@example.com/", "93.184.216.34"),
    ]
    for url, resolved_ip in blocked_cases:
        try:
            validate_outbound_url(url, resolver=fake_resolver_for(resolved_ip))
            raise AssertionError(f"should have blocked: {url}")
        except UnsafeUrlError:
            pass

    print("url_validation_ssrf: metadata/loopback/private targets blocked")
