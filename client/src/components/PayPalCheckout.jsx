import React, { useContext, useEffect } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"

const PayPalCheckout = ({ handleSubmit }) => {
  const { cartSum } = useContext(StoreContext)

  useEffect(() => {
    const loadPayPalScript = async () => {
      if (!window.paypal) {
        const script = document.createElement("script")

        // כאן שמים רק את ה-Client ID בלי ה-URL המלא
        script.src =
          "https://www.paypal.com/sdk/js?client-id=AQ1kDWf-rb55Z9J6rHasEyNSWSbnomO7h9pSv-N5QJfF4MMvBvVTI_d2Qz3NKedYXHnGtsOa2IYJJWJy&debug=true"

        script.async = true
        script.onload = () => {
          // יצירת כפתור PayPal לאחר טעינת ה-SDK
          window.paypal
            .Buttons({
              createOrder: function (data, actions) {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: cartSum.toFixed(2), // הסכום לתשלום
                      },
                    },
                  ],
                })
              },
              onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                  alert(
                    `Transaction completed by ${details.payer.name.given_name}`
                  )
                  console.log("Calling handleSubmit...")
                  handleSubmit()
                })
              },
              onError: function (err) {
                console.error("PayPal Error:", err)
                alert("There was an error processing the payment.")
              },
            })
            .render("#paypal-button-container") // רינדור הכפתור
        }
        document.body.appendChild(script)
      }
    }

    loadPayPalScript()
  }, [cartSum, handleSubmit])

  return <div id="paypal-button-container"></div>
}

export default PayPalCheckout
