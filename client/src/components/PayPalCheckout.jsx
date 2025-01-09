import React, { useContext, useEffect, useRef } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"

// קומפוננטת תשלום PayPal //
const PayPalCheckout = ({ handleSubmit }) => {
  // שימוש בקונטקסט לקבלת סכום העגלה //
  const { cartSum } = useContext(StoreContext)

  // רפרנסים לרכיב PayPal ומצב טעינת הסקריפט //
  const paypalRef = useRef(null)
  const scriptLoaded = useRef(false)

  useEffect(() => {
    // פונקציה לטעינת סקריפט PayPal //
    const loadPayPalScript = async () => {
      // בדיקה אם הסקריפט כבר נטען //
      if (
        scriptLoaded.current ||
        document.querySelector("script[data-pp-namespace]")
      ) {
        return
      }

      // סימון הסקריפט כנטען ויצירת אלמנט הסקריפט //
      scriptLoaded.current = true
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=ILS`
      script.async = true

      // טיפול באירוע טעינת הסקריפט //
      script.onload = () => {
        if (paypalRef.current) {
          window.paypal
            .Buttons({
              // יצירת הזמנה חדשה //
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
              // טיפול באישור התשלום //
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
              // טיפול בשגיאות //
              onError: (err) => {
                console.error("PayPal Error:", err)
                alert("There was an error processing the payment.")
              },
            })
            .render(paypalRef.current)
        }
      }

      // טיפול בשגיאת טעינת הסקריפט //
      script.onerror = (err) => {
        console.error("Failed to load PayPal script:", err)
        scriptLoaded.current = false
      }

      // הוספת הסקריפט לדף //
      document.body.appendChild(script)
    }

    // טעינת הסקריפט //
    loadPayPalScript()

    // פונקציית ניקוי - הסרת הסקריפט בעת הסרת הקומפוננטה //
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

  // רינדור מיכל PayPal //
  return <div ref={paypalRef} className="mt-4" />
}

export default PayPalCheckout
