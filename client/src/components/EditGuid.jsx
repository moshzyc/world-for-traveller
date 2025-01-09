import React, { useEffect, useState } from "react"
import { DELETE_GUIDE_URL, GET_GUIDE_URL } from "../constants/endPoint"
import axios from "axios"
import { EditGuideWin } from "./EditGuideWin"

export const EditGuide = () => {
  // ניהול מצב המדריכים והמדריך הנערך
  const [guides, setGuides] = useState([])
  const [guideEdited, setGuidesEdited] = useState(null)

  // טעינת המדריכים בעת טעינת הקומפוננטה
  useEffect(() => {
    getGuides()
  }, [])

  // פונקציה לקבלת המדריכים מהשרת
  const getGuides = async () => {
    try {
      const { data } = await axios.get(GET_GUIDE_URL)
      setGuides(data)
    } catch (error) {
      console.error(error)
    }
  }

  // פונקציה ליצירת רשימת המדריכים
  const guideGenerator = (arr) => {
    return arr.map((item) => (
      <div
        key={item._id}
        className="border-t border-green-100 p-6 transition-colors hover:bg-green-50"
      >
        <div className="flex gap-6">
          {/* תמונה ראשית של המדריך */}
          <img
            className="h-48 w-48 rounded-lg object-cover shadow-md"
            src={item.mainImage}
            alt={item.title}
          />
          {/* תוכן המדריך */}
          <div className="flex-1">
            <h3 className="mb-4 text-xl font-semibold text-green-800">
              {item.title}
            </h3>
            <div className="rounded-lg bg-green-50 p-3">
              <p className="whitespace-pre-line text-gray-600">
                {item.content || ""}
              </p>
            </div>
          </div>
          {/* כפתורי פעולה */}
          <div className="flex flex-col gap-3">
            {/* כפתור עריכה */}
            <button
              onClick={() => setGuidesEdited(item)}
              className="rounded-lg border border-green-500 px-6 py-2 text-green-600 transition-colors hover:bg-green-50"
            >
              Edit
            </button>
            {/* כפתור מחיקה */}
            <button
              onClick={async () => {
                try {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this guide?"
                    )
                  ) {
                    await axios.delete(DELETE_GUIDE_URL + `/${item._id}`)
                    getGuides() // רענון הרשימה לאחר מחיקה
                  }
                } catch (error) {
                  console.error(error)
                }
              }}
              className="rounded-lg bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="divide-y divide-green-100">
      {/* תצוגת המדריכים או הודעה אם אין מדריכים */}
      {guides.length > 0 ? (
        guideGenerator(guides)
      ) : (
        <div className="p-8 text-center text-gray-500">No guides available</div>
      )}
      {/* חלון עריכת מדריך */}
      {guideEdited && (
        <EditGuideWin
          {...guideEdited}
          onClose={() => {
            setGuidesEdited(null)
            getGuides() // רענון הרשימה לאחר עריכה
          }}
        />
      )}
    </div>
  )
}
