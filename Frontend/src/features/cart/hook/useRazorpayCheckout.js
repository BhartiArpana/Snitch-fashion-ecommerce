import { useRazorpay } from "react-razorpay";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "./useCart";

export function useRazorpayCheckout() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { handleVerifyPayment } = useCart();
  const { Razorpay } = useRazorpay();

  function launchCheckout({order,address}) {
    console.log("🚀 ~ launchCheckout ~ address:", address)
    console.log("🚀 ~ launchCheckout ~ order:", order)
    const options = {
      key: "rzp_test_TOntJ7wd0Ghs5z",
      amount: order.amount,
      currency: order.currency,
      name: user.fullName,
      description: "Test Transaction",
      order_id: order.id,
      handler: async (response) => {
        const isValid = await handleVerifyPayment(response);
        if (isValid) navigate("/payment/success",{
          state:{
            totalPrice:Math.floor((order.amount)/100),
            currency:order.currency,
            orderId:order.id,
            address
          }
        });
      },
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.mobileNumber,
      },
      theme: { color: "#F37254" },
    };
    const instance = new Razorpay(options);
    instance.open();
  }

  return { launchCheckout };
}