'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import medusaClient from '@/lib/medusa'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product:', productId)
        const response = await medusaClient.products.retrieve(productId)
        console.log('Product response:', response)
        const { product } = response
        setProduct(product)
        if (product.variants && product.variants.length > 0) {
          setSelectedVariant(product.variants[0])
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product. Please try again later.')
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleAddToCart = async () => {
    try {
      // Здесь будет логика добавления в корзину
      console.log('Adding to cart:', {
        productId,
        variantId: selectedVariant?.id,
        quantity
      })
      alert('Product added to cart! (Cart functionality will be implemented)')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart')
    }
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
          ← Back to Products
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link
          href="/products"
          className="text-indigo-600 hover:text-indigo-500"
        >
          ← Back to Products
        </Link>
      </div>
    )
  }

  const price = selectedVariant?.prices && selectedVariant.prices.length > 0
    ? `$${(selectedVariant.prices[0].amount / 100).toFixed(2)}`
    : 'Price not available'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-8">
        <Link
          href="/products"
          className="text-indigo-600 hover:text-indigo-500"
        >
          ← Back to Products
        </Link>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Product Image */}
        <div className="flex flex-col-reverse">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <img
              src={product.thumbnail || '/placeholder-product.jpg'}
              alt={product.title}
              className="w-full h-full object-center object-cover sm:rounded-lg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {product.title}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900">{price}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              <p>{product.description || 'No description available.'}</p>
            </div>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 1 && (
            <div className="mt-6">
              <h3 className="text-sm text-gray-600 font-medium">Variants</h3>
              <div className="mt-2 flex space-x-3">
                {product.variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      selectedVariant?.id === variant.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <div className="flex items-center space-x-3">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="rounded-md border border-gray-300 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-10 flex sm:flex-col1">
            <button
              onClick={handleAddToCart}
              className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-full"
            >
              Add to Cart
            </button>
          </div>

          {/* Product Details */}
          {product.metadata && Object.keys(product.metadata).length > 0 && (
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Details</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ul>
                  {Object.entries(product.metadata).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
