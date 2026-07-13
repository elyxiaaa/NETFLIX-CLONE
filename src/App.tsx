/**
 * Route table. The `Layout` route wraps every page with the persistent shell
 * (navbar, footer, detail modal); each child route renders a browse page.
 * Unknown paths redirect home.
 */
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { TVShowsPage } from "./pages/TVShowsPage";
import { MoviesPage } from "./pages/MoviesPage";
import { NewPopularPage } from "./pages/NewPopularPage";
import { SearchPage } from "./pages/SearchPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tv" element={<TVShowsPage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="new" element={<NewPopularPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
