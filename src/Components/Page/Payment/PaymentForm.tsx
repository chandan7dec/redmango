import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { toastNotify } from '../../../Helper';
import { orderSummaryProps } from '../Order/orderSummaryProps';
import { apiResponse, cartItemModel } from '../../../Interfaces';
import { useCreateOrderMutation } from '../../../Apis/orderApi';
import { SD_Status } from '../../../Utility/SD';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({data, userInput}:orderSummaryProps) => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [createOrder] = useCreateOrderMutation();
    const [isProcessing, setIsProcessing] = useState(false);
    //console.log("data", data);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();
  
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
      
      setIsProcessing(true);
      const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: "https://example.com/order/123/complete",
        },
        redirect:"if_required"
      });
  
      if (result.error) {
        // Show error to your customer (for example, payment details incomplete)
        toastNotify("An unexpected error occured.", "error");
        setIsProcessing(false);
        //console.log(result.error.message);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
        console.log("payment result",result);
        let grandTotal = 0;
        let totalItems = 0;

        const orderDetailsDTO:any = [];
        data.cartItems.forEach((item:cartItemModel) => {
          const tempOrderDetail:any ={};
          tempOrderDetail["menuItemId"] = item.menuItem?.id;
          tempOrderDetail["quantity"] = item.quantity;
          tempOrderDetail["itemName"] = item.menuItem?.name;
          tempOrderDetail["price"] = item.menuItem?.price;
          orderDetailsDTO.push(tempOrderDetail);

          grandTotal += item.quantity! * item.menuItem?.price!;
          totalItems += item.quantity!;

        });

        const response : apiResponse = await createOrder({
        pickupName: userInput.name,
        pickupPhoneNumber: userInput.phoneNumber,
        pickupEmail: userInput.email,
        totalItems : totalItems,
        orderTotal: grandTotal,
        applicationUserId: data.userId,
        orderDetailsDTO:orderDetailsDTO,
        stripePaymentIntentID: data.stripePaymentIntentId,
        
        status: result.paymentIntent.status ==="succeeded"? SD_Status.CONFIRMED: SD_Status.PENDING,

        });
        console.log("createOrdre", response);
        if(response){
          // if(response.data?.result.status === SD_Status.CONFIRMED) {
            if(result.paymentIntent.status ==="succeeded") {
            console.log("****beforeredirect", response);
            navigate(`/order/orderConfirmed/${response.data?.result.id}`);
          }
        }else {
          navigate("/failed");
        }
      }
      setIsProcessing(false);
    };

    
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button className='btn btn-success  mt-5  w-100 '>Submit</button>
    </form>
  );
};

export default PaymentForm;