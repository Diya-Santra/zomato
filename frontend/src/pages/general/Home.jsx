import React, { useState, useRef, useEffect } from 'react'

const Home = () => {
  // Sample video data - replace with actual data from API
  const [videos] = useState([
    {
      id: 1,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'Experience the finest culinary delights at our restaurant. Fresh ingredients, authentic flavors, and exceptional service await you.',
      storeId: 'store-1'
    },
    {
      id: 2,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: 'Join us for an unforgettable dining experience with our signature dishes crafted by world-class chefs.',
      storeId: 'store-2'
    },
    {
      id: 3,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: 'Discover a fusion of traditional and modern cuisine in a cozy atmosphere perfect for any occasion.',
      storeId: 'store-3'
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
          className="relative h-screen w-full snap-start flex items-center justify-center"
        >
          {/* Video */}
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            className="h-full w-full object-cover"
            src={video.videoUrl}
            loop
            muted
            playsInline
          />

          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            {/* Description */}
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

            {/* Visit Store Button */}
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
