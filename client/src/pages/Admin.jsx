import React, { useState } from 'react'
import AddProduct from '../components/AddProduct'
import EditProduct from '../components/EditProduct'
import DeleteProduct from '../components/DeleteProduct'

export default function Admin() {
    const [add,setAdd] = useState(false)
    const [edit,setEdit] = useState(false)
    const [del,setDel] = useState(false)
  return (
    <main>
        <div className="mycontainer">
            
                    <h2 className='text-2x1 ml-[5%]'>Products Menagement</h2>
            <div className="w-[90%] m-auto border border-black">
                <div onClick={()=>setAdd(p=>!p)} className="border-t border-black">
                    <h3 className="text-lg"> {add?"-":"+"}Add Product</h3>
                </div>
                <div className={`border-t border-b border-black ${add ? "blok" : "hidden"}`}>
                <AddProduct/>
                </div>
                <div onClick={()=>setEdit(p=>!p)} className="border-t border-black">
                    <h3 className="text-lg"> {edit?"-":"+"}edit Product</h3>
                </div>
                <div className={`border-t border-b border-black ${edit? "blok" : "hidden"}`}>
                <EditProduct/>
                </div>
                <div onClick={()=>setDel(p=>!p)} className="border-t border-black">
                    <h3 className="text-lg"> {del?"-":"+"}del Product</h3>
                </div>
                <div className={`border-t border-b border-black ${del ? "blok" : "hidden"}`}>
                <DeleteProduct/>
                </div>
            </div>       
           </div>
    </main>
  )
}
