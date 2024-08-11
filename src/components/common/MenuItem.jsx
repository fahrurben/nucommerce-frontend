import react, {useState} from 'react'
import { ChevronDown } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const MenuItem = ({title, url, items}) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const onMenuEnter = () => {
    setIsOpen(true)
  }

  const onMenuLeave = () => {
    setIsOpen(false)
  }

  return (
    <li key={url} className="relative" onMouseEnter={onMenuEnter} onMouseLeave={onMenuLeave}>
      <a href="#" className="flex px-4 nav-link">{title}<ChevronDown size={24} on /></a>
      <ul className={`absolute top-6 bg-blue-950 px-4 nav-dropdown ${isOpen ? "block" : "hidden"}`}>
        {
          items.map((subMenu) => {
            return <li key={subMenu.url} className="py-2"><a href="#" onClick={() => navigate(subMenu.url)}>{subMenu.title}</a></li>
          })
        }
      </ul>
    </li>
  )
}

export default MenuItem