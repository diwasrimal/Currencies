import { useState, useEffect } from "react";
import { Spinner, AmountBox, CurrencySelector } from "./components.jsx";
import apiKey from "/src/assets/apiKey.js";
import "./App.css";

const SOURCE_CURRENCY = "USD";
const TARGET_CURRENCY = "NPR";

export default function App() {
  const [rateData, setRateData] = useState(
    JSON.parse(localStorage.getItem("rateData"))
  );
  const [sourceCurrency, setSourceCurrency] = useState(SOURCE_CURRENCY);
  const [targetCurrency, setTargetCurrency] = useState(TARGET_CURRENCY);
  const [initAmount, setInitAmount] = useState(1);
  const [convAmount, setConvAmount] = useState(
    rateData !== null &&
      initAmount * conversionFactor(rateData.conversion_rates)
  );

  useEffect(() => {
    // Check if rateData is null or outdated
    // If yes, fetch new data and save to localStorage
    if (
      rateData === null ||
      Math.floor(Date.now() / 1000) >= rateData.time_next_update_unix
    ) {
      fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/usd`)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("rateData", JSON.stringify(data));
          setRateData(data);
          setConvAmount(initAmount * conversionFactor(data.conversion_rates));
        });

      // Else just use the data to initialize conversion amount
    } else {
      setConvAmount(initAmount * conversionFactor(rateData.conversion_rates));
    }
  }, []);

  // Changes converted amount when currencies change
  useEffect(() => {
    if (rateData === null) return;
    setConvAmount(initAmount * conversionFactor(rateData.conversion_rates));
  }, [sourceCurrency, targetCurrency]);

  // Function to find the mutiplier that changes one currency to another
  function conversionFactor(conversionRates) {
    if (!conversionRates) {
      console.error("conversion rates is empty, can't find conversion factor");
      return;
    }
    return conversionRates[targetCurrency] / conversionRates[sourceCurrency];
  }

  // Reset other amount when one of the amounts changes
  function handleAmountChange(amount, isInitialAmount) {
    if (amount === "") {
      setInitAmount("");
      setConvAmount("");
      return;
    }

    const conversionFactor =
      rateData.conversion_rates[targetCurrency] /
      rateData.conversion_rates[sourceCurrency];
    if (isInitialAmount) {
      setInitAmount(Number(amount));
      setConvAmount(Number((amount * conversionFactor).toFixed(4)));
    } else {
      setInitAmount(Number((amount / conversionFactor).toFixed(4)));
      setConvAmount(Number(amount));
    }
  }

  console.log(rateData, sourceCurrency, targetCurrency, initAmount, convAmount);

  // Render a spinner if rateData is null (data is being fetched)
  if (rateData === null) {
    return (
      <div className="container">
        <Spinner />;
      </div>
    );
  }

  return (
    <div className="container">
      <div className="title"> Currency Converter </div>
      <div className="amount-currency-wrapper">
        <AmountBox
          amount={initAmount}
          changeHandler={handleAmountChange}
          isInitialAmount={true}
        />
        <CurrencySelector
          currency={sourceCurrency}
          setCurrency={setSourceCurrency}
          currencies={Object.keys(rateData.conversion_rates)}
        />
      </div>
      <div className="amount-currency-wrapper">
        <AmountBox
          amount={convAmount}
          changeHandler={handleAmountChange}
          isInitialAmount={false}
        />
        <CurrencySelector
          currency={targetCurrency}
          setCurrency={setTargetCurrency}
          currencies={Object.keys(rateData.conversion_rates)}
        />
      </div>
    </div>
  );
}
