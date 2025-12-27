import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Home = () => {
  // Sample video data - replace with actual data from API
  const [videos] = useState([
    {
      id: 1,
      videoUrl: 'https://ik.imagekit.io/7m6cbkv4cy/f3dd093f-0dc6-4eda-a99b-4bbae1d73718_dBLls211t',
      description: 'Experience the finest culinary delights at our restaurant. Fresh ingredients, authentic flavors, and exceptional service await you.',
      storeId: 'store-1'
    },
    {
      id: 2,
      videoUrl: 'https://www.pexels.com/download/video/12409707/',
      description: 'Join us for an unforgettable dining experience with our signature dishes crafted by world-class chefs.',
      storeId: 'store-2'
    },
    {
      id: 3,
      videoUrl: 'https://www.pexels.com/download/video/30044483/',
      description: 'Discover a fusion of traditional and modern cuisine in a cozy atmosphere perfect for any occasion.',
      storeId: 'store-3'
    },
    {
      id: 4,
      videoUrl: 'https://media.istockphoto.com/id/2180374229/video/delicious-dumplings-placed-on-a-plate-and-picked-up-with-chopsticks.mp4?s=mp4-640x640-is&k=20&c=8vOE3-QiCQp7TB76T1iOpXO5FGaQLhlKlPRgXLotoC0=',
      description: 'Savor the taste of perfection with our handcrafted dishes made from locally sourced ingredients.',
      storeId: 'store-4'
    },
    {
      id: 5,
      videoUrl: 'https://www.pexels.com/download/video/8844431/',
      description: 'Indulge in our premium selection of gourmet meals, where every bite tells a story of culinary excellence.',
      storeId: 'store-5'
    }
  ])

  const videoRefs = useRef([])
  const containerRef = useRef(null)

  // Handle video playback based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      videoRefs.current.forEach((videoRef, index) => {
        if (!videoRef) return

        const rect = videoRef.getBoundingClientRect()
        const isInView = rect.top >= 0 && rect.top < window.innerHeight / 2

        if (isInView) {
          videoRef.play().catch(() => {
            // Handle autoplay restrictions
          })
        } else {
          videoRef.pause()
        }
      })
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      // Initial check
      handleScroll()

      return () => {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const handleVisitStore = (storeId) => {
    // Navigate to store page
    console.log('Visit store:', storeId)
    // You can use react-router-dom's useNavigate here
    // navigate(`/store/${storeId}`)
  }

  useEffect(()=>{
    axios.get("http://localhost:3000/food")
    .then(response=>{
      
    })
  })

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="relative h-screen w-full snap-start flex items-center justify-center p-0 md:p-8 lg:p-12"
        >
          <div className="relative w-full h-full">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="h-full w-full object-cover rounded-none md:rounded-2xl"
              src={video.videoUrl}
              loop
              muted
              playsInline
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 pb-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:left-8 md:right-8 lg:left-12 lg:right-12 rounded-none md:rounded-b-2xl">
            <div className="mb-4">
              <p
                className="text-white text-sm leading-relaxed"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {video.description}
              </p>
            </div>

            <button
              onClick={() => handleVisitStore(video.storeId)}
              className="w-full bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
            >
              Visit Store
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home
