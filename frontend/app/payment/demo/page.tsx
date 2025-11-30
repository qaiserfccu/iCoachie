"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PaymentCheckout } from '@/components/PaymentCheckout'
import { CreditCard, DollarSign } from 'lucide-react'

export default function PaymentDemoPage() {
  const [amount, setAmount] = useState(25)
  const [description, setDescription] = useState('Swimming Lesson Payment')
  const [showCheckout, setShowCheckout] = useState(false)

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent)
    setShowCheckout(false)
    // You could redirect to success page or show success message
  }

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error)
  }

  if (showCheckout) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowCheckout(false)}
            className="glass-subtle border-white/20 bg-transparent"
          >
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">Complete Payment</h1>
          <div />
        </div>

        <PaymentCheckout
          amount={amount}
          description={description}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Payment Demo</h1>
        <p className="text-muted-foreground">
          Test the Stripe payment integration
        </p>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="glass-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">Total:</span>
              <span className="text-2xl font-bold text-green-500">
                ${amount.toFixed(2)}
              </span>
            </div>

            <Button
              onClick={() => setShowCheckout(true)}
              disabled={amount <= 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Test Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Test Card:</strong> 4242 4242 4242 4242</p>
            <p><strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
            <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
            <p><strong>Name:</strong> Any name</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}