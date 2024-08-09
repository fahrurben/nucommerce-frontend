import React, { useState, useEffect } from 'react'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { MoreHorizontal } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import FormCategory from './form_category.jsx'
import { deleteData, getData } from '../../common/ApiHelper.js'
import { categoryUrl } from '../../common/constant.js'
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from 'react-router-dom'

const CategoryList = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isShowConfirmation, setIsShowConfirmation] = useState(false)
  const [data, setData] = useState([])
  const [category, setCategory] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const createClicked = (e) => setIsOpen(true)
  const editClicked = async (id) => {
    const response = await getData(categoryUrl + id)
    setCategory(response.data)
    setIsEditOpen(true)
  }

  const deleteClicked = (id) => {
    setSelectedId(id)
    setIsShowConfirmation(true)
  }

  const deleteCategory = async () => {
    await deleteData(categoryUrl + selectedId + '/')
    modalOnClose()
    toast({
      title: "Success",
      description: "Category already deleted",
    })
    setTimeout(() => {
      navigate(0)
    }, 1500)
  }

  const modalOnClose = () => setIsOpen(false)
  const editModalOnClose = () => setIsEditOpen(false)
  const confirmationModalOnClose = () => setIsShowConfirmation(false)
  const selected = data.find((value) => value.id === selectedId)

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const data = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => editClicked(data.id)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteClicked(data.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect( () => {
    const response = getData(categoryUrl + '?page_size=1000').then((response) => {
      setData(response.data.results)
    })
  }, [])

  return (
    <div className="p-4">
      <div className="flex">
        <h3 className="font-bold">Category</h3>
        <Button onClick={createClicked} className="ml-auto">Create</Button>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={modalOnClose}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Create</DialogTitle>
          </DialogHeader>
          <FormCategory modalOnClose={modalOnClose}/>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={editModalOnClose}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
          </DialogHeader>
          <FormCategory modalOnClose={editModalOnClose} initialData={category}/>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isShowConfirmation} onOpenChange={confirmationModalOnClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure to delete {selected?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCategory()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}

export default CategoryList