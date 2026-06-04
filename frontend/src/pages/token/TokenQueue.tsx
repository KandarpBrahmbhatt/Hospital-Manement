const TokenQueue = () => {
  return (
    <div>
      <h1>Token Queue System</h1>

      <table className="border w-full">
        <thead>
          <tr>
            <th>Token</th>
            <th>Patient</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>101</td>
            <td>John Doe</td>
            <td>Waiting</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TokenQueue;