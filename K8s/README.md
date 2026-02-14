# OrbitDesk Kubernetes Deployment Guide

This directory contains the Kubernetes manifests required to deploy the OrbitDesk application stack.

## 📦 Prerequisites

1. **Kubernetes Cluster** (Minikube, Kind, EKS, GKE, etc.)
2. **kubectl** CLI tool configured.
3. **Docker Images**: Ensure `orbitdesk-backend:latest`, `orbitdesk-frontend:latest`, and `orbitdesk-notification-service:latest` are built and available in your registry (or locally if using Minikube).

## 🚀 Deployment Order

Follow this specific order to ensure dependencies are met.

### 1. Create Namespace & Configuration
```bash
kubectl apply -f namespace.yaml
# EDIT secrets.yaml with real passwords before applying!
kubectl apply -f secrets.yaml
kubectl apply -f configmap.yaml
```

### 2. Deploy Storage Layer (Stateful Services)
```bash
kubectl apply -f mongodb.yaml
kubectl apply -f zookeeper.yaml
kubectl apply -f kafka.yaml
```
*Wait for these pods to be `Running` before proceeding.*

### 3. Deploy Application Services
```bash
kubectl apply -f backend.yaml
kubectl apply -f notification-service.yaml
kubectl apply -f frontend.yaml
```

### 4. Expose Services
```bash
kubectl apply -f ingress.yaml
```

## 🛠 Troubleshooting

- **Check Pod Status:** `kubectl get pods -n orbitdesk`
- **View Logs:** `kubectl logs <pod-name> -n orbitdesk`
- **Port Forwarding (for local testing without Ingress):**
  - Frontend: `kubectl port-forward svc/frontend-svc 8080:80 -n orbitdesk`
  - Backend: `kubectl port-forward svc/backend-svc 5000:5000 -n orbitdesk`
