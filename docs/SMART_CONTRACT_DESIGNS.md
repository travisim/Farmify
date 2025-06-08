# AgriTrust XRPL Smart Contract (Hook) Designs

This document outlines the designs for XRPL Hooks that will provide smart contract-like functionalities for the AgriTrust platform, as per `plan.MD`.

## 1. Investment Validation Hook

This Hook would be set on the farmer's project funding account (or a dedicated escrow account for the project if that architecture were chosen). Its primary role is to validate incoming investment payments.

**Hook Account:** Farmer's project-specific funding account.

**Trigger Transactions:** Incoming `Payment` transactions.

**Core Logic:**

1.  **Verify Payment Currency:**
    *   Check if the incoming payment `Amount` is an IOU.
    *   Check if the `currency` matches RLUSD (e.g., "524C555344000000000000000000000000000000" - hex for RLUSD).
    *   Check if the `issuer` matches the official RLUSD issuer address.
    *   If not RLUSD, reject the transaction.

2.  **Check Project Status:**
    *   Read a Hook State variable `ProjectStage`.
    *   If `ProjectStage` is not "Funding" (e.g., represented by an enum: 0 for Funding, 1 for Active, etc.), reject the transaction.

3.  **Validate Minimum Investment:**
    *   Read a Hook Parameter `MinimumInvestmentRLUSD` (stored in smallest units of RLUSD).
    *   If the incoming payment `Amount.value` is less than `MinimumInvestmentRLUSD`, reject the transaction.

4.  **Validate Funding Cap:**
    *   Read Hook Parameters `FundingGoalRLUSD` and a Hook State variable `CurrentFundingRLUSD`.
    *   If `CurrentFundingRLUSD + Amount.value` exceeds `FundingGoalRLUSD`, reject the transaction (or, more complexly, allow partial acceptance up to the goal, which is harder for a Hook to manage atomically with the payment). A simpler approach is to reject if the incoming amount would cause an overfund.

5.  **Update Current Funding (If Accepted):**
    *   If all checks pass, update the Hook State variable: `CurrentFundingRLUSD = CurrentFundingRLUSD + Amount.value`.
    *   Accept the transaction.

**Hook Parameters (Set at Hook deployment/update):**

*   `p_rlusd_issuer` (AccountID): The official RLUSD issuer address.
*   `p_rlusd_currency_hex` (String/Hex): The hex code for RLUSD currency.
*   `p_project_stage_funding_enum` (Integer): Enum value representing the "Funding" stage.
*   `p_min_investment_units` (Integer): Minimum investment allowed, in smallest units of RLUSD.
*   `p_funding_goal_units` (Integer): Total funding goal, in smallest units of RLUSD.

**Hook State Variables (Managed by the Hook):**

*   `s_current_funding_units` (Integer): The total amount funded so far, in smallest units of RLUSD. Initialized to 0.
*   `s_project_stage_current_enum` (Integer): Current stage of the project. Initialized to `p_project_stage_funding_enum`. This could be updated by an authorized admin transaction via another Hook or a specific transaction type.

**Error Handling:**
The Hook should use appropriate `reject()` calls with distinct error messages or codes for different failure reasons.

## 2. Settlement Authorization & Distribution Validation Hook (Conceptual)

This is more complex and might be split or simplified. The goal is to add on-chain control to the settlement and distribution process managed by the backend `SettlementService`.

**Hook Account:** Farmer's project-specific funding account (where revenue might arrive and from which payouts are made).

### Part A: Authorizing the Distribution Phase

**Trigger Transaction:** Incoming `Payment` transaction from a designated Admin/Platform account.

**Core Logic:**

1.  **Verify Sender:**
    *   Check if `Transaction.Account` matches `p_admin_account`.
2.  **Verify Memo:**
    *   Check if the transaction `Memos` array contains a specific `MemoType` (e.g., hex for "AGRITRUST_AUTHORIZE_DISTRO") and `MemoData` containing the `ProjectNFTokenID` and `VerifiedTotalRevenueRLUSD`.
3.  **Update State:**
    *   If valid, set Hook State `s_distribution_authorized = true`.
    *   Set Hook State `s_verified_revenue_units = VerifiedTotalRevenueRLUSD` (from MemoData).
    *   Set Hook State `s_project_stage_current_enum` to a "DistributionActive" enum.
    *   Accept the transaction.
4.  Else, reject.

**Hook Parameters (Part A):**

*   `p_admin_account` (AccountID): Address of the admin/platform account authorized to trigger distribution.

**Hook State Variables (Part A):**

*   `s_distribution_authorized` (Boolean): Initially `false`.
*   `s_verified_revenue_units` (Integer): Stores the total verified revenue.

### Part B: Validating Outgoing Payouts (Simplified)

**Trigger Transaction:** Outgoing `Payment` transactions in RLUSD from the Hook Account.

**Core Logic:**

1.  **Check Distribution Authorization:**
    *   If Hook State `s_distribution_authorized` is `false`, reject the transaction (unless it's a payment to a pre-authorized platform fee account, which adds complexity).
2.  **Validate Payout Consistency (Simplified):**
    *   Read Hook State `s_paid_out_units`.
    *   If `s_paid_out_units + Amount.value` exceeds `s_verified_revenue_units`, reject the transaction.
    *   Update `s_paid_out_units += Amount.value`.
    *   Accept the transaction.
    *   *Note:* This is a simplified validation. A more robust Hook would need access to the approved distribution plan (investor addresses, farmer share, platform share) which is complex to store and manage entirely within Hook state for many payees. The backend `SettlementService` is better suited for orchestrating the individual payouts based on the verified revenue. The Hook here acts more as a guard to ensure payouts don't exceed verified revenue and only happen when authorized.

**Hook State Variables (Part B):**

*   `s_paid_out_units` (Integer): Tracks total RLUSD paid out during this distribution phase.

**Considerations for Distribution Hook:**

*   **Complexity:** Managing a full distribution list (many payees and amounts) on-chain within Hook state is difficult due to storage and computation limits.
*   **Practical Approach:** The backend `SettlementService` (already implemented) is more practical for calculating and initiating the batch of individual RLUSD payments. The Hook's role would be to:
    *   Enable the distribution phase via an admin trigger (Part A).
    *   Potentially validate that total payouts orchestrated by the backend do not exceed the verified revenue (Part B, simplified).
*   The `plan.MD` (Section 8.5) already describes an "Automated Profit Distribution System" which implies backend logic. The Hook adds an on-chain control/validation layer.

## 3. Project Stage Update Hook (Admin Controlled)

This Hook allows an authorized admin to update the `s_project_stage_current_enum` state variable in the Investment Validation Hook (or a shared state location if Hooks can access common state, which is typically per-account).

**Hook Account:** Farmer's project-specific funding account (same as Investment Validation Hook).

**Trigger Transaction:** Incoming `Payment` transaction from a designated Admin/Platform account.

**Core Logic:**

1.  **Verify Sender:**
    *   Check if `Transaction.Account` matches `p_admin_account`.
2.  **Verify Memo:**
    *   Check for a specific `MemoType` (e.g., hex for "AGRITRUST_SET_STAGE") and `MemoData` containing the `NewStageEnum`.
3.  **Update State:**
    *   If valid, update Hook State `s_project_stage_current_enum = NewStageEnum`.
    *   Accept the transaction.
4.  Else, reject.

**Hook Parameters:**

*   `p_admin_account` (AccountID): Address of the admin/platform account.

**Hook State Variables:** (Uses `s_project_stage_current_enum` from Investment Validation Hook)

---

**Implementation Notes:**

*   The actual Hook code would be written in C, Rust, or AssemblyScript, compiled to WASM, and then converted to a hex string for the `CreateCode` field in the `SetHook` transaction.
*   The `HookService` (`lib/hook.ts`) is responsible for deploying these compiled Hooks and setting their parameters.
*   Interaction with these Hooks (e.g., an admin triggering a stage change) would be done by constructing and sending specific transactions (likely via backend API calls that use the `xrpl.js` client).

This design document provides the logical framework for the smart contracts (Hooks) required by the platform.