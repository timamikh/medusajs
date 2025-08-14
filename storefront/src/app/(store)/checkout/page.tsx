'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import medusaClient from '@/lib/medusa'

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  countryCode: string
  phone: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    countryCode: 'US',
    phone: ''
  })

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartId = localStorage.getItem('cart_id')
        
        if (!cartId) {
          // Если корзины нет, создаем новую и перенаправляем на корзину
          try {
            const response = await medusaClient.carts.create({
              region_id: 'reg_01K2JSQZG6D53TQEC2F7V3Y41P' // Europe region
            })
            const { cart } = response
            localStorage.setItem('cart_id', cart.id)
          } catch (error) {
            console.error('Error creating cart:', error)
          }
          router.push('/cart')
          return
        }

        const response = await medusaClient.carts.retrieve(cartId)
        console.log('Retrieved cart for checkout:', response)
        const { cart } = response
        
        if (!cart.items || cart.items.length === 0) {
          router.push('/cart')
          return
        }
        
        setCart(cart)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching cart:', err)
        setError('Failed to load cart. Please try again later.')
        setLoading(false)
      }
    }

    fetchCart()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cart) return

    setSubmitting(true)
    setError(null)

    try {
      // Добавляем адрес доставки
      const addressResponse = await medusaClient.carts.update(cart.id, {
        shipping_address: {
          first_name: form.firstName,
          last_name: form.lastName,
          address_1: form.address,
          city: form.city,
          postal_code: form.postalCode,
          country_code: form.countryCode,
          phone: form.phone
        },
        email: form.email
      })

      console.log('Updated cart with address:', addressResponse)

      // Здесь должна быть логика оформления заказа
      // Пока что просто показываем сообщение об успехе
      alert('Order placed successfully! (This is a demo - payment processing not implemented)')
      
      // Очищаем корзину
      localStorage.removeItem('cart_id')
      router.push('/products')
      
    } catch (err) {
      console.error('Error placing order:', err)
      setError('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getTotalPrice = () => {
    if (!cart || !cart.items) return '$0.00'
    const total = cart.items.reduce((sum: number, item: any) => sum + item.total, 0)
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
          href="/cart"
          className="text-indigo-600 hover:text-indigo-500"
        >
          Back to Cart
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
      <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Checkout
      </h1>

      <div className="mt-12">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {cart?.items?.map((item: any) => (
                <li key={item.id} className="py-6 flex">
                  <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                    <img
                      src={item.thumbnail || '/placeholder-product.jpg'}
                      alt={item.title}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.title}</h3>
                        <p className="ml-4">${(item.total / 100).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.variant.title}</p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Total</p>
              <p>{getTotalPrice()}</p>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    required
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    required
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    required
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    required
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleInputChange}
                    required
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <div className="mt-1">
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleInputChange}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

          <div className="flex justify-center text-sm text-center text-gray-500">
            <p>
              <Link
                href="/cart"
                className="text-indigo-600 font-medium hover:text-indigo-500"
              >
                <span aria-hidden="true"> &larr;</span> Back to Cart
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
