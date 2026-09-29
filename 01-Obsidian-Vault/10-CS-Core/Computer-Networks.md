---
title: Computer Networks
description: "Subject hub: layered stack, TCP/UDP, routing, congestion control, DNS, HTTP."
domain: cs-core
category: computer-networks
type: index
difficulty: intermediate
status: evergreen
tags: [cs-core, computer-networks]
prerequisites: []
related: [TCP-vs-UDP, DNS, HTTP-Evolution, IP-Routing, TCP-Congestion-Control]
---

# Computer Networks

Hub: [[CS-Core-Index]] · [[CS-Core-Curriculum]]

## Core Idea

Networking is a stack of layers, each solving one problem and trusting the layer below: physical delivery, host-to-host addressing, process-to-process transport, and application meaning. Almost every interview question here reduces to knowing which layer owns a problem and the tradeoff TCP vs UDP makes between reliability and latency.

## Details

### TCP/IP Layer Model

| Layer | Owns | Lives here |
|---|---|---|
| Application | Message semantics | HTTP, DNS, TLS, SSH, SMTP |
| Transport | Process-to-process delivery (ports) | TCP, UDP |
| Internet | Host-to-host routing across networks | IP, ICMP, routers |
| Link | Delivery on one local network segment | Ethernet, Wi-Fi, ARP, MAC addresses |

Key mental model: IP gets a packet to the right *machine*; ports get it to the right *process*; the application protocol says what the bytes *mean*.

### TCP vs UDP

- **TCP**: connection via 3-way handshake (SYN → SYN-ACK → ACK), sequence numbers, ACKs, retransmission of lost segments, in-order delivery, flow control (receiver window) and congestion control. You get a reliable byte stream; you pay a round trip to start and head-of-line blocking when a segment is lost.
- **UDP**: fire-and-forget datagrams. No handshake, no retransmission, no ordering. One packet in, zero or one packet out.
- **When each**: TCP for anything that must be complete and ordered (web pages, APIs, file transfer). UDP when latency beats completeness (video calls, games — a late frame is useless) or when you build your own reliability on top (QUIC, DNS with retry).

### HTTP/1.1 vs 2 vs 3

| | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Transport | TCP | TCP | QUIC over UDP |
| Requests per connection | One at a time (pipelining broken in practice) | Many, multiplexed as streams | Many, multiplexed |
| Head-of-line blocking | At HTTP level | Fixed at HTTP level, remains at TCP level | Gone (streams independent) |
| Format | Text | Binary frames, header compression (HPACK) | Binary, QPACK |
| Setup cost | TCP + TLS handshakes | Same | 1-RTT, 0-RTT on reconnect |

### DNS Resolution Walk

`www.example.com` → 1) check browser/OS cache; 2) ask the recursive resolver (ISP or 8.8.8.8); 3) resolver asks a **root** server → referred to `.com` **TLD** servers → referred to example.com's **authoritative** server → gets the A/AAAA record; 4) answer is cached at every step with a TTL. Recursive resolver does the legwork; iterative referrals happen between it and the hierarchy.

### Sockets Basics

A socket is the OS handle for one endpoint of a connection, identified by (protocol, local IP, local port, remote IP, remote port). Server: `socket → bind → listen → accept` (accept returns a *new* socket per client). Client: `socket → connect`. Then both `send`/`recv`.

```python
import socket
s = socket.create_connection(("example.com", 80))
s.sendall(b"GET / HTTP/1.1\r\nHost: example.com\r\n\r\n")
print(s.recv(4096)[:80])
```

### What Happens When You Type a URL

1. Browser parses the URL; checks its own and the OS DNS cache.
2. DNS resolution (walk above) yields the server IP.
3. TCP 3-way handshake with that IP on port 443.
4. TLS handshake: negotiate version/cipher, server proves identity with its certificate, keys established.
5. Browser sends the HTTP request; server responds (possibly via load balancer, CDN, app server, database).
6. Browser parses HTML, discovers CSS/JS/images, fires more requests (reusing or multiplexing connections).
7. Render: DOM + CSSOM → layout → paint. JS may re-trigger any of this.

Each step is a follow-up question in disguise — know one level deeper than you state.

## Interview Angle

- "TCP vs UDP?" — don't just say "reliable vs unreliable"; name the mechanisms (handshake, ACK + retransmit, ordering) and give a use case for each.
- "What happens when you type a URL?" — the interviewer is testing breadth and structure. Walk the numbered list; let them pick where to zoom in.
- "Why is HTTP/3 on UDP?" — because TCP's in-kernel, in-order delivery causes head-of-line blocking that HTTP/2 multiplexing can't escape; QUIC reimplements reliability per-stream in user space.
- "Where does TLS sit?" — between transport and application: on top of TCP, below HTTP.
- Know port numbers on sight: 80 HTTP, 443 HTTPS, 53 DNS, 22 SSH.

## Roadmap

1. Layering: link → IP → transport → application; encapsulation
2. [[TCP-vs-UDP]] — handshake, reliability, flow control, ports, sockets
3. [[IP-Routing]] — addressing, CIDR, longest-prefix match, link-state vs distance-vector, BGP
4. [[TCP-Congestion-Control]] — slow start, AIMD, fast retransmit, CUBIC, BBR
5. [[DNS]] — recursive vs authoritative, record types, caching and TTL
6. [[HTTP-Evolution]] — HTTP/1.1 → 2 → 3 (QUIC), head-of-line blocking
7. [[TLS-Handshake]] — where encryption sits
8. Capstone: narrate "what happens when you type a URL" at three depths (30 s, 3 min, 15 min)

## Key Concepts

Encapsulation · MTU and fragmentation · NAT · CIDR · ARP · three-way handshake · TIME_WAIT · sliding window · RTT · bandwidth-delay product · head-of-line blocking · anycast · TTL (IP hop limit vs DNS cache lifetime)

## More Interview Questions (with answers)

- **Flow control vs congestion control?** — Flow control protects the *receiver* (advertised window `rwnd`); congestion control protects the *network* (sender-side `cwnd`). The sender keeps at most `min(rwnd, cwnd)` unacknowledged bytes in flight.
- **Why does TIME_WAIT exist?** — The side that closes first waits 2×MSL so delayed segments from the old connection expire and a lost final ACK can be re-sent.
- **What does NAT break?** — End-to-end addressability: inbound connections need port forwarding or hole punching (STUN/TURN), and protocols that embed IPs in payloads need helpers.
- **What is the bandwidth-delay product?** — Bandwidth × RTT = bytes that must be in flight to keep the link full; a smaller window underutilizes it.

## Coding Exercises

- [ ] TCP echo server + client with sockets; then serve many clients (threads, then `select`/`asyncio`)
- [ ] UDP ping with timeouts and loss measurement
- [ ] Decode a DNS response by hand (header, question, answer) and check against `dig`
- [ ] Minimal HTTP/1.1 client over a raw socket: status line, headers, `Content-Length`
- [ ] Longest-prefix-match lookup using a binary trie

## Connections

- **System design** — L4 vs L7 load balancers, CDNs and anycast, keep-alive and connection pooling, timeouts and retries all rest on these mechanics.
- **Cybersecurity** — SYN floods, DNS cache poisoning, BGP hijacks, and TLS downgrades each attack a specific layer; see [[Network-Security]] and [[TLS-Handshake]].
- **AI** — distributed training is frequently network-bound (collective operations like all-reduce); streaming LLM responses ride on chunked HTTP or server-sent events.

## Related

- [[Operating-Systems]]
- [[Distributed-Systems]]
- [[Hash-Tables]]
- [[Concurrency-Basics]]
