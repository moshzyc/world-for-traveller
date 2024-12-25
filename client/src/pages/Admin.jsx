import React, { useState } from "react"
import { AddProducts } from "../components/AddProducts"
import { EditProduct } from "../components/EditProduct"
import {AddGuide} from '../components/AddGuide'
import { EditGuide } from "../components/EditGuid"

export const Admin = () => {
  const [addProducts, setAddProducts] = useState(false)
  const [AddGuides, setAddGuid] = useState(false)
  const [editProducts, seteditEditProducts] = useState(false)
  const [editGuides, seteditEditGuidss] = useState(false)

  return (
    <main>
      <div className="mycontainer">
        <h2 className="ml-[5%] text-2xl">Products Management</h2>
        <div className="m-auto w-[90%] border border-black">
          <div onClick={() => setAddProducts((p) => !p)}>
            <h3 className="text-lg">{addProducts ? "-" : "+"}Add Products</h3>
          </div>
          {addProducts && (
            <div className={`border-b border-t border-black`}>
              <AddProducts />
            </div>
          )}
          <div onClick={() => seteditEditProducts((p) => !p)}>
            <h3 className="text-lg">{editProducts ? "-" : "+"}Edit Products</h3>
          </div>
          {editProducts && (
            <div className={`border-b border-t border-black`}>
              <EditProduct />
            </div>
          )}
        </div>
        <h2 className="ml-[5%] text-2xl">Guides Management</h2>
        <div className="m-auto w-[90%] border border-black">
          <div onClick={() => setAddGuid((p) => !p)}>
            <h3 className="text-lg">{AddGuides ? "-" : "+"}Add Guide</h3>
          </div>
          {AddGuides && (
            <div className={`border-b border-t border-black`}>
              <AddGuide />
            </div>
          )}
          <div onClick={() => seteditEditGuidss((p) => !p)}>
            <h3 className="text-lg">{editGuides ? "-" : "+"}Edit Guide</h3>
          </div>
          {editGuides && (
            <div className={`border-b border-t border-black`}>
              <EditGuide />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
