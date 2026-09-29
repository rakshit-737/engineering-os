---
title: "Kubernetes Security"
description: "Kubernetes RBAC, Pod Security Standards, network policies, secrets handling, and control-plane hardening."
domain: cybersecurity
category: cloud
type: concept
difficulty: advanced
status: evergreen
tags: [kubernetes, containers, rbac, cloud]
prerequisites: [Container-Security]
related: [IAM-Deep-Dive, Zero-Trust, Cloud-Security-Checklist]
order: 70
---

# Kubernetes Security

Hub: [[Security-Engineering-OS]]

## Attack surface

API server, etcd, kubelet, workloads, service account tokens, container images, and the cloud IAM the cluster integrates with.

## RBAC

- Objects: `Role` (namespaced) / `ClusterRole` (cluster-wide) define verbs on resources; `RoleBinding` / `ClusterRoleBinding` bind them to users, groups, or ServiceAccounts.
- RBAC is additive: there are no deny rules.
- Dangerous permissions: `*` verbs, `create pods` (can mount any SA in namespace), `get secrets`, `escalate`, `bind`, `impersonate`, `nodes/proxy`, `create` on `pods/exec`.
- Avoid binding `cluster-admin` broadly; audit with `kubectl auth can-i --list --as=system:serviceaccount:ns:sa`.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata: {name: pod-reader, namespace: app}
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata: {name: read-pods, namespace: app}
subjects:
- kind: ServiceAccount
  name: monitor
  namespace: app
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

## Service accounts

- Set `automountServiceAccountToken: false` where pods do not call the API.
- Modern clusters use projected, time-bound tokens.
- For cloud access, use workload identity (e.g., EKS Pod Identity / IRSA) instead of node-level credentials.

## Pod Security Standards

Three profiles enforced by the built-in **Pod Security Admission** controller via namespace labels:

- **Privileged**: unrestricted.
- **Baseline**: blocks known privilege escalations (privileged, hostPath, host namespaces, dangerous capabilities).
- **Restricted**: baseline plus non-root, drop ALL capabilities, seccomp RuntimeDefault, no privilege escalation.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: app
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/warn: restricted
```

For custom rules use a policy engine (Kyverno, OPA Gatekeeper, or ValidatingAdmissionPolicy).

## Network policies

- Default: all pods can talk to all pods. NetworkPolicy is only enforced if the CNI supports it.
- Start with default-deny per namespace, then allow required flows.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: {name: default-deny, namespace: app}
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
```

Remember to allow DNS egress after default-deny.

## Secrets

- Kubernetes Secrets are base64-encoded, not encrypted, by default. Enable **encryption at rest** for etcd (KMS provider preferred).
- Restrict `get/list secrets` via RBAC; `list` reveals contents.
- Consider external secret stores (cloud secrets manager + CSI driver / External Secrets).
- Prefer mounting as files over env vars (env leaks into crash dumps and child processes).

## Control plane and nodes

- API server not public, or restricted by IP; anonymous auth off; audit logging on.
- Kubelet authn/authz enabled; no read-only port.
- etcd TLS and restricted access.
- Keep versions supported; patch nodes.
- Block pod access to cloud metadata endpoint where not needed.

See also: [[Container-Security]], [[Kubernetes-Security]] checklist items in [[Cloud-Security-Checklist]].
