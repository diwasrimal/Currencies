import "./components.css";

export function Spinner() {
  return (
    <div className="spinner-wrapper">
      <div className="spinner">
        <div className="spinner"></div>
      </div>
    </div>
  );
}

export function AmountBox({ amount, changeHandler, isInitialAmount }) {
  return (
    <input
      className="amount-box"
      type="number"
      step="0.1"
      value={amount}
      onChange={(e) => {
        changeHandler(e.target.value, isInitialAmount);
      }}
    />
  );
}

export function CurrencySelector({ currency, setCurrency, currencies }) {
  return (
    <select className="currency-selector" value={currency} onChange={(e) => setCurrency(e.target.value)}>
      {currencies.map((c, i) => (
        <option key={i}>{c}</option>
      ))}
    </select>
  );
}
