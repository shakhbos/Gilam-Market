'use client'
import { Link, useRouter } from '../i18n/routing'
import Image from 'next/image'
import React from 'react'
import { BackIcons } from './icons'

export default function Back() {
  const router = useRouter()
  return (
    <div className="flex z-[10000]  items-center gap-[26px] justify-self-start self-start">
      <Link className=' inline-block  mx-auto' href='/'>
        <Image className='min-w-[130px] w-[130px] h-[58px]' src={'/logo.svg'} width={130} height={58} alt="image" title='gr-code' />
      </Link>
      <div onClick={() => router.back()} className='p-[10px] bg-white cursor-pointer'> <BackIcons /></div>
    </div>
  )
}
