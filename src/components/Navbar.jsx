import React from "react";
import { DarkThemeToggle, Navbar, Dropdown, Avatar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../_store";
import { Link } from "react-router-dom";


export default function DefaultNavbar() {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.auth?.isLogged);
  const roles = useSelector((state) => state.auth?.roles);
  const user = useSelector((state) => state.auth?.user);

  const logout = () => dispatch(authActions.logout());

  if (!isLogged) return null;
  
  const hasRole = (role) => roles.includes(role);


  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} to="/">
        <img
          alt="Flowbite React Logo"
          className="mr-3 h-6 sm:h-9 border"
          // src="https://flowbite.s3.amazonaws.com/logo.svg"
          src="/images/logo.png"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Linkuup Medical
        </span>
      </Navbar.Brand>

      <div className="flex md:order-2">
        <Dropdown
          inline
          label={
            <Avatar
              alt={`${user?.firstName}`}
              img="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
              // img="/images/bekanty.jpg"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="block text-sm truncate font-medium">
              {user?.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
        </Dropdown>
      </div>

      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/">
          Home
        </Navbar.Link>

       
        {(hasRole("ROLE_ADMIN") || hasRole("ROLE_MODERATOR")) && (
          <>
            <Navbar.Link as={Link} to="/manager">
              Manager
            </Navbar.Link>

            {hasRole("ROLE_ADMIN") && (
              <Navbar.Link as={Link} to="/admin">
                Admin
              </Navbar.Link>
            )}
          </>
        )}

        <Navbar.Link as={Link} to="/about">
          About
        </Navbar.Link>
      </Navbar.Collapse>
      <DarkThemeToggle />
    </Navbar>
  );
}
