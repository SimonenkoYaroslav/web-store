import { userService } from '@modules/user/services'
import { NavbarClient } from './NavbarClient'

const Navbar = async () => {
    const currentUser = await userService.fetchCurrentUser()

    return <NavbarClient user={currentUser ?? null} />
}

export default Navbar
