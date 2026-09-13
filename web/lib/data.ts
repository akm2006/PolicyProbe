export const HARNESS_PR_URL = "https://github.com/hedera-dev/hedera-harness/pull/74";
export const REPO_URL = "https://github.com/akm2006/PolicyProbe";
export const DIAMOND_ADDRESS = "0x19CD7866076758E3AF6C79aD7Ce725331A5606B8";
export const COMPARISON_DIAMOND_ADDRESS = "0xeff72A209498C890e3583702bD7818570a5c9E03";
export const EVIDENCE_VERIFIED_ON = "2026-09-12";

export const hashscanTx = (hash: string) => `https://hashscan.io/testnet/transaction/${hash}`;
export const hashscanAddress = (address: string) => `https://hashscan.io/testnet/address/${address}`;

export const stats = [
  { value: "6/6", label: "ATS policy assertions matched" },
  { value: "PR #74", label: "upstream Harness pull request · open" },
  { value: EVIDENCE_VERIFIED_ON, label: "Mirror Node records checked" },
];

export const pipelineSteps = [
  {
    number: "I",
    title: "Declare",
    description: "State the required on-chain outcome in the recipe.",
    file: ".harness/spec.yaml",
    code: `chainValidation:
  assertions:
    - id: reject-unverified-transfer
      expect:
        outcome: mustRevert`,
  },
  {
    number: "II",
    title: "Execute",
    description: "Run the declared action with its configured testnet signer.",
    file: "scripts/transfer.ts",
    code: `const tx = await bond
  .connect(attacker)
  .transfer(unverifiedInvestor, amount);`,
  },
  {
    number: "III",
    title: "Observe",
    description: "Resolve the transaction result from Hedera Mirror Node.",
    file: "Mirror Node",
    code: `hash: 0x513432…91f6a
result: CONTRACT_REVERT_EXECUTED`,
  },
  {
    number: "IV",
    title: "Compare",
    description: "Compare the confirmed result with the recipe expectation.",
    file: "chainAssertions.ts",
    code: `if (expected !== observed) {
  finding.category = "chain-assertion";
}`,
  },
  {
    number: "V",
    title: "Repair",
    description: "Feed confirmed policy mismatches into Harness repair.",
    file: "attemptStages.ts",
    code: `policy mismatch
  → chain-assertion
  → repair loop`,
  },
];

type Outcome = "mustRevert" | "mustSucceed";

type VerifiedPolicyRun = {
  id: string;
  name: string;
  description: string;
  expected: Outcome;
  observedStatus: string;
  txHash: string;
  contract: string;
  consensusTimestamp: string;
  gasUsed: number;
  actor: string;
  category: string;
};

const verifiedPolicyRuns: VerifiedPolicyRun[] = [
  {
    id: "PP-001",
    name: "reject-unverified-transfer",
    description: "An unverified investor must not receive the bond.",
    expected: "mustRevert",
    observedStatus: "CONTRACT_REVERT_EXECUTED",
    txHash: "0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a",
    contract: DIAMOND_ADDRESS,
    consensusTimestamp: "1788932289.723104155",
    gasUsed: 78336,
    actor: "Alice",
    category: "KYC enforcement",
  },
  {
    id: "PP-002",
    name: "verified-transfer-succeeds",
    description: "A verified investor can receive the bond.",
    expected: "mustSucceed",
    observedStatus: "SUCCESS",
    txHash: "0xaf9d207c5caf18ba1fbd789cf851567a43149b8ee9540d953c9a5250986d4e7e",
    contract: DIAMOND_ADDRESS,
    consensusTimestamp: "1788932323.177312104",
    gasUsed: 438652,
    actor: "Alice",
    category: "Authorized transfer",
  },
  {
    id: "PP-003",
    name: "attacker-cannot-freeze",
    description: "An account without the freeze role cannot freeze a holder.",
    expected: "mustRevert",
    observedStatus: "CONTRACT_REVERT_EXECUTED",
    txHash: "0xc8ade9fb73e8ed65119fe7e699047ec645da54087551594e189a4bb1a9316bc7",
    contract: DIAMOND_ADDRESS,
    consensusTimestamp: "1788932367.898796104",
    gasUsed: 64308,
    actor: "Attacker",
    category: "Role enforcement",
  },
  {
    id: "PP-004",
    name: "frozen-holder-cannot-transfer",
    description: "A frozen holder cannot transfer the bond.",
    expected: "mustRevert",
    observedStatus: "CONTRACT_REVERT_EXECUTED",
    txHash: "0x41166503c2f8a5665d14538b5f3aa0ccdb6e08087e0fd5ecc3e8583205752a31",
    contract: DIAMOND_ADDRESS,
    consensusTimestamp: "1788932438.579081104",
    gasUsed: 70958,
    actor: "Frozen holder",
    category: "Freeze enforcement",
  },
  {
    id: "PP-005",
    name: "compliance-can-pause",
    description: "The compliance role can pause the asset.",
    expected: "mustSucceed",
    observedStatus: "SUCCESS",
    txHash: "0x555bd0e8f4fa7c338f552ad2213a333f6162510efebb35d8dd2964c4b9544cd1",
    contract: DIAMOND_ADDRESS,
    consensusTimestamp: "1788932533.652952162",
    gasUsed: 79287,
    actor: "Harness operator",
    category: "Pause control",
  },
  {
    id: "PP-006",
    name: "paused-asset-blocks-transfer",
    description: "A paused asset blocks transfers between verified investors.",
    expected: "mustRevert",
    observedStatus: "CONTRACT_REVERT_EXECUTED",
    txHash: "0xaa02643a27c9b1b30a608d3b78838b8aef5e4fa1b7dda4a67b23bd0d7ccaf737",
    contract: DIAMOND_ADDRESS,
    consensusTimestamp: "1788932542.476999109",
    gasUsed: 51536,
    actor: "Alice",
    category: "Pause enforcement",
  },
];

export interface PolicyCase extends VerifiedPolicyRun {
  key: string;
  label: string;
  scenario: string;
  verdict: "PASS" | "FAIL";
  findingPayload?: {
    id: string;
    category: "chain-assertion";
    evidence: { transactionId: string; expected: string; observed: string };
  };
}

const beforeAfterCase: PolicyCase = {
  key: "before-after",
  id: "before-after",
  label: "Whitelist disabled",
  name: "reject-unverified-transfer · misconfigured bond",
  category: "KYC enforcement",
  scenario: "The same transfer succeeds when whitelist enforcement is disabled.",
  expected: "mustRevert",
  observedStatus: "SUCCESS",
  verdict: "FAIL",
  actor: "Alice",
  txHash: "0xdcf971ccd2978dddf816fa2eb9f980578c63253ff7aa05f8bdc2219e9038877c",
  contract: COMPARISON_DIAMOND_ADDRESS,
  consensusTimestamp: "1788932861.906285104",
  gasUsed: 229023,
  description: "The declared policy mismatch was confirmed on Hedera testnet.",
  findingPayload: {
    id: "chain-assertion:reject-unverified-transfer",
    category: "chain-assertion",
    evidence: {
      transactionId: "0xdcf971ccd2978dddf816fa2eb9f980578c63253ff7aa05f8bdc2219e9038877c",
      expected: "mustRevert",
      observed: "SUCCESS",
    },
  },
};

export const sandboxCases: PolicyCase[] = [
  beforeAfterCase,
  ...verifiedPolicyRuns.map((run) => ({
    ...run,
    key: run.id,
    label: run.name,
    scenario: run.description,
    verdict: "PASS" as const,
  })),
];

export interface PolicyItem {
  id: string;
  name: string;
  description: string;
  expected: Outcome;
  observed: string;
  result: "PASS";
  txHash: string;
  consensusGas: number;
}

export const policies: PolicyItem[] = verifiedPolicyRuns.map((run) => ({
  id: run.id,
  name: run.name,
  description: run.description,
  expected: run.expected,
  observed: run.observedStatus,
  result: "PASS",
  txHash: run.txHash,
  consensusGas: run.gasUsed,
}));

export interface EvidenceRecord {
  id: string;
  name: string;
  txHash: string;
  consensusTimestamp: string;
  status: string;
  expected: Outcome;
  result: "PASS";
  payload: Record<string, string>;
}

export const evidenceRecords: EvidenceRecord[] = verifiedPolicyRuns.map((run) => ({
  id: run.id,
  name: run.name,
  txHash: run.txHash,
  consensusTimestamp: run.consensusTimestamp,
  status: run.observedStatus,
  expected: run.expected,
  result: "PASS",
  payload: {
    assertionId: run.id,
    contractAddress: run.contract,
    hash: run.txHash,
    consensusTimestamp: run.consensusTimestamp,
    result: run.observedStatus,
    expectedOutcome: run.expected,
    verdict: "PASS",
    gasUsed: String(run.gasUsed),
  },
}));
