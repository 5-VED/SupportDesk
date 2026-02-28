# OrbitDesk Infrastructure as Code (Terraform)

This directory contains the Terraform configuration to provision the AWS infrastructure required to run OrbitDesk on Kubernetes (EKS).

## 🏗 Architecture

- **Networking (VPC)**: Creates a new VPC, Public/Private subnets across 2 Availability Zones, Internet Gateway, and NAT Gateway.
- **Compute (EKS)**: Creates an Elastic Kubernetes Service (EKS) cluster and a Node Group with auto-scaling instances.

## 🚀 How to Run

### Prerequisites
1.  **Terraform CLI** installed (`terrafrom --version`).
2.  **AWS CLI** installed and configured (`aws configure`).

### Steps

1.  **Initialize Terraform**:
    Downloads the AWS and Kubernetes providers.
    ```bash
    terraform init
    ```

2.  **Review the Plan**:
    See exactly what resources will be created.
    ```bash
    terraform plan
    ```

3.  **Deploy**:
    Provision the infrastructure (this takes ~15-20 minutes).
    ```bash
    terraform apply
    ```

4.  **Connect to Cluster**:
    After deployment, configure your local `kubectl` to talk to the new cluster:
    ```bash
    aws eks --region us-east-1 update-kubeconfig --name orbitdesk-cluster-dev
    ```

## 🧹 Cleanup

To destroy all resources and avoid costs:
```bash
terraform destroy
```
