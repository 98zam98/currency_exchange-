import './App.scss';
import { useEffect, useState } from 'react';
import useList from './comp/useList';
import CurrencyDropdown from './comp/CurrencyDropdown';


function App() {

  // to show the result_string after user input
  const [flagFirstTime, setFlagFirstTime] = useState(false)

  // this class will be used to hide the result_string
  const [result_string, setResult_string] = useState("hidden_result_string");

  // list of currencys "currencies" from the api , have a placeholder “Currency” until user chooses a currency,
  const [currencys, setCurrencys] = useState(["Currency"]);

  // 1= not removed , this flag will be used to remove the placeholder option
  const [flagRemovedCurrency, setFlagRemovedCurrency] = useState(true)

  // the result will be stored here
  const [result, setResult] = useState(0.0);

  //  amount of money , quantity gets the immidiate user input and amount gets the last laugh with the help of settimeout and useeffect 
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(1);
  useEffect(() => {
    const tid = setTimeout(() => {
      setAmount(quantity)
    }, 2000);

    return () => {
      clearTimeout(tid)
    }
  }, [quantity])


  // currencies selection  
  const [fromCurrency, setFromCurrency] = useState("Currency");
  const [toCurrency, setToCurrency] = useState("Currency");

  // made a custom hook for this simple logic because it's used twice , DRY
  const toLlist = useList(currencys, fromCurrency)
  const fromLlist = useList(currencys, toCurrency)


  // will be sent with the requests , 2 requests
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '22b33cf710msh6043b5ddb03f51dp1d027ejsn5350a7882603',
      'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
    }
  };

  // get the list of currencys "currencies"
  useEffect(() => {
    (async function () {
      const res = await fetch('https://currency-exchange.p.rapidapi.com/listquotes', options)
      const data = await res.json()
      // adds the placeholder to be the first option
      setCurrencys(["Currency", ...data])
    })()
  }, [])

  // get the result
  useEffect(() => {


    //  this is how i remove the request place holder , i needed this flag because i used shift()
    if (flagRemovedCurrency && (fromCurrency !== "Currency") && (toCurrency !== "Currency")) {
      setFlagRemovedCurrency(false)
      currencys.shift()
      // using shift wouldn't change the state , so this is how i change it , used shift because it's simpler than filtering the whole array for the first element
      setCurrencys(i => [...i])
    }
    // now that we have no Currency request option chosen we should get the result , remove the class that hides the result , ofc if it's after the user gave us an input
    if (flagFirstTime && (!flagRemovedCurrency)) setResult_string("")
    // this checks the bad conditions for calling the api , if any of them happens we do nothing
    if ((fromCurrency === toCurrency) || (fromCurrency === "Currency") || (toCurrency === "Currency")) return
    // well , now it's safe to call the api
    (async function () {
      const res = await fetch(`https://currency-exchange.p.rapidapi.com/exchange?from=${fromCurrency}&to=${toCurrency}`, options)
      const data = await res.json()
      setResult(data)
      // if you noticed we get (1 fromCurrency) not the actual amount , so next we multiply it
      setResult(i => i * amount)
    })()
  }
    , [amount, fromCurrency, toCurrency]
  )

  return (
    <div className="App">
      <p className="title" >Money Exchange</p>
      <div className="layout">
        <div className="half">
          {/* 
a text field that will
contain the amount of money, This field should accept only numbers
(integer or float), It’s default value is 1.0, When user deletes all digits it
should show a placeholder of 0.0

the class currency will be used in styling , this part has the same style as the currency options
*/}
          <div className="Currency">
            <p>amount</p>
            <input type="number" placeholder="0"
              value={quantity}
              onChange={e => {
                e.preventDefault();
                setFlagFirstTime(true)
                if (!isNaN(e.target.value))
                  setQuantity(e.target.value ? e.target.value : 0)
              }} ></input>
          </div>
          <CurrencyDropdown
            Name={"from"}
            List={fromLlist}
            Currency={fromCurrency}
            setCurrency={setFromCurrency}
          />
          <button 
          className='Swap'
          onClick={() => {
            setFromCurrency(toCurrency)
            setToCurrency(fromCurrency)
          }} >🔁</button>
          <CurrencyDropdown
            Name={"to"}
            List={toLlist}
            Currency={toCurrency}
            setCurrency={setToCurrency}
          />
        </div>

          <div className={result_string + " snd"} >
            <button
              className="reset"
              onClick={() => {
                // it should reset the text field to have the value 1.0, And
                // reset the two menus to have the placeholder “Currency”, And if there
                // was a result it should be eliminated
                setResult_string("hidden_result_string")
                setQuantity(1.0)
                if (!currencys.includes("Currency")) {
                  setCurrencys(i => ["Currency", ...i])
                  setFlagRemovedCurrency(true)
                }
                setFromCurrency("Currency")
                setToCurrency("Currency")
                setResult(0)
              }} >reset</button>
            <p>{`${amount} ${fromCurrency} equals ${result} ${toCurrency}`}</p>
          </div>
        </div>
    </div>
  );
}


export default App;
