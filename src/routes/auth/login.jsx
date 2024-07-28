import React, { useState } from 'react';
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import TextFormField from '../../components/form/TextFormField.jsx'
import { authUrl, EDITING, INITIAL, LOADING } from '../../common/constant.js'
import { postData } from '../../common/ApiHelper.js'
import { useAuth } from '../AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }).email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

const Login = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const {setTokenDetails} = useAuth()

  const [status, setStatus] = useState(INITIAL)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const onSubmit = async (formData) => {
    let data = null
    try {
      setStatus(LOADING)
      data = await postData(authUrl, formData)
      setTokenDetails({
        token: data.access,
        expired: moment().add(1, 'hours').valueOf()
      })
      navigate('/')
    } catch (e) {
      setStatus(EDITING)
      setError(e.response.data?.detail)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" style={{width: '300px'}}>
          {
            error && <p className="text-red-500">{error}</p>
          }
          <TextFormField form={form} name="email" label="Email" type="email" />
          <TextFormField form={form} name="password" label="Password" type="password" />
          <Button type="submit" className="mt-2">Login</Button>
        </form>
      </Form>
    </div>
  )
}

export default Login