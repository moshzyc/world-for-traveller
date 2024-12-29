import React, { useContext, useEffect, useRef } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"

const PayPalCheckout = ({ handleSubmit }) => {
  const { cartSum } = useContext(StoreContext)
  const paypalRef = useRef(null)
  const scriptLoaded = useRef(false)

  useEffect(() => {
    const loadPayPalScript = async () => {
      // Return if script is already loaded or being loaded
      if (
        scriptLoaded.current ||
        document.querySelector("script[data-pp-namespace]")
      ) {
        return
      }

      scriptLoaded.current = true
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=ILS`
      script.async = true

      script.onload = () => {
        if (paypalRef.current) {
          window.paypal
            .Buttons({
              createOrder: (data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: cartSum.toFixed(2),
                        currency_code: "ILS",
                      },
                    },
                  ],
                })
              },
              onApprove: async (data, actions) => {
                try {
                  const details = await actions.order.capture()
                  console.log("Payment successful:", details)
                  await handleSubmit()
                } catch (error) {
                  console.error("Payment error:", error)
                  alert("Payment failed. Please try again.")
                }
              },
              onError: (err) => {
                console.error("PayPal Error:", err)
                alert("There was an error processing the payment.")
              },
            })
            .render(paypalRef.current)
        }
      }

      script.onerror = (err) => {
        console.error("Failed to load PayPal script:", err)
        scriptLoaded.current = false
      }

      document.body.appendChild(script)
    }

    loadPayPalScript()

    // Cleanup function
    return () => {
      const paypalScript = document.querySelector(
        'script[src*="paypal.com/sdk/js"]'
      )
      if (paypalScript) {
        paypalScript.remove()
      }
      scriptLoaded.current = false
    }
  }, [cartSum, handleSubmit])

  return <div ref={paypalRef} className="mt-4" />
}

export default PayPalCheckout
