# OrbitDesk: Organizations vs. Groups

This document provides examples and definitions to clarify the difference between **Organizations** and **Groups** within the OrbitDesk system.

---

## 1. Groups (Internal Teams)
**Groups** are collections of **your support agents**. They represent the internal departments or teams within your company that handle tickets.

### Purpose
*   To route tickets to the right experts.
*   To organize agents based on their skills or responsibilities.
*   To manage ticket assignment and visibility.

### Examples

#### A. By Department
*   **Billing & Finance:** Handles invoices, refunds, plan upgrades, and payment failure issues.
    *   *Agents:* Alice (Accountant), Bob (Finance Manager)
*   **Technical Support:** Handles software bugs, installation issues, and error messages.
    *   *Agents:* Charlie (Dev), Dave (QA)
*   **Sales:** Handles pre-sales questions, demo requests, and enterprise quotes.
    *   *Agents:* Eve (Sales Rep), Frank (Account Executive)

#### B. By Tier (Escalation Levels)
*   **L1 Support (Triage):** First line of defense. Handles password resets, basic FAQs, and routing tickets.
*   **L2 Support (Advanced):** Handles complex configuration issues and non-critical bugs.
*   **L3 Engineering:** Developers who fix code-level bugs and perform database operations.

#### C. By Platform
*   **Mobile Support:** Specialists in iOS and Android app issues.
*   **Web Dashboard:** Specialists in the browser-based application.

---

## 2. Organizations (External Customers)
**Organizations** are collections of **your end-users (customers)**. They represent the companies or entities that you are providing support to.

### Purpose
*   To group all users from a single client company together.
*   To allow customers to see tickets raised by their colleagues (shared visibility).
*   To apply special SLA policies or VIP treatment to specific high-value clients.
*   To automatically map users based on email domains (e.g., `@nike.com`).

### Examples

#### A. Enterprise Client
*   **Organization Name:** **Nike**
*   **Domains:** `nike.com`, `nike.net`
*   **Users (Your Customers):**
    *   *phil@nike.com* (CEO - VIP)
    *   *store.manager@nike.com* (Regional Manager)
    *   *design@nike.com* (Employee)
*   **Use Case:** If the Regional Manager reports a login issue, the CEO can log in to the portal and see that a ticket is already open, avoiding duplicate reports.

#### B. Small Business Client
*   **Organization Name:** **Joe's Pizza Chains**
*   **Domains:** `joespizza.com`
*   **Users:**
    *   *joe@joespizza.com* (Owner)
    *   *manager@joespizza.com* (Manager)
*   **Use Case:** You can set a note on this organization: *"Always ask for store location ID"*, so agents know what effective info to gather.

#### C. Educational Institution
*   **Organization Name:** **Harvard University**
*   **Domains:** `harvard.edu`
*   **Users:**
    *   *prof.smith@harvard.edu* (Professor)
    *   *admin@harvard.edu* (IT Admin)
*   **Use Case:** You might apply a specific SLA policy (e.g., "Academic Response Time") to this organization differently than your corporate clients.

---

## Summary Comparison

| Feature | **Groups** | **Organizations** |
| :--- | :--- | :--- |
| **Who is in it?** | **Your Agents** (Employees) | **Your Customers** (End Users) |
| **Purpose** | Internal routing & teamwork | External client management & grouping |
| **Example Name** | "Billing Dept" | "Coca-Cola" |
| **Key Attribute** | Skill / Responsibility | Email Domain / Company Contract |
