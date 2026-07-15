import Sidebar from '../../../components/Sidebar [Renewed]/Sidebar.jsx'
import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  return (
      <div className={`flex h-screen w-screen`}>
          <aside>
              <Sidebar/>
          </aside>
          <main className={`flex-1`}>
              <Outlet/>
          </main>
      </div>
  );
};

export default HomePage;
