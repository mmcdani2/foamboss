import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
  Link,
  Button,
  Divider,
} from "@heroui/react";
import * as React from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <HeroNavbar
        isBlurred
        shouldHideOnScroll
        onMenuOpenChange={setIsMenuOpen}
        className="bg-content2/80 backdrop-blur-xl border-b border-default/30 shadow-lg"
      >
        <NavbarBrand>
          <p className="font-extrabold text-2xl text-secondary tracking-tight">FoamBoss</p>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          <NavbarItem>
            <Link href="/" color="foreground" className="font-medium hover:text-primary">
              Dashboard
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/estimator" color="foreground" className="font-medium hover:text-primary">
              Estimator
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/jobs" color="foreground" className="font-medium hover:text-primary">
              Jobs
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/materials" color="foreground" className="font-medium hover:text-primary">
              Materials
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/settings" color="foreground" className="font-medium hover:text-primary">
              Settings
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="hidden sm:flex">
            <Button color="secondary" variant="solid" radius="md">
              New Estimate
            </Button>
          </NavbarItem>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        </NavbarContent>

        <NavbarMenu>
          <NavbarMenuItem>
            <Link href="/" color="foreground">Dashboard</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/estimator" color="foreground">Estimator</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/jobs" color="foreground">Jobs</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/materials" color="foreground">Materials</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href="/settings" color="foreground">Settings</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Button color="secondary" variant="solid" fullWidth>
              New Estimate
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      </HeroNavbar>

      {/* Define depth separation */}
      <Divider className="bg-default/20" />
    </>
  );
}
