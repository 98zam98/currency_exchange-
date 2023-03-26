import React, { useMemo } from 'react'

// will use useMemo for performance
const useList = (currencys, otherCurrency) => {
    return useMemo(() => {
        return [...currencys].filter(i => {

            if (i === "Currency") return true
            
            // When choosing any of the options that option should be disabled in the another dropdown menu
            return i !== otherCurrency
        })
    }, [otherCurrency, currencys])

}

export default useList