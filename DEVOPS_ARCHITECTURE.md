# 🏗️ OrbitDesk System Architecture & DevOps Flow

This document outlines the high-level system architecture and infrastructure design for OrbitDesk, including the Kubernetes cluster topology, data flow, and external integrations.

## 🌟 Architecture Diagram

```mermaid
graph TB
    %% Styles
    classDef client fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef aws fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:white;
    classDef k8s fill:#326CE5,stroke:#333,stroke-width:2px,color:white;
    classDef pod fill:#e1f5fe,stroke:#0277bd,stroke-width:2px;
    classDef db fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef event fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef ext fill:#eceff1,stroke:#546e7a,stroke-width:2px,stroke-dasharray: 5 5;

    %% Client Layer
    User([👤 User / Browser]) ::: client
    DevOps([👷 DevOps Engineer]) ::: client

    %% External Services
    subgraph External_World ["🌐 External World"]
        SMTP[📧 SMTP Server<br/>(Gmail/SendGrid)] ::: ext
        3rdParty[🔗 3rd Party APIs<br/>(IPInfo, OpenCage)] ::: ext
    end

    %% AWS Cloud Infrastructure
    subgraph AWS ["☁️ AWS Cloud Region (us-east-1)"]
        direction TB
        
        %% Terraform Infrastructure
        subgraph VPC ["🔒 VPC (10.0.0.0/16)"]
            
            %% Kubernetes Cluster
            subgraph EKS ["☸️ EKS Cluster: orbitdesk-cluster"]
                direction TB
                
                %% Ingress Layer
                Ingress[🔀 Nginx Ingress Controller] ::: k8s
                
                %% Application Namespace
                subgraph Namespace ["Namespace: orbitdesk"]
                    direction TB
                    
                    %% Frontend
                    Frontend[🖥️ Frontend Svc<br/>(React + Nginx)] ::: pod
                    
                    %% Backend
                    Backend[⚙️ Backend Svc<br/>(Node.js/Express)] ::: pod
                    
                    %% Notification Service
                    Notification[🔔 Notification Svc<br/>(Node.js/TS)] ::: pod
                    
                    %% Event Bus (Kafka)
                    subgraph EventBus ["📨 Event Bus"]
                        Kafka[Apache Kafka] ::: event
                        Zookeeper[Zookeeper] ::: event
                    end
                    
                    %% Database
                    Mongo[(🗄️ MongoDB<br/>Primary & Secondaries)] ::: db
                end
            end
            
            %% Networking
            NAT[NAT Gateway] ::: aws
            IGW[Internet Gateway] ::: aws
        end
    end

    %% Connections - Flow
    User -->|HTTPS/443| IGW
    IGW -->|Route| Ingress
    
    %% Ingress Routing
    Ingress -->|/api/*| Backend
    Ingress -->|/*| Frontend
    
    %% Internal Comms
    Frontend -->|REST API/Axios| Backend
    Backend -->|Read/Write| Mongo
    Backend -->|Produce Events| Kafka
    
    %% Event Driven Architecture
    Kafka -->|Consume Events| Notification
    Notification -->|Read Profiles| Mongo
    Notification -->|Send Email| SMTP
    
    %% External Calls
    Backend -->|Geocoding| 3rdParty
    
    %% Devops Flow
    DevOps -->|Terraform Apply| AWS
    DevOps -->|Kubectl Apply| EKS
    
    %% Networking dependencies
    EKS -.->|Outbound| NAT
    NAT -.-> IGW

```

## 🛠 Component Breakdown

### 1. Ingress Layer
- **Nginx Ingress Controller**: Entry point for all traffic.
- **Routing Rules**:
  - `orbitdesk.com/` → **Frontend Service**
  - `orbitdesk.com/api/*` → **Backend Service**

### 2. Application Services
- **Frontend**: React 19 SPA served via Nginx. Stateless.
- **Backend**: Node.js Express API. Handles business logic, auth, and DB interactions.
- **Notification Service**: TypeScript microservice. Listens to Kafka topics (`ticket-created`, `user-signup`, `sla-breach`) and dispatches emails.

### 3. Data & State
- **MongoDB**: Primary data store for Users, Tickets, and Organizations. Deployed as a StatefulSet with Persistent Volume Claims (PVC).
- **Kafka & Zookeeper**: Asynchronous message broker for decoupling services. Ensures reliability in notification delivery.

### 4. Infrastructure (Terraform)
- **VPC Module**: Creates a secure network with Public (ALB/Ingress) and Private (Nodes) subnets.
- **EKS Module**: Provisions the Control Plane and Worker Nodes.

## 🔄 Data Flow Example: New Ticket Configuration

1. **User** submits ticket via Frontend.
2. **Frontend** POSTs data to `Backend API`.
3. **Backend** saves Ticket to **MongoDB**.
4. **Backend** produces a `TicketCreated` event to **Kafka**.
5. **Backend** responds to User "Ticket Created".
6. **Notification Service** consumes `TicketCreated` event.
7. **Notification Service** fetches valid templates and user email.
8. **Notification Service** sends email via **SMTP**.
