const DoctorList = () => {
  return (
    <div>
      <h1>Doctors</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Dr. Smith</td>
            <td>Cardiology</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DoctorList;