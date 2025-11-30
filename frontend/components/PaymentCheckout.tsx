"use client"

import { useState, useEffect } from 'react'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, CheckCircle } from 'lucide-react'
import { paymentService } from '@/lib/services'
import { useLoading } from '@/lib/contexts/LoadingContext'
import { useError } from '@/lib/contexts/ErrorContext'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface PaymentCheckoutProps {
  amount: number
  currency?: string
  description?: string
  metadata?: Record<string, any>
  onSuccess?: (paymentIntent: any) => void
  onError?: (error: any) => void
  className?: string
}

function CheckoutForm({
  amount,
  currency = 'usd',
  description,
  metadata,
  onSuccess,
  onError
}: PaymentCheckoutProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const { showLoading, hideLoading } = useLoading()
  const { showError } = useError()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage('')

    try {
      showLoading('Processing payment...')

      // Create payment intent first
      const { paymentIntent: clientSecret } = await paymentService.createPaymentIntent({
        amount,
        currency,
        description,
        metadata
      })

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required'
      })

      if (error) {
        setMessage(error.message || 'An error occurred.')
        onError?.(error)
        showError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!')
        onSuccess?.(paymentIntent)
      }
    } catch (error: any) {
      setMessage('An error occurred.')
      onError?.(error)
      showError('Payment processing failed')
    } finally {
      setIsProcessing(false)
      hideLoading()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs'
        }}
      />

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('succeeded')
            ? 'bg-green-500/20 text-green-600 border border-green-500/30'
            : 'bg-red-500/20 text-red-600 border border-red-500/30'
        }`}>
          {message.includes('succeeded') && (
            <CheckCircle className="w-5 h-5 inline mr-2" />
          )}
          {message}
        </div>
      )}
    </form>
  )
}

export function PaymentCheckout(props: PaymentCheckoutProps) {
  const [clientSecret, setClientSecret] = useState('')
  const { showLoading, hideLoading } = useLoading()
  const { showError } = useError()

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        showLoading('Setting up payment...')

        const response = await paymentService.createPaymentIntent({
          amount: props.amount,
          currency: props.currency,
          description: props.description,
          metadata: props.metadata
        })

        setClientSecret(response.paymentIntent.client_secret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
        showError('Failed to setup payment')
      } finally {
        hideLoading()
      }
    }

    createPaymentIntent()
  }, [props.amount, props.currency, props.description, props.metadata, showLoading, hideLoading, showError])

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#1f2937',
        colorText: '#f9fafb',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '6px',
      },
    },
  }

  return (
    <Card className={`glass-card border-white/20 ${props.className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Secure payment powered by Stripe
        </p>
      </CardHeader>
      <CardContent>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm {...props} />
          </Elements>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Setting up payment...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}