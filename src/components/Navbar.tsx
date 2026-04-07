import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/list", label: "Sell" },
  { path: "/rent", label: "Rent" },
  { path: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-primary font-serif text-2xl font-bold">
          <Leaf className="h-7 w-7" />
          EcoThrift
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`font-medium transition-colors hover:text-secondary ${
                  location.pathname === item.path ? "text-secondary" : "text-primary"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-primary">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="text-primary">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 pb-4">
          <ul className="flex flex-col gap-2 pt-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 font-medium ${
                    location.pathname === item.path ? "text-secondary" : "text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-2 pt-2">
              <Link to="/cart" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm"><ShoppingCart className="h-4 w-4 mr-1" /> Cart</Button>
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm"><User className="h-4 w-4 mr-1" /> Profile</Button>
              </Link>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="bg-primary text-primary-foreground">Sign In</Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
