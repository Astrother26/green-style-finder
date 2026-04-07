import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-16">
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-serif text-xl mb-3">
            <Leaf className="h-5 w-5" /> EcoThrift
          </div>
          <p className="text-sm opacity-80">Making sustainable fashion accessible through AI.</p>
        </div>
        <div>
          <h3 className="text-secondary font-sans font-semibold mb-3 text-base">Links</h3>
          {["/", "/about", "/contact"].map((p) => (
            <Link key={p} to={p} className="block text-sm opacity-80 hover:opacity-100 mb-1">
              {p === "/" ? "Home" : p.slice(1).charAt(0).toUpperCase() + p.slice(2)}
            </Link>
          ))}
        </div>
        <div>
          <h3 className="text-secondary font-sans font-semibold mb-3 text-base">Services</h3>
          <Link to="/list" className="block text-sm opacity-80 hover:opacity-100 mb-1">Sell Items</Link>
          <Link to="/rent" className="block text-sm opacity-80 hover:opacity-100 mb-1">Rent Fashion</Link>
          <Link to="/cart" className="block text-sm opacity-80 hover:opacity-100 mb-1">Shopping Cart</Link>
        </div>
        <div>
          <h3 className="text-secondary font-sans font-semibold mb-3 text-base">Contact</h3>
          <p className="text-sm opacity-80">hello@ecothrift.com</p>
          <p className="text-sm opacity-80 mt-1">+91 98765 43210</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-sm opacity-60">
        © {new Date().getFullYear()} EcoThrift. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
