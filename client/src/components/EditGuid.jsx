import React, { useEffect, useState } from "react"
import { DELETE_GUIDE_URL, GET_GUIDE_URL } from "../constants/endPoint"
import axios from "axios"
import { EditGuideWin } from "./GuideMennagement"

export const EditGuide = () => {
  const [guides, setGuides] = useState([])
  const [guideEdited, setGuidesEdited] = useState(null)

  useEffect(() => {
    getGuides()
  }, [])
  const getGuides = async () => {
    try {
      const { data } = await axios.get(GET_GUIDE_URL)
      setGuides(data)
    } catch (error) {
      console.error(error)
    }
  }

  const guideGenerator = (arr) => {
    const guidesArr = arr.map((item) => {
      return (
        <div key={item._id} className="flex border-t border-black p-2">
          <div className="flex gap-2">
            <img src={item.images[0]} alt="" />
            <div>
              <p>title: {item.title}</p>
              <p>content: {item.content}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setGuidesEdited(item)}
              className="whiteBtn w-[80px]"
            >
              edit
            </button>
            <button
              onClick={async () => {
                try {
                  if (window.confirm("are you shoore?"))
                    await axios.delete( DELETE_GUIDE_URL+ `/${item._id}`)
                } catch (error) {
                  console.error(error)
                }
              }}
              className="redBtn w-[80px]"
            >
              delete
            </button>
          </div>
        </div>
      )
    })
    return guidesArr
  }
  return (
    <div>
      {guideGenerator(guides)}
      {guideEdited && (
        <EditGuideWin {...guideEdited} onClose={() => setGuidesEdited(null)} />
      )}
    </div>
  )
}
