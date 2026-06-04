const CreatePatient = () => {
  return (
    <div>
      <h1>Create Patient</h1>

      <form className="space-y-3">
        <input
          placeholder="Patient Name"
          className="border p-2 w-full"
        />

        <input
          placeholder="Age"
          className="border p-2 w-full"
        />

        <button className="bg-blue-500 text-white px-4 py-2">
          Save
        </button>
      </form>
    </div>
  );
};

export default CreatePatient;