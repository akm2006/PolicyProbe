export const HARNESS_PR_URL =
  "https://github.com/hedera-dev/hedera-harness/compare/dev...manovHacksaw:hedera-harness:policyprobe/deterministic-onchain-postconditions";
export const REPO_URL = "https://github.com/manovHacksaw/PolicyProbe";
export const DIAMOND_ADDRESS = "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a";

export const hashscanTx = (hash: string) => `https://hashscan.io/testnet/transaction/${hash}`;
export const hashscanAddress = (address: string) => `https://hashscan.io/testnet/address/${address}`;

export const stats = [
  { value: "6/6", label: "ATS policies verified" },
  { value: "0.00%", label: "false positives" },
  { value: "1.4s", label: "consensus resolution" },
  { value: "277/277", label: "Harness tests green" },
  { value: "0", label: "LLM tokens to evaluate" },
];

export const pipelineSteps = [
  {
    number: "I",
    title: "Declare",
    description: "State the required onchain outcome in the recipe.",
    file: "spec.yaml",
    code: `expect:\n  transactionOutcome: "mustRevert"\n  errorCode: "0x5a18a961"`,
  },
  {
    number: "II",
    title: "Execute",
    description: "Ephemeral testnet actors broadcast a real transaction.",
    file: "execute.ts",
    code: `const tx = await contract\n  .connect(bob)\n  .transfer(alice, 100);`,
  },
  {
    number: "III",
    title: "Observe",
    description: "Read the actual result from the Hedera Mirror Node.",
    file: "mirror.http",
    code: `GET /api/v1/contracts/results/\n  0x42c9a1...ede0d1b976`,
  },
  {
    number: "IV",
    title: "Compare",
    description: "Pure TypeScript comparison. No LLM in the loop.",
    file: "evaluate.ts",
    code: `if (expected !== observed) {\n  emitFinding(assertionId);\n}`,
  },
  {
    number: "V",
    title: "Repair",
    description: "Mismatches become structured findings the agent can fix.",
    file: "promptBuilder.ts",
    code: `promptBuilder.injectFinding({\n  category: "compliance-leak"\n});`,
  },
];

export interface PolicyCase {
  key: string;
  label: string;
  id: string;
  name: string;
  category: string;
  scenario: string;
  expected: "mustRevert" | "mustSucceed";
  observedStatus: string;
  verdict: "PASS" | "FAIL";
  actor: string;
  txHash: string;
  contract: string;
  consensusTimestamp: string;
  gasUsed: number;
  findingPayload?: Record<string, string>;
}

export const sandboxCases: PolicyCase[] = [
  {
    key: "PP-001-FAIL",
    label: "Unhardened leak",
    id: "PP-FINDING-017",
    name: "reject-unverified-transfer (Unhardened)",
    category: "KYC Compliance Leak",
    scenario: "Unverified investor Bob (KYC=false) attempts transfer of 100 BOND",
    expected: "mustRevert",
    observedStatus: "SUCCESS (Status 200, Exit 0)",
    verdict: "FAIL",
    actor: "0x7856...9360 (Bob, Unverified)",
    txHash: "0x42c9a1e96c61008006a0f7a3d2c381dc883ef1089ba6790d26dda1ede0d1b976",
    contract: "0xeff72A1F8CE6d2a45d045d6540c7499690d79669",
    consensusTimestamp: "1773173730.000000000",
    gasUsed: 46219,
    findingPayload: {
      findingId: "PP-FINDING-017",
      rule: "reject-unverified-transfer",
      targetContract: "0xeff72A1F8CE6d2a45d045d6540c7499690d79669",
      expectedOutcome: "mustRevert",
      observedOutcome: "SUCCESS (200)",
      actor: "Bob (KYC = false)",
      leakDetected: "+100 BOND credited to unauthorized recipient",
      actionableFix: "Enforce KYC_CONTROL_LIST modifier in AccessControlFacet before transfer",
      injectedTo: "promptBuilder.ts",
    },
  },
  {
    key: "PP-001-PASS",
    label: "Hardened KYC",
    id: "PP-001",
    name: "reject-unverified-transfer (Hardened)",
    category: "KYC Enforcement",
    scenario: "Unverified investor Bob attempts transfer on hardened ATS diamond",
    expected: "mustRevert",
    observedStatus: "CONTRACT_REVERT_EXECUTED (0x5a18a961)",
    verdict: "PASS",
    actor: "0x7856...9360 (Bob, Unverified)",
    txHash: "0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a",
    contract: DIAMOND_ADDRESS,
    consensusTimestamp: "1773173740.104284003",
    gasUsed: 27810,
  },
  {
    key: "PP-002",
    label: "Compliant transfer",
    id: "PP-002",
    name: "permit-compliant-transfer",
    category: "Authorized Flow",
    scenario: "Compliant transfer between verified Alice and verified Bob",
    expected: "mustSucceed",
    observedStatus: "SUCCESS (Status 200)",
    verdict: "PASS",
    actor: "Alice (0x6378...1206) → Bob (0x7856...9360)",
    txHash: "0x34fd282cf21fb9d95be5dca8d8108ae532a81907cb5cf5cbca9387a385f8f828",
    contract: DIAMOND_ADDRESS,
    consensusTimestamp: "1773173752.549219001",
    gasUsed: 53180,
  },
  {
    key: "PP-003",
    label: "Sanctioned freeze",
    id: "PP-003",
    name: "reject-frozen-transfer",
    category: "Sanctions / Frozen",
    scenario: "Sanctioned investor Carol attempts transfer while frozen",
    expected: "mustRevert",
    observedStatus: "CONTRACT_REVERT_EXECUTED (AccountFrozen)",
    verdict: "PASS",
    actor: "0x9182...4410 (Carol, Frozen)",
    txHash: "0xdbe10134bc6d43eb3beab15f8a0ff1ef9ca41e172e29e92ffca3cce7a0ce733a",
    contract: DIAMOND_ADDRESS,
    consensusTimestamp: "1773173765.184910003",
    gasUsed: 26450,
  },
  {
    key: "PP-004",
    label: "Emergency pause",
    id: "PP-004",
    name: "reject-paused-transfer",
    category: "Emergency Circuit Breaker",
    scenario: "All bond transfers rejected during emergency pause",
    expected: "mustRevert",
    observedStatus: "CONTRACT_REVERT_EXECUTED (EnforcedPause)",
    verdict: "PASS",
    actor: "0x6378...1206 (Alice)",
    txHash: "0x79ae20a06869d8aa04d9c49ca2309c647b0a7aa52b1b3fbfa974ba4a30e84b84",
    contract: DIAMOND_ADDRESS,
    consensusTimestamp: "1773173778.490192002",
    gasUsed: 25900,
  },
  {
    key: "PP-005",
    label: "Pause recovery",
    id: "PP-005",
    name: "permit-resumed-transfer",
    category: "Post-Pause Recovery",
    scenario: "Compliant transfers resume normally after admin unpauses",
    expected: "mustSucceed",
    observedStatus: "SUCCESS (Status 200)",
    verdict: "PASS",
    actor: "Alice → Bob",
    txHash: "0xee2fc4fae101ab6b97aa21c87249dc21360098f98ec81a957a26f30d0a514d7b",
    contract: DIAMOND_ADDRESS,
    consensusTimestamp: "1773173790.817291001",
    gasUsed: 52900,
  },
];

export interface PolicyItem {
  id: string;
  name: string;
  description: string;
  expected: string;
  observed: string;
  result: "PASS";
  txHash: string;
  consensusGas: number;
}

export const policies: PolicyItem[] = [
  {
    id: "PP-001",
    name: "reject-unverified-transfer",
    description: "Transfers to non-KYC investors revert.",
    expected: "mustRevert",
    observed: "CONTRACT_REVERT_EXECUTED",
    result: "PASS",
    txHash: "0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a",
    consensusGas: 27810,
  },
  {
    id: "PP-002",
    name: "permit-compliant-transfer",
    description: "Verified-to-verified transfers succeed.",
    expected: "mustSucceed",
    observed: "SUCCESS (Status 200)",
    result: "PASS",
    txHash: "0x34fd282cf21fb9d95be5dca8d8108ae532a81907cb5cf5cbca9387a385f8f828",
    consensusGas: 53180,
  },
  {
    id: "PP-003",
    name: "reject-frozen-transfer",
    description: "Frozen accounts cannot transfer.",
    expected: "mustRevert",
    observed: "CONTRACT_REVERT_EXECUTED",
    result: "PASS",
    txHash: "0xdbe10134bc6d43eb3beab15f8a0ff1ef9ca41e172e29e92ffca3cce7a0ce733a",
    consensusGas: 26450,
  },
  {
    id: "PP-004",
    name: "reject-paused-transfer",
    description: "Nothing moves while paused.",
    expected: "mustRevert",
    observed: "CONTRACT_REVERT_EXECUTED",
    result: "PASS",
    txHash: "0x79ae20a06869d8aa04d9c49ca2309c647b0a7aa52b1b3fbfa974ba4a30e84b84",
    consensusGas: 25900,
  },
  {
    id: "PP-005",
    name: "permit-resumed-transfer",
    description: "Transfers resume after unpause.",
    expected: "mustSucceed",
    observed: "SUCCESS (Status 200)",
    result: "PASS",
    txHash: "0xee2fc4fae101ab6b97aa21c87249dc21360098f98ec81a957a26f30d0a514d7b",
    consensusGas: 52900,
  },
  {
    id: "PP-006",
    name: "idempotent-pause-state",
    description: "Repeated pause checks stay consistent.",
    expected: "mustSucceed",
    observed: "SUCCESS (Status 200)",
    result: "PASS",
    txHash: "0x0ecbf8a4f90117d91d6a8f15ab9c349dc17a7a5180f9dbe1eeb1846bdf3b88b7",
    consensusGas: 24320,
  },
];

export interface EvidenceRecord {
  id: string;
  name: string;
  txHash: string;
  consensusTimestamp: string;
  status: string;
  expected: string;
  result: "PASS" | "FAIL";
  payload: Record<string, string>;
}

export const evidenceRecords: EvidenceRecord[] = [
  {
    id: "PP-001",
    name: "reject-unverified-transfer",
    txHash: "0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a",
    consensusTimestamp: "1773173740.104284003",
    status: "CONTRACT_REVERT_EXECUTED",
    expected: "mustRevert",
    result: "PASS",
    payload: {
      assertionId: "PP-001",
      contractAddress: DIAMOND_ADDRESS,
      transactionId: "0.0.10464599-1773173730-000000000",
      hash: "0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a",
      result: "CONTRACT_REVERT_EXECUTED",
      revertReason: "0x5a18a961 (KYCRequired)",
      chargedTxFee: "0.05281942 HBAR",
      evaluatedBy: "PolicyProbe postcondition evaluator v1.0",
      verdict: "PASS",
    },
  },
  {
    id: "PP-002",
    name: "permit-compliant-transfer",
    txHash: "0x34fd282cf21fb9d95be5dca8d8108ae532a81907cb5cf5cbca9387a385f8f828",
    consensusTimestamp: "1773173752.549219001",
    status: "SUCCESS",
    expected: "mustSucceed",
    result: "PASS",
    payload: {
      assertionId: "PP-002",
      contractAddress: DIAMOND_ADDRESS,
      transactionId: "0.0.10464599-1773173742-000000000",
      hash: "0x34fd282cf21fb9d95be5dca8d8108ae532a81907cb5cf5cbca9387a385f8f828",
      result: "SUCCESS",
      sender: "0x6378eC0dFeB97059882fB61b8f15F6f2d2b51206",
      recipient: "0x785640243C8862F5f15d742617f1e5A77B139360",
      amountTransferred: "50 BOND",
      tokenBalanceDeltaSender: "-50",
      tokenBalanceDeltaRecipient: "+50",
      verdict: "PASS",
    },
  },
  {
    id: "PP-003",
    name: "reject-frozen-transfer",
    txHash: "0xdbe10134bc6d43eb3beab15f8a0ff1ef9ca41e172e29e92ffca3cce7a0ce733a",
    consensusTimestamp: "1773173765.184910003",
    status: "CONTRACT_REVERT_EXECUTED",
    expected: "mustRevert",
    result: "PASS",
    payload: {
      assertionId: "PP-003",
      contractAddress: DIAMOND_ADDRESS,
      hash: "0xdbe10134bc6d43eb3beab15f8a0ff1ef9ca41e172e29e92ffca3cce7a0ce733a",
      actor: "Carol (Frozen)",
      result: "CONTRACT_REVERT_EXECUTED",
      revertReason: "AccountFrozen()",
      verdict: "PASS",
    },
  },
  {
    id: "PP-004",
    name: "reject-paused-transfer",
    txHash: "0x79ae20a06869d8aa04d9c49ca2309c647b0a7aa52b1b3fbfa974ba4a30e84b84",
    consensusTimestamp: "1773173778.490192002",
    status: "CONTRACT_REVERT_EXECUTED",
    expected: "mustRevert",
    result: "PASS",
    payload: {
      assertionId: "PP-004",
      contractAddress: DIAMOND_ADDRESS,
      hash: "0x79ae20a06869d8aa04d9c49ca2309c647b0a7aa52b1b3fbfa974ba4a30e84b84",
      trigger: "pause() invoked by ROLE_PAUSER",
      result: "CONTRACT_REVERT_EXECUTED",
      revertReason: "EnforcedPause()",
      verdict: "PASS",
    },
  },
  {
    id: "PP-005",
    name: "permit-resumed-transfer",
    txHash: "0xee2fc4fae101ab6b97aa21c87249dc21360098f98ec81a957a26f30d0a514d7b",
    consensusTimestamp: "1773173791.802194001",
    status: "SUCCESS",
    expected: "mustSucceed",
    result: "PASS",
    payload: {
      assertionId: "PP-005",
      contractAddress: DIAMOND_ADDRESS,
      hash: "0xee2fc4fae101ab6b97aa21c87249dc21360098f98ec81a957a26f30d0a514d7b",
      trigger: "unpause() invoked by ROLE_PAUSER",
      result: "SUCCESS",
      verdict: "PASS",
    },
  },
  {
    id: "PP-006",
    name: "idempotent-pause-state",
    txHash: "0x0ecbf8a4f90117d91d6a8f15ab9c349dc17a7a5180f9dbe1eeb1846bdf3b88b7",
    consensusTimestamp: "1773173804.319041002",
    status: "SUCCESS",
    expected: "mustSucceed",
    result: "PASS",
    payload: {
      assertionId: "PP-006",
      contractAddress: DIAMOND_ADDRESS,
      hash: "0x0ecbf8a4f90117d91d6a8f15ab9c349dc17a7a5180f9dbe1eeb1846bdf3b88b7",
      stateCheck: "paused() === false",
      result: "SUCCESS",
      verdict: "PASS",
    },
  },
];
