import React, {useState}  from 'react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { postData } from '../../common/ApiHelper.js'
import { mediaUrl } from '../../common/constant.js'

const UploadFormField = ({form, name, label, required = false}) => {
  const [file, setFile] = useState(null)

  const handleFileChange = async (e, field) => {
    if (e.target.files) {
      let file = e.target.files[0]
      setFile(file);
      const formData = new FormData();
      formData.append('image', file);
      let response = await postData('/media_upload/', formData)
      field.onChange(file.name)
    }
  }

  return (
    <>
      <img src={mediaUrl + form.getValues(name)} alt="image" style={{width: '200px', height: '100px'}} />
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {label}
              {required && <span className="text-red-500"> *</span>}
            </FormLabel>
            <FormControl>
              <Input placeholder={label} type="file" onChange={(e) => handleFileChange(e, field)}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default UploadFormField