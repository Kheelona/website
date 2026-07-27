function App() {
  const [orderOpen, setOrderOpen] = React.useState(false);

  const onNav = (id) => {
    if (id === 'order') { setOrderOpen(true); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Re-render Lucide icons after each tree change
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  return (
    <div data-screen-label="Marketing landing">
      <Header onNav={onNav} />
      <Hero onCTA={() => setOrderOpen(true)} />
      <ValueGrid />
      <HowItWorks />
      <ProductCard />
      <Story />
      <Audience />
      <NewsletterCTA />
      <Footer />
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
