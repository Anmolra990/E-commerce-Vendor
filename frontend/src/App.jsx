import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}

export default App;