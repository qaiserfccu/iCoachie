"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent')
    if (paymentIntent) {
      setPaymentIntentId(paymentIntent)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glass-card border-white/20 max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <p className="text-muted-foreground">
            Your payment has been processed successfully.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentIntentId && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Payment ID</p>
              <p className="font-mono text-sm bg-white/10 p-2 rounded">
                {paymentIntentId}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link href="/dashboard">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            <Link href="/payments">
              <Button variant="outline" className="w-full glass-subtle border-white/20 bg-transparent">
                View Payment History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}