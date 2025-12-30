// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InwardForm from "./components/InwardForm";
import InwardSearch from "./components/InwardSearch";
import AccountBranch from './components/AccountBranch';
import FileStatus from "./components/FileStatus";
import AdminLogin from "./components/AdminLogin";
import Logout from "./components/Logout";
import Layout from "./components/Layout";
import './style.css';
import Welcome from "./components/Welcome";
import ProtectedRoute from "./components/ProtectedRoute";
import OutwardAdmin from "./components/OutwardAdmin";
import OutwardAccounts from "./components/OutwardAccounts";
import PrintOutwardAdmin from "./components/PrintOutwardAdmin";
import PrintOutwardAccounts from "./components/PrintOutwardAccounts"; 
import FileStatusAccounts from "./components/FileStatusAccounts";
import PendingFilesAdmin from "./components/PendingFilesAdmin";
import PendingFilesAccounts from "./components/PendingFilesAccounts";
import TapalReceived from "./components/TapalReceived";
import TapalDispatched from "./components/TapalDispatched";
import TapalSearch from "./components/TapalSearch";
import TapalPending from "./components/TapalPending";
import PrintTappal from "./components/PrintTappal";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Show login page FIRST */}
        <Route path="/" element={<AdminLogin />} />
        
         <Route path="/welcome" element={ <ProtectedRoute><Welcome /></ProtectedRoute>} />

        {/* All other routes show Header + Navbar */}
        <Route
          path="/InwardForm"
          element={<ProtectedRoute><Layout><InwardForm /></Layout></ProtectedRoute>}
        />
        <Route
          path="/AccountBranch"
          element={ <ProtectedRoute>
              <Layout><AccountBranch /></Layout>
            </ProtectedRoute>}
        />
        <Route
          path="/InwardSearch"
          element={<ProtectedRoute>
              <Layout><InwardSearch /></Layout>
            </ProtectedRoute>}
        />
        <Route path="/OutwardAdmin" element={<ProtectedRoute><Layout><OutwardAdmin /></Layout></ProtectedRoute>} />
        <Route path="/OutwardAccounts" element={<ProtectedRoute><Layout><OutwardAccounts /></Layout></ProtectedRoute>} />
        <Route path="/OutwardPrintAdmin" element={<ProtectedRoute><Layout><PrintOutwardAdmin /></Layout></ProtectedRoute>} />
        <Route path="/OutwardPrintAccounts" element={<ProtectedRoute><Layout><PrintOutwardAccounts /></Layout></ProtectedRoute>} />
        <Route
          path="/FileStatus"
          element={<ProtectedRoute>
              <Layout><FileStatus /></Layout>
            </ProtectedRoute>}
        />
              <Route path="/FileStatusAccounts" element={<ProtectedRoute><Layout><FileStatusAccounts /></Layout></ProtectedRoute>} />
             

              <Route path="/pending/admin" element={<ProtectedRoute><Layout><PendingFilesAdmin /></Layout></ProtectedRoute>} />
            <Route path="/pending/accounts" element={<ProtectedRoute><Layout><PendingFilesAccounts /></Layout></ProtectedRoute>} />
            
            <Route path="/tappal/received" element={<ProtectedRoute><Layout><TapalReceived /></Layout></ProtectedRoute>} />
          <Route path="/tappal/dispatch" element={<ProtectedRoute><Layout><TapalDispatched /></Layout></ProtectedRoute>} />
          <Route path="/tappal/search" element={<ProtectedRoute><Layout><TapalSearch /></Layout></ProtectedRoute>} />
          <Route path="/tappal/pending" element={<ProtectedRoute><Layout><TapalPending /></Layout></ProtectedRoute>} />
          <Route path="/tappal/print" element={<ProtectedRoute><Layout><PrintTappal /></Layout></ProtectedRoute>} />
                      <Route
          path="/Logout"
          element={ <ProtectedRoute>
              <Layout><Logout /></Layout>
            </ProtectedRoute>}
        />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
