import LoginForm from '@/components/signin/LoginForm'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
     const session = await getServerSession(authOptions)

    if (session) {
        redirect('/')
    }
  return (
    <>
    <LoginForm/>
    </>
  )
}

export default page