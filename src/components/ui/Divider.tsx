type DividerProps = {
  title: string
}

const Divider = ({title}: DividerProps) => {
  return (
    <div className="flex items-center gap-4">
      {title ?
        <>
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-gray-500 text-sm">{title}</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </>
        : <div className="flex-1 border-t border-gray-300"></div>
      }
    </div>
  )
}

export default Divider