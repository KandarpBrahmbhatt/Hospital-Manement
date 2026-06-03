const Navbar = () => {
  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <h2>Hospital Management System</h2>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;