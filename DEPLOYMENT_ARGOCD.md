# OrbitDesk Kubernetes Deployment with ArgoCD

This guide details how to deploy the OrbitDesk backend and associated services to a Kubernetes cluster using ArgoCD for a GitOps workflow. This approach ensures your deployment state is declarative and version-controlled.

## 1. Prerequisites

Before starting, ensure you have the following installed and configured:

- **Kubernetes Cluster**: A running cluster (Minikube, Kind, EKS, GKE, etc.).
- **kubectl**: CLI tool configured to communicate with your cluster.
- **ArgoCD**: Should be installed in your cluster. If not, follow step 3.
- **Git Repository**: Where your `K8s/` manifests are stored (this repository).
- **Docker Image**: Ensure your backend image is pushed to a container registry (e.g., Docker Hub, ECR, GCR) or loaded into your cluster (Minikube).
  - Example image: `orbitdesk-backend:latest`

## 2. Prepare Kubernetes Manifests

The `K8s/` directory contains standard Kubernetes manifests. To simplify deployment with ArgoCD, we recommend creating a `kustomization.yaml` file in the root of the `K8s/` directory. This aggregates all resources for ArgoCD to sync.

### Create `K8s/kustomization.yaml`

Create a file named `kustomization.yaml` inside the `K8s/` directory with the following content:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  # Base Setup
  - namespace.yaml
  - secrets.yaml
  - configmap.yaml
  
  # Dependencies
  - mongodb/statefulset.yaml # Create if missing, or use Helm
  - mongodb/service.yaml
  - kafka/ # Point to Kafka manifests directory
  - zookeeper/ # Point to Zookeeper manifests directory

  # Application Services
  - backend/deployment.yml
  - backend/service.yml
  - frontend/deployment.yaml # Assuming existed or created
  - frontend/service.yaml
  - notification-service/deployment.yaml # Assuming existed or created
  
  # Ingress
  - ingress.yaml
```

**Note:** Ensure all referenced files exist. If using Helm charts for dependencies like MongoDB/Kafka, you can manage them separately or via ArgoCD Applications. For simplicity, this guide assumes raw manifests or `kustomization.yaml`.

## 3. Install ArgoCD (If not already installed)

If you haven't installed ArgoCD yet, run:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Wait for all pods to be ready:
```bash
kubectl wait --for=condition=Ready pods --all -n argocd
```

## 4. Connect Private Repository (Optional)

If your Git repository is private, you need to add credentials to ArgoCD.

1.  **Generate SSH Key** or **Access Token**.
2.  **Add to ArgoCD**:
    *   **Via CLI**: `argocd repo add <REPO_URL> --username <USER> --password <TOKEN>`
    *   **Via UI**: Settings > Repositories > Connect Repo using HTTPS/SSH.

## 5. Define ArgoCD Application

Create a file named `argocd-app.yaml` (can be stored outside the synced path or in a separate `argo-apps` directory) to tell ArgoCD fast to deploy your app.

**File: `argocd-app.yaml`**

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: orbitdesk-backend     # Application name in ArgoCD
  namespace: argocd           # ArgoCD namespace
spec:
  project: default            # Project name
  source:
    repoURL: 'https://github.com/YourUsername/OrbitDesk.git'  # UPDATE THIS URL
    targetRevision: HEAD      # Branch to track (e.g., main, master)
    path: K8s                 # Path to your manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: orbitdesk      # Namespace to deploy into
  syncPolicy:
    automated:
      prune: true             # Delete resources confusingly removed from Git
      selfHeal: true          # Fix drift automatically
    syncOptions:
      - CreateNamespace=true  # Auto-create the 'orbitdesk' namespace
```

### Apply the Application

Run this command to register the application with ArgoCD:

```bash
kubectl apply -f argocd-app.yaml
```

## 6. Access ArgoCD UI

1.  **Port Forward** the ArgoCD server:
    ```bash
    kubectl port-forward svc/argocd-server -n argocd 8080:443
    ```

2.  **Open Browser**: Go to `https://localhost:8080` (ignore SSL warning).
3.  **Login**:
    *   **Username**: `admin`
    *   **Password**: Get the initial password:
        ```bash
        kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
        ```

## 7. Verify Deployment & Troubleshooting

### In ArgoCD UI
- Navigate to the **orbitdesk-backend** application.
- Click **Sync** if it's not Auto-Synced.
- Observe the resource tree. Green hearts mean healthy.

### Debugging with CLI
- **Check Application Status**:
  ```bash
  argocd app get orbitdesk-backend
  ```
- **Check Pods**:
  ```bash
  kubectl get pods -n orbitdesk
  ```
- **View Logs**:
  ```bash
  kubectl logs -l app=backend -n orbitdesk
  ```

## 8. GitOps Workflow

To update your application (e.g., new image version):

1.  **Update Manifest**: Edit `K8s/backend/deployment.yml` to use the new image tag.
    ```yaml
    image: orbitdesk-backend:v1.0.1
    ```
2.  **Commit & Push**:
    ```bash
    git add K8s/backend/deployment.yml
    git commit -m "Update backend to v1.0.1"
    git push origin main
    ```
3.  **ArgoCD Sync**: ArgoCD will detecting the change (within 3 minutes by default) and update the deployment automatically. You can also manually "Refresh" in the UI for instant updates.
