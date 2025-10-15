export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/40 bg-card animate-fade-in">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 FiveM Premium Tools. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110">Community</a>
            <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110">Discord</a>
            <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110">Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
