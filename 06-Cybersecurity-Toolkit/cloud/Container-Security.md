---
title: "Container Security"
description: "Securing container images, registries, runtimes, and hosts across the build-ship-run lifecycle."
domain: cybersecurity
category: cloud
type: concept
difficulty: intermediate
status: evergreen
tags: [containers, docker, devsecops]
prerequisites: [Operating-Systems]
related: [Kubernetes-Security, Supply-Chain-Security, Cloud-Security-Checklist]
order: 60
---

# Container Security

Hub: [[Security-Engineering-OS]]

## Mental model

A container is a process isolated by Linux **namespaces** (pid, net, mnt, uts, ipc, user) and constrained by **cgroups**, with extra hardening from capabilities, seccomp, and LSMs (AppArmor / SELinux). It shares the host kernel, so it is a weaker boundary than a VM.

## Build

- Minimal base images (distroless, slim, scratch where possible) reduce attack surface.
- Pin base images by digest; rebuild regularly for patches.
- Multi-stage builds so compilers and secrets do not land in the final image.
- Never bake secrets into layers (they persist in history even if deleted later).
- Scan images for CVEs (e.g., Trivy, Grype) and generate an SBOM.
- Run as a non-root `USER`.

```dockerfile
FROM golang:1.23 AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /app ./cmd/app

FROM gcr.io/distroless/static:nonroot
COPY --from=build /app /app
USER nonroot:nonroot
ENTRYPOINT ["/app"]
```

## Ship

- Private registry with access control; sign images (see [[Supply-Chain-Security]]).
- Admission control verifies signatures and scan results before deploy.

## Run

- Drop all capabilities, add back only what is needed.
- Read-only root filesystem; no `--privileged`; no host PID/network namespaces.
- Never mount the Docker socket into a container (equivalent to host root).
- Default seccomp profile at minimum.
- Resource limits to contain DoS.
- Runtime detection (e.g., Falco) for unexpected shells, sensitive file reads, outbound connections.

## Common escape paths to defend against

- Privileged containers or `CAP_SYS_ADMIN`.
- Mounted `docker.sock` or sensitive host paths.
- Kernel vulnerabilities (patch hosts; consider gVisor / Kata for untrusted workloads).

See also: [[Kubernetes-Security]].

## Interview questions

**Q: Is a container a security boundary?**
A: A weak one: containers share the host kernel. Use non-root, dropped capabilities, seccomp, read-only rootfs, and a sandbox runtime (gVisor, Kata) for untrusted code.

**Q: Why pin images by digest?**
A: Tags are mutable; a digest guarantees the exact bytes you scanned and signed are what runs.
