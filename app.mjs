import { agent, gtin, llm, moq, photoPages, voice } from "./benchmarks.mjs";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const integers = new Intl.NumberFormat("en-US");
const monthly = (value) => Number.isFinite(value) ? dollars.format(value) + " / month" : "Estimate is too large.";
const count = (value, singular, plural = singular + "s") => (
  integers.format(value) + " " + (value === 1 ? singular : plural)
);

const calculate = {
  llm: (values) => monthly(llm(values)),
  voice: (values) => monthly(voice(values)),
  agent: (values) => monthly(agent(values)),
  photoPages: (values) => count(photoPages(values), "page"),
  moq: (values) => {
    const { units, cases } = moq(values);
    return Number.isSafeInteger(units) ? count(units, "unit") + " · " + count(cases, "case") : "Order is too large.";
  },
  gtin: (values) => {
    const { valid, checkDigit } = gtin(values);
    return valid ? "Valid · check digit " + checkDigit : "Invalid · expected " + checkDigit;
  },
};

for (const form of document.querySelectorAll("form[data-calculator]")) {
  const fields = form.querySelector("fieldset");
  const inputs = [...fields.querySelectorAll("input")];
  const output = form.querySelector("output");
  const update = () => {
    if (!form.matches(":valid") || inputs.some((input) => input.type === "number"
      && !input.hasAttribute("step") && !Number.isSafeInteger(input.valueAsNumber))) {
      output.value = "Check the input values.";
      return;
    }
    const values = Object.fromEntries(inputs.map((input) => [
      input.name, input.type === "number" ? input.valueAsNumber : input.value,
    ]));
    output.value = calculate[form.dataset.calculator](values);
  };

  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", update);
  fields.disabled = false;
  update();
}
