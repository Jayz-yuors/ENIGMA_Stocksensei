// Shared browser helper for Banks, Lenders, and Insurers tabs.
// The API key must never be placed in this file or sent from the browser.

const RISK_API_BASE = "http://localhost:8000";

export async function assessRisk(domain, userInput, includeAiReasoning = true) {
  const response = await fetch(`${RISK_API_BASE}/api/assess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain, // "banks" | "lenders" | "insurers"
      user_input: userInput,
      include_ai_reasoning: includeAiReasoning,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || `Risk API returned ${response.status}`);
  }
  // Render ml_risk_json and ai_reasoning.text separately in the UI.
  return result;
}

// Banks example:
// const result = await assessRisk("banks", {
//   step: 295,
//   type: "CASH_OUT", // dropdown value
//   amount: 172344.3,
//   oldbalanceOrg: 172344.3,
//   oldbalanceDest: 0,
// });
// showRisk(result.ml_risk_json);
// showExplanation(result.ai_reasoning.text);
