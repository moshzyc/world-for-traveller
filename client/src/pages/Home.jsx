import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { StoreContext } from "../contexts/StoreContaxtProvider"

export const Home = () => {
  const navigate = useNavigate()
  const { categories, setCategory, setSubCategory } = useContext(StoreContext)

  const handleCategoryClick = (categoryName) => {
    setCategory(categoryName)
    setSubCategory([])
    navigate("/store")
  }

  return (
    <main className="min-h-screen bg-[#f0f7f0]">
      {/* Hero Section */}
      <section className="bg-[#2e7d32] py-20 text-white">
        <div className="mycontainer text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            World for Traveler
          </h1>
          <p className="mb-8 text-lg md:text-xl">
            Your Ultimate Destination for Travel & Outdoor Equipment
          </p>
        </div>
      </section>

      {/* Trip Planner Section */}
      <section className="pb-8 pt-5">
        <div className="mycontainer">
          <div
            onClick={() => navigate("/trip-planner")}
            className="group cursor-pointer"
          >
            <div className="transform overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:scale-105">
              <div className="relative h-64 w-full">
                <img
                  src="https://images.pexels.com/photos/4905089/pexels-photo-4905089.jpeg"
                  alt="Trip Planner"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30">
                  <div className="flex h-full flex-col items-center justify-center text-white">
                    <h2 className="mb-4 text-4xl font-bold">Trip Planner</h2>
                    <p className="text-xl">
                      Plan your journey with interactive maps and weather
                      forecasts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Guides Section */}
      <section className="bg-[#e8f5e9] py-5">
        <div className="mycontainer">
          <div
            onClick={() => navigate("/guides")}
            className="group cursor-pointer"
          >
            <div className="transform overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:scale-105">
              <div className="relative h-64 w-full">
                <img
                  src="https://images.pexels.com/photos/7412069/pexels-photo-7412069.jpeg"
                  alt="Travel Guides"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30">
                  <div className="flex h-full flex-col items-center justify-center text-white">
                    <h2 className="mb-4 text-4xl font-bold">Travel Guides</h2>
                    <p className="text-xl">
                      Explore our collection of travel tips and destination
                      guides
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="mycontainer">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#2e7d32]">
            Explore Our Categories
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {/* Store Categories */}
            {categories?.map((cat) => (
              <div
                key={cat._id}
                onClick={() => handleCategoryClick(cat.category)}
                className="group cursor-pointer"
              >
                <div className="transform overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:scale-105">
                  <div className="relative flex h-48 items-center justify-center bg-[#e8f5e9]">
                    <img
                      src={cat.image}
                      alt={cat.category}
                      className="h-full w-full select-none object-cover"
                      draggable="false"
                    />
                  </div>
                  <div className="bg-white p-6">
                    <h3 className="mb-2 text-xl font-semibold text-[#2e7d32]">
                      {cat.category}
                    </h3>
                    <p className="text-gray-600">
                      {cat.subCategory.length} subcategories
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#e8f5e9] py-16">
        <div className="mycontainer">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2e7d32]">
                <span className="text-2xl text-white">🎒</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#2e7d32]">
                Quality Equipment
              </h3>
              <p className="text-gray-600">
                Premium travel and outdoor gear for your adventures
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2e7d32]">
                <span className="text-2xl text-white">🌍</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#2e7d32]">
                Global Selection
              </h3>
              <p className="text-gray-600">
                Equipment for every destination and climate
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2e7d32]">
                <span className="text-2xl text-white">⭐</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#2e7d32]">
                Expert Advice
              </h3>
              <p className="text-gray-600">
                Professional guidance for your travel needs
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
