import { stripe } from '../../lib/stripe'

export default async function handler(req, res) {
  console.log('API route called:', req.method, req.url)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const origin = req.headers.origin || 'http://localhost:3000'

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.'
      })
    }

    // Parse request body
    const { planName, price, isYearly } = req.body

    // Map plan names to Stripe price IDs
    const priceMap = {
      'Unlimited': {
        monthly: 'price_1S9Z703dx6mP9HgKVilhhZvy', // $15/month
        yearly: 'price_1S9Z703dx6mP9HgKVilhhZvy'   // $12/month (billed annually)
      },
      'Unlimited Plus': {
        monthly: 'price_1S9Z703dx6mP9HgKVilhhZvy', // $25/month
        yearly: 'price_1S9Z703dx6mP9HgKVilhhZvy'   // $20/month (billed annually)
      },
      'Unlimited Ultra': {
        monthly: 'price_1S9Z703dx6mP9HgKVilhhZvy', // $35/month
        yearly: 'price_1S9Z703dx6mP9HgKVilhhZvy'   // $28/month (billed annually)
      }
    }

    const stripePriceId = priceMap[planName]?.[isYearly ? 'yearly' : 'monthly']

    if (!stripePriceId) {
      return res.status(400).json({
        error: 'Invalid plan selected'
      })
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        planName,
        isYearly: isYearly.toString()
      }
    })

    return res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return res.status(err.statusCode || 500).json({
      error: err.message
    })
  }
}
