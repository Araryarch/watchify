import { Film } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Film className="w-5 h-5" />
              <span>Watchify</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Platform streaming film terbaik untuk hiburan Anda.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Navigasi</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Beranda</a></li>
              <li><a href="/films" className="hover:text-primary transition-colors">Film</a></li>
              <li><a href="/genres" className="hover:text-primary transition-colors">Genre</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Bantuan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kontak</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Ikuti Kami</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Watchify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
