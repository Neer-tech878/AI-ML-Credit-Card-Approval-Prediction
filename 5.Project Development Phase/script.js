// =============================================================================
//  CreditAI — Credit Card Approval Prediction
//  Frontend Logic
// =============================================================================
//  Developer   : Kadali Neeraj
//  Roll No     : 23B91A6167
//  College     : Sagi Ramakrishnam Raju Engineering College
//  Department  : B.Tech CSE (AI & ML)  |  Batch: 2023 – 2027
//  GitHub      : https://github.com/Neer-tech878
// =============================================================================

document
  .getElementById("predictionForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // ── Button loading state ──
    const btn       = document.getElementById("submitBtn");
    const btnText   = document.getElementById("btnText");
    const btnLoader = document.getElementById("btnLoader");

    btn.disabled              = true;
    btnText.style.display     = "none";
    btnLoader.style.display   = "inline";

    // ── Hide previous result ──
    const resultBox = document.getElementById("resultBox");
    resultBox.style.display   = "none";
    resultBox.className       = "";

    // Reset confidence bar
    const fill = document.getElementById("confidenceFill");
    if (fill) fill.style.width = "0%";

    try {
      // ── Collect all form values ──
      const data = {
        gender:         document.getElementById("gender").value,
        age:            parseFloat(document.getElementById("age").value),
        debt:           parseFloat(document.getElementById("debt").value),
        married:        parseInt(document.getElementById("married").value),
        bank_customer:  parseInt(document.getElementById("bank_customer").value),
        industry:       document.getElementById("industry").value,
        years_employed: parseFloat(document.getElementById("years_employed").value),
        prior_default:  parseInt(document.getElementById("prior_default").value),
        employed:       parseInt(document.getElementById("employed").value),
        credit_score:   parseFloat(document.getElementById("credit_score").value),
        citizen:        document.getElementById("citizen").value,
        income:         parseFloat(document.getElementById("income").value),
      };

      console.log("📤 Sending data:", data);

      // ── Basic validation ──
      if (isNaN(data.age) || data.age < 18 || data.age > 100)
        throw new Error("Age must be between 18 and 100.");
      if (isNaN(data.income) || data.income < 0)
        throw new Error("Income must be a positive number.");
      if (isNaN(data.debt) || data.debt < 0)
        throw new Error("Debt must be a positive number.");
      if (isNaN(data.years_employed) || data.years_employed < 0)
        throw new Error("Years Employed must be a positive number.");
      if (isNaN(data.credit_score) || data.credit_score < 0)
        throw new Error("Credit Score must be a positive number.");

      // ── Send to Flask ──
      const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("📊 Result:", result);

      if (!response.ok) throw new Error(result.error || "Server error occurred.");

      // ── Display result ──
      const resultIcon       = document.getElementById("resultIcon");
      const resultText       = document.getElementById("resultText");
      const confidenceText   = document.getElementById("confidenceText");

      if (result.approved) {
        resultBox.classList.add("approved");
        resultIcon.innerText       = "✅";
        resultText.innerText       = "APPROVED";
        confidenceText.innerHTML   =
          `Model Confidence: <strong>${result.confidence}%</strong><br>
           Your application meets the eligibility criteria. You are likely to get approved!`;
      } else {
        resultBox.classList.add("rejected");
        resultIcon.innerText       = "❌";
        resultText.innerText       = "NOT APPROVED";
        confidenceText.innerHTML   =
          `Model Confidence: <strong>${result.confidence}%</strong><br>
           Your application needs improvement. Try improving your credit score or reducing debt.`;
      }

      // Animate confidence bar
      resultBox.style.display = "block";
      setTimeout(() => {
        if (fill) fill.style.width = result.confidence + "%";
      }, 100);

    } catch (error) {
      console.error("❌ Error:", error);
      resultBox.classList.add("rejected");
      document.getElementById("resultIcon").innerText       = "⚠️";
      document.getElementById("resultText").innerText       = "Error";
      document.getElementById("confidenceText").innerText   = error.message;
      resultBox.style.display = "block";
    } finally {
      btn.disabled            = false;
      btnText.style.display   = "inline";
      btnLoader.style.display = "none";
    }
  });
