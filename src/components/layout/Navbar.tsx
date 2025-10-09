import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";

export default function Navbar() {
  return (
    <HeroNavbar isBordered className="bg-background text-foreground">
      <NavbarBrand>
        <p className="font-bold text-xl text-primary">FoamBoss</p>
      </NavbarBrand>

      <NavbarContent justify="center">
        <NavbarItem>
          <Link href="/" className="text-foreground">Dashboard</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/jobs" className="text-foreground">Jobs</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/materials" className="text-foreground">Materials</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/settings" className="text-foreground">Settings</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="primary" variant="flat">
            New Estimate
          </Button>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
}
