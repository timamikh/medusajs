'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import medusaClient from '@/lib/medusa'

interface CartItem {
  id: string
  title: string
  thumbnail?: string
  variant: {
    id: string
    title: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }
  quantity: number
  unit_price: number
  total: number
}

export default function CartPage() {
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Попробуем получить ID корзины из localStorage
        const cartId = localStorage.getItem('cart_id')
        
        if (!cartId) {
          // Если корзины нет, создаем новую
          const response = await medusaClient.carts.create({})
          console.log('Created new cart:', response)
          const { cart } = response
          localStorage.setItem('cart_id', cart.id)
          setCart(cart)
        } else {
          // Загружаем существующую корзину
          const response = await medusaClient.carts.retrieve(cartId)
          console.log('Retrieved cart:', response)
          const { cart } = response
          setCart(cart)
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching cart:', err)
        setError('Failed to load cart. Please try again later.')
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    if (!cart) return

    try {
      const response = await medusaClient.carts.lineItems.update(cart.id, lineItemId, {
        quantity
      })
      console.log('Updated cart:', response)
      setCart(response.cart)
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Failed to update quantity')
    }
  }

  const removeItem = async (lineItemId: string) => {
    if (!cart) return

    try {
      const response = await medusaClient.carts.lineItems.delete(cart.id, lineItemId)
      console.log('Updated cart after removal:', response)
      setCart(response.cart)
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Failed to remove item')
    }
  }

  const getTotalPrice = () => {
    if (!cart || !cart.items) return '$0.00'
    const total = cart.items.reduce((sum: number, item: CartItem) => sum + item.total, 0)
    return `$${(total / 100).toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          href="/products"
          className="text-indigo-600 hover:text-indigo-500"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const isEmpty = !cart?.items || cart.items.length === 0

  if (isEmpty) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your cart is empty
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Start adding some items to your cart to see them here.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
      <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Shopping Cart
      </h1>

      <form className="mt-12">
        <div>
          <h2 className="sr-only">Items in your shopping cart</h2>

          <ul className="border-t border-gray-200 divide-y divide-gray-200">
            {cart.items.map((item: CartItem) => (
              <li key={item.id} className="py-6 flex">
                <div className="flex-shrink-0">
                  <img
                    src={item.thumbnail || '/placeholder-product.jpg'}
                    alt={item.title}
                    className="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32"
                  />
                </div>

                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <Link
                            href={`/products/${item.id}`}
                            className="font-medium text-gray-700 hover:text-gray-800"
                          >
                            {item.title}
                          </Link>
                        </h3>
                      </div>
                      <div className="mt-1 flex text-sm">
                        <p className="text-gray-500">{item.variant.title}</p>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        ${(item.unit_price / 100).toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <label htmlFor={`quantity-${item.id}`} className="sr-only">
                        Quantity, {item.title}
                      </label>
                      <select
                        id={`quantity-${item.id}`}
                        name={`quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>

                      <div className="absolute top-0 right-0">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Remove</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 flex text-sm text-gray-700 space-x-2">
                    <span className="font-medium">${(item.total / 100).toFixed(2)}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>{getTotalPrice()}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
            <Link
              href="/checkout"
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Checkout
            </Link>
          </div>
          <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
            <p>
              or{' '}
              <Link
                href="/products"
                className="text-indigo-600 font-medium hover:text-indigo-500"
              >
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
