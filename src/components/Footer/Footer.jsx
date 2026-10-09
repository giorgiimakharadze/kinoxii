import './Footer.css'
import { Copyright } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-inner'>
        <div className='footer-logo'>
          <span className='kino'>KINO</span>
          <span className='xii'>XII</span>
        </div>
        <p className='footer-copy'>
          © {new Date().getFullYear()} Kino XII. All rights reserved.
        </p>
      </div>
    </footer>
  );
}