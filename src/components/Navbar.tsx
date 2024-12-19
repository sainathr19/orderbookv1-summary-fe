import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='px-6 py-2 bg-slate-100 flex justify-start items-center gap-10'>
        <section className='text-xl'>
          <Link className='font-medium text-3xl' href='/'>OrderBook V1</Link>
        </section>
    </nav>
  )
}

export default Navbar
