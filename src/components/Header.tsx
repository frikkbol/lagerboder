import { Navbar } from "./storage/Navbar"
import type { NavbarProps } from "./storage/Navbar"

export default function Header(props: NavbarProps) {
  return <Navbar {...props} />
}
