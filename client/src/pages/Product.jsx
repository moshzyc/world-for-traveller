import React, { useContext, useEffect, useState } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { PRODUCTS_URL } from "../constants/endPoint"
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  TelegramShareButton,
  LinkedinShareButton,
} from "react-share"
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaTelegram,
  FaLinkedin,
  FaShare,
  FaArrowLeft,
  FaLink,
} from "react-icons/fa"
import { Rating } from "../components/Rating"

export const Product = () => {
  const { addItem } = useContext(StoreContext)
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const shareUrl = `${window.location.origin}/product/${id}`
  const shareTitle = product
    ? `Check out ${product.title}!`
    : "Check out this product!"
  const shareDescription =
    product?.description || "Great product from our store!"

  useEffect(() => {
    getProduct()
  }, [id])

  const getProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await axios.get(`${PRODUCTS_URL}/product/${id}`)
      setProduct(data)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load product")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    const item = {
      title: product.title,
      category: product.category,
      price: product.price,
      quantity: 1,
      productId: product.productId,
    }
    addItem(item)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  if (loading) {
    return (
      <div className="mycontainer flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2e7d32]"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mycontainer flex min-h-screen items-center justify-center">
        <div className="max-w-md rounded-lg bg-red-50 p-8 text-center text-red-600">
          <p className="mb-4">{error || "Product not found"}</p>
          <button onClick={() => navigate(-1)} className="blackBtn">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mycontainer py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-[#2e7d32] hover:text-[#1b5e20]"
      >
        <FaArrowLeft className="mr-2" />
        Back to Store
      </button>

      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg bg-white shadow-md">
        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
            <img
              className="h-full w-full rounded-lg bg-[#f0f7f0] object-contain"
              src={
                product.images?.[0] && !product.images[0].includes("example")
                  ? product.images[0]
                  : "https://via.placeholder.com/400"
              }
              alt={product.title}
            />
          </div>

          {/* Product Details Section */}
          <div className="flex h-full flex-col">
            <h1 className="mb-4 text-2xl font-bold text-[#2e7d32] md:text-3xl">
              {product.title}
            </h1>

            <div className="mb-4 rounded-lg bg-[#f0f7f0] p-4">
              <p className="mb-2 text-base font-semibold md:text-lg">
                Category:{" "}
                <span className="text-[#2e7d32]">{product.category}</span>
              </p>
              {product.subCategory && (
                <p className="text-base font-semibold md:text-lg">
                  Sub-category:{" "}
                  <span className="text-[#2e7d32]">{product.subCategory}</span>
                </p>
              )}
            </div>

            <div className="flex-grow">
              <p className="mb-4 text-sm text-gray-600 md:text-base">
                {product.description}
              </p>
            </div>

            <div className="mt-4">
              <p className="mb-4 text-xl font-bold text-[#2e7d32] md:text-2xl">
                ${product.price}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="blackBtn flex-grow py-2"
                >
                  Add to Cart
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="rounded-full bg-[#f0f7f0] p-2 text-[#2e7d32] transition-colors hover:bg-[#2e7d32] hover:text-white"
                    aria-label="Share"
                  >
                    <FaShare />
                  </button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute bottom-full left-0 z-50 mb-2 flex -translate-x-[calc(100%-40px)] flex-row-reverse gap-3 rounded-lg bg-white p-3 shadow-lg">
                      <button
                        onClick={handleCopyLink}
                        className="transition-transform hover:scale-110"
                      >
                        <div className="relative rounded-full p-2 hover:bg-gray-100">
                          <FaLink className="text-xl text-gray-600" />
                          {copySuccess && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
                              Link copied!
                            </div>
                          )}
                        </div>
                      </button>

                      <WhatsappShareButton
                        url={shareUrl}
                        title={shareTitle}
                        className="transition-transform hover:scale-110"
                      >
                        <div className="rounded-full p-2 hover:bg-gray-100">
                          <FaWhatsapp className="text-xl text-[#25D366]" />
                        </div>
                      </WhatsappShareButton>

                      <FacebookShareButton
                        url={shareUrl}
                        quote={shareTitle}
                        className="transition-transform hover:scale-110"
                      >
                        <div className="rounded-full p-2 hover:bg-gray-100">
                          <FaFacebook className="text-xl text-[#1877F2]" />
                        </div>
                      </FacebookShareButton>

                      <TwitterShareButton
                        url={shareUrl}
                        title={shareTitle}
                        className="transition-transform hover:scale-110"
                      >
                        <div className="rounded-full p-2 hover:bg-gray-100">
                          <FaTwitter className="text-xl text-[#1DA1F2]" />
                        </div>
                      </TwitterShareButton>

                      <EmailShareButton
                        url={shareUrl}
                        subject={shareTitle}
                        body={shareDescription}
                        className="transition-transform hover:scale-110"
                      >
                        <div className="rounded-full p-2 hover:bg-gray-100">
                          <FaEnvelope className="text-xl text-gray-600" />
                        </div>
                      </EmailShareButton>

                      <TelegramShareButton
                        url={shareUrl}
                        title={shareTitle}
                        className="transition-transform hover:scale-110"
                      >
                        <div className="rounded-full p-2 hover:bg-gray-100">
                          <FaTelegram className="text-xl text-[#0088cc]" />
                        </div>
                      </TelegramShareButton>

                      <LinkedinShareButton
                        url={shareUrl}
                        title={shareTitle}
                        summary={shareDescription}
                        className="transition-transform hover:scale-110"
                      >
                        <div className="rounded-full p-2 hover:bg-gray-100">
                          <FaLinkedin className="text-xl text-[#0A66C2]" />
                        </div>
                      </LinkedinShareButton>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Rating
                productId={product._id}
                rating={product.rating}
                onRatingUpdate={(newRating) => {
                  setProduct((prev) => ({
                    ...prev,
                    rating: newRating,
                  }))
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
