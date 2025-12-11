import React from "react";
import { Outlet, Link } from "react-router-dom";

import "./Header.css"; // Make sure the path is correct

function Header() {
     return (
          <>
               <header>
                    <div className="header-content">
                         <div className="header-item">
                              <Link to="/">Home</Link>
                         </div>
                         <div className="header-item">
                              <Link to="/dev-tasks">Dev Tasks</Link>
                         </div>
                         <div className="header-item">
                              <Link to="/study-tasks">Study Tasks</Link>
                         </div>
                    </div>
               </header>

               {/* This renders child pages inside Header layout */}
               <Outlet />
          </>
     );
}

export default Header;