import React from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import CheckoutForm from "./Billing/CheckoutForm";
import FreeTrialForm from './Billing/FreeTrialForm';



// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Billing = (props) => {
  const theme = useTheme();

  const pricing = props.pricing || {};

  const appearance = {
    theme: theme.palette.mode === 'dark' ? 'night' : 'stripe',
    labels: 'floating',
    variables: {
      colorBackground: theme.palette.mode === 'dark' ? '#383838' : theme.palette.background.default,
    },
    rules: {
      '.Input': {
        'padding': '5px',
        // 'boxShadow': 'none',
        // 'border': 'none'
      },
      '.Tab': {
        'padding': '5px',
      },
    }
  };

  const options = {
    // clientSecret,
    mode: 'subscription',
    amount: pricing.price * 100,
    currency: 'usd',
    appearance,
  };

  const trial = (pricing.code === 'api_trial');

  return (
    <Dialog
      open={props.open}
      onClose={props.closeHandler}
    >
      <DialogTitle id="alert-dialog-title">{pricing.name || 'Loading...'} {pricing.type === 'picks' ? 'picks access' : 'API access'}</DialogTitle>
      <DialogContent>
        <div>
          {!trial ? <Typography color = 'text.secondary' variant = 'caption'>See <Link underline="hover"  href = "https://srating.io/terms-and-conditions" target = "_blank">terms and conditions</Link> before subscribing.</Typography> : ''}
          {!trial ? <Typography color = 'text.secondary' variant = 'caption'> Payments processed securely via <Link underline="hover"  href = "https://stripe.com" target = "_blank">Stripe</Link></Typography> : ''}
        </div>
        {
        trial ?
          <div>
            <FreeTrialForm />
          </div>
          :
          <div>
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm pricing = {pricing} />
            </Elements>
          </div>
        }
      </DialogContent>
    </Dialog>
  );
}

export default Billing;