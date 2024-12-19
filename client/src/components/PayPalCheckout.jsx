import React, { useEffect } from "react";

const PayPalCheckout = () => {
  useEffect(() => {
    const loadPayPalScript = async () => {
      if (!window.paypal) {
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID = AQ1kDWf-rb55Z9J6rHasEyNSWSbnomO7h9pSv-N5QJfF4MMvBvVTI_d2Qz3NKedYXHnGtsOa2IYJJWJy";
        script.async = true;
        script.onload = () => {
          // יצירת כפתור PayPal לאחר טעינת ה-SDK
          window.paypal
            .Buttons({
              createOrder: function (data, actions) {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: "10.00", // הסכום לתשלום
                      },
                    },
                  ],
                });
              },
              onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                  alert(`Transaction completed by ${details.payer.name.given_name}`);
                });
              },
              onError: function (err) {
                console.error("PayPal Error:", err);
                alert("There was an error processing the payment.");
              },
            })
            .render("#paypal-button-container"); // רינדור הכפתור
        };
        document.body.appendChild(script);
      }
    };

    loadPayPalScript();
  }, []);

  return <div id="paypal-button-container"></div>;
};

export default PayPalCheckout;