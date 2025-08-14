'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import medusaClient from '@/lib/medusa'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { product } = await medusaClient.products.retrieve(id)
        setProduct(product)
        setSelectedVariant(product.variants[0])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product. Please try again later.')
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = async () => {
    try {
      // В реальном приложении здесь был бы код для добавления товара в корзину
      alert(`Added ${quantity} item(s) to cart!`)
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert('Failed to add to cart. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-gray-800">{error || 'Product not found'}</p>
        <button 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              {product.thumbnail ? (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-center object-cover"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.title}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">
                {selectedVariant?.prices[0]
                  ? `$${(selectedVariant.prices[0].amount / 100).toFixed(2)}`
                  : 'Price not available'}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-6">
              {product.variants.length > 1 && (
                <div>
                  <h3 className="text-sm text-gray-600">Variants</h3>
                  <div className="mt-1 grid grid-cols-3 gap-4">
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className={`border rounded-md p-3 cursor-pointer ${
                          selectedVariant?.id === variant.id ? 'ring-2 ring-indigo-500' : ''
                        }`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        <p className="text-sm font-medium text-gray-900">{variant.title}</p>
                        <p className="text-sm text-gray-500">
                          {variant.prices[0]
                            ? `$${(variant.prices[0].amount / 100).toFixed(2)}`
                            : 'Price not available'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex">
                <div className="flex items-center mr-4">
                  <button
                    type="button"
                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <span className="sr-only">Decrease quantity</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="mx-2 text-gray-700">{quantity}</span>
                  <button
                    type="button"
                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <span className="sr-only">Increase quantity</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>

                <button
                  type="button"
                  className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
