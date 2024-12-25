import React, { useEffect, useState } from "react"
import { DELETE_GUIDE_URL, GET_GUIDE_URL } from "../constants/endPoint"
import axios from "axios"
import { EditGuideWin } from "./EditGuideWin"

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
            <img className="w-[25%]" src={item.images[0]} alt="" />
            <div>
              <p>title: {item.title}</p>
              <div className="w-[80%]">
                {/* הדפס את כל הפסקאות בנפרד */}
                {item.content.map((paragraph, index) => (
                  <p key={index}>paragraph-{index+1} : {paragraph}</p>
                ))}
              </div>
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
                  if (window.confirm("are you sure?"))
                    await axios.delete(DELETE_GUIDE_URL + `/${item._id}`)
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
