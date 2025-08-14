'use client'

import { useState } from 'react'
import Link from 'next/link'

// Это заглушка для демонстрации, в реальном приложении данные будут загружаться из API
const cartItems = [
  {
    id: '1',
    title: 'Sample Product 1',
    variant: 'Default',
    quantity: 1,
    price: 1999,
    thumbnail: null
  },
  {
    id: '2',
    title: 'Sample Product 2',
    variant: 'Default',
    quantity: 2,
    price: 2499,
    thumbnail: null
  }
]

export default function CartPage() {
  const [items, setItems] = useState(cartItems)

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 500 // $5.00 shipping fee
  const total = subtotal + shipping

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>

            <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
              {items.length === 0 ? (
                <li className="py-6 flex">
                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <p className="text-gray-500">Your cart is empty</p>
                    <div className="mt-4">
                      <Link href="/products" className="text-indigo-600 hover:text-indigo-500">
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </li>
              ) : (
                items.map((item) => (
                  <li key={item.id} className="py-6 flex">
                    <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-center object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link href={`/products/${item.id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                {item.title}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">{item.variant}</p>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">${(item.price / 100).toFixed(2)}</p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="flex items-center">
                            <button
                              type="button"
                              className="text-gray-500 focus:outline-none focus:text-gray-600"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <span className="sr-only">Decrease quantity</span>
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="mx-2 text-gray-700">{item.quantity}</span>
                            <button
                              type="button"
                              className="text-gray-500 focus:outline-none focus:text-gray-600"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <span className="sr-only">Increase quantity</span>
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>

                          <div className="absolute top-0 right-0">
                            <button
                              type="button"
                              className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                              onClick={() => removeItem(item.id)}
                            >
                              <span className="sr-only">Remove</span>
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">${(subtotal / 100).toFixed(2)}</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-sm text-gray-600">Shipping estimate</dt>
                <dd className="text-sm font-medium text-gray-900">${(shipping / 100).toFixed(2)}</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">${(total / 100).toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link
                href="/checkout"
                className={`w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-disabled={items.length === 0}
                onClick={(e) => items.length === 0 && e.preventDefault()}
              >
                Checkout
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
