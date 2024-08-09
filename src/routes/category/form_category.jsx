import React, { useEffect, useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import TextFormField from '../../components/form/TextFormField.jsx'
import {
  authUrl, baseUrl,
  categoryUrl,
  EDITING,
  INITIAL,
  LOADING,
} from '../../common/constant.js'
import { patchData, postData } from '../../common/ApiHelper.js'

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useAuth } from '../AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import moment from 'moment/moment.js'
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { LoadingButton } from '@/components/ui/loading-button';

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be minimal 3 characters.",
  })
})

const FormCategory = ({modalOnClose, initialData}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name,
    },
  })
  const { toast } = useToast()

  const {setTokenDetails} = useAuth()

  const [status, setStatus] = useState(INITIAL)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const loading = status === LOADING


  const onSubmit = async (formData) => {
    let response = null
    try {
      setStatus(LOADING)
      if (initialData.hasOwnProperty('id')) {
        response = await patchData(categoryUrl + initialData.id + '/', formData)
      } else {
        response = await postData(categoryUrl, formData)
      }
      modalOnClose()
      toast({
        title: "Success",
        description: "Category already saved",
      })
      setTimeout(() => {
        navigate(0)
      }, 1500)
    } catch (e) {
      setStatus(EDITING)
      const errorObj = e.response?.data
      if (errorObj) {
        const key = Object.keys(errorObj)[0]
        form.setError(key, {
          type: "manual",
          message: errorObj[key],
        })
      }
    }
  }

  return (
      <div className="flex items-center space-x-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" style={{width: '460px'}}>
            {
              error && <p className="text-red-500">{error}</p>
            }
            <TextFormField form={form} name="name" label="Name" required={true} />
            <div className="flex justify-end">
              <LoadingButton loading={loading} type="submit">
                Submit
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>
  )

}

export default FormCategory