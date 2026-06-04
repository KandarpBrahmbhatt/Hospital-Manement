import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-5">
          <h1>Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;