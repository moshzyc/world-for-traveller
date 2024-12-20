import React, { useState } from "react"
import { AddProducts } from "../components/AddProducts"
import { EditProduct } from "../components/EditProduct"
import { DeleteProduct } from "../components/DeleteProduct"

export const Admin = () => {
  const [add, setAdd] = useState(false)
  const [edit, setedit] = useState(false)
  const [del, setDel] = useState(false)
  return (
    <main>
      <div className="mycontainer">
  
          <h2 className="ml-[5%] text-2xl">Products Management</h2>
          <div className="m-auto w-[90%] border border-black">
            <div onClick={() => setAdd((p) => !p)}>
              <h3 className="text-lg">{add ? "-" : "+"}Add Products</h3>
            </div>
            <div
              className={`border-b border-t border-black ${add ? "block" : "hidden"}`}
            >
                <AddProducts/>
            </div>
            <div onClick={() => setedit((p) => !p)}>
              <h3 className="text-lg">{edit ? "-" : "+"}Edit Products</h3>
            </div>
            <div
              className={`border-b border-t border-black ${edit ? "block" : "hidden"}`}
            >
              <EditProduct/>
            </div>
            <div onClick={() => setDel((p) => !p)}>
              <h3 className="text-lg">{del ? "-" : "+"}Delete Products</h3>
            </div>
            <div
              className={`border-t border-black ${del ? "block" : "hidden"}`}
            >
             <DeleteProduct/>
            </div>
          </div>
      </div>
    </main>
  )
}
