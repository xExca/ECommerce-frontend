import { Icon } from "@iconify/react"


const CoverImage = () => {
  return (
     <div className="relative h-60">
        <img
          src="https://img.freepik.com/free-vector/night-landscape-with-lake-mountains-trees-coast-vector-cartoon-illustration-nature-scene-with-coniferous-forest-river-shore-rocks-moon-stars-dark-sky_107791-8253.jpg?w=1480"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute -bottom-16 left-8">
          <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-white bg-white">
            <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
          </div>

          <button
            type="button"
            className="absolute bottom-0 left-[125px] h-10 w-10 rounded-full bg-white shadow border flex items-center justify-center"
          >
            <Icon icon="lucide:camera" className="w-6 h-6" />
          </button>
        </div>
      </div>
  )
}

export default CoverImage