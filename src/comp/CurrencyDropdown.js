import React, { useEffect, useRef, useState } from 'react'

// made this comp for DRY , props drilling here is not bad , it's only one level , no need for a context "usecontext" or global state "redux"

const CurrencyDropdown = ({ Name, List, Currency, setCurrency }) => {
  // this is the flag to get the menu on and off 
  const [display, setDisplay] = useState(false);

  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDisplay(false);
    }
  };
  // to close the menu
  useEffect(() => {

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownRef]);



  return (
    <div className="Currency">
      <p>{Name}</p>
      <div className="dropdown" ref={dropdownRef}>
        <button className="dropdown__button"
          onClick={_ => setDisplay(!display)}
        >{Currency} {" 🔽"}</button>
        {display && (<ul className="dropdown__list">
          {List.map((i) => (
            <li
              key={i}
              className="dropdown__list-item"
              onClick={e => {
                e.preventDefault();
                setCurrency(i)
                setDisplay(false);
              }}
            >
              {i}
            </li>
          ))}
        </ul>)}
      </div>
    </div>
  )
}

export default CurrencyDropdown