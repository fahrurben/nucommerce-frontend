import react, { useState, useEffect } from 'react'
import React from 'react'
import TextFormField from '@/components/form/TextFormField.jsx'
import { useFieldArray, useForm } from 'react-hook-form'
import { Form } from "@/components/ui/form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingButton } from '@/components/ui/loading-button';
import {
  categoryUrl,
  EDITING,
  INITIAL,
  LOADING, productUrl,
} from '../../common/constant.js'
import { useNavigate } from 'react-router-dom'
import { getData, patchData, postData } from '../../common/ApiHelper.js'
import SelectFormField from '../../components/form/SelectFormField.jsx'
import { Input } from "@/components/ui/input"

import { Plus, TrashIcon } from "lucide-react"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast"
import UploadFormField from '../../components/form/UploadFormField.jsx'

const variantSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be minimal 3 characters.",
  }),
  image: z.string(),
  price: z.number(),
  stock: z.number(),
});

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be minimal 3 characters.",
  }),
  category_id: z.number(),
  thumbnail: z.string(),
  description: z.string().optional(),
  variant_set: z.array(variantSchema),
})

const CreateProduct = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category_id: null,
      description: '',
      thumbnail: '',
      variant_set: [{
        id: null,
        name: '',
        image: '',
        price: '0',
        stock: '0',
      }],
    },
  })
  const [status, setStatus] = useState(INITIAL)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const loading = status === LOADING
  const [categories, setCategories] = useState([])
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "variant_set" });
  const { toast } = useToast()

  const onSubmit = async (formData) => {
    let response = null
    try {
      setStatus(LOADING)
      response = await postData(productUrl, formData)
      toast({
        title: "Success",
        description: "Product already saved",
      })
      setTimeout(() => {
        navigate('/products')
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

  const addVariant = () => {
    append({
      id: null,
      name: '',
      image: '',
      price: '0',
      stock: '0',
    })
  }

  useEffect(() => {
    getData(categoryUrl).then((response) => {
      let categories = response.data.results.map((item) => {
        return {value: item.id, label: item.name}
      })
      setCategories(categories)
    })
  }, [])

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="w-full flex">Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"
                    style={{ width: '100%' }}>
                {
                  error && <p className="text-red-500">{error}</p>
                }
                <TextFormField form={form} name="name" label="Name"
                               required={true}/>
                <SelectFormField form={form} name="category_id" label="Category"
                                 placeholder="Select Category"
                                 items={categories} required={true}/>
                <UploadFormField form={form} name="thumbnail" label="Thumbnail"
                                 required={true} />
                <TextFormField form={form} name="description"
                               label="Description"/>

                <Card>
                  <CardHeader>
                    <CardTitle className="w-full flex">
                      <h5 className="font-bold">Variants</h5>
                      <Button className="ml-auto" onClick={addVariant}><Plus
                        ize={12}/></Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 my-4">
                        <FormField
                          control={form.control}
                          name={`variant_set.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input placeholder="Name"
                                       type="text" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variant_set.${index}.image`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input placeholder="Image"
                                       type="text" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variant_set.${index}.price`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input placeholder="Price"
                                       type="number" {...field}
                                       onChange={event => field.onChange(+event.target.value)}/>
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variant_set.${index}.stock`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input placeholder="Stock"
                                       type="number" {...field}
                                       onChange={event => field.onChange(+event.target.value)}/>
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                        <Button onClick={() => remove(index)}><TrashIcon
                          size={12}/></Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button variant="secondary" size={24} className="px-4"
                          onClick={() => navigate('/products/')}>Cancel</Button>
                  <LoadingButton loading={loading}
                                 type="submit">Submit</LoadingButton>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateProduct