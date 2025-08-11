import AdminDocumentUploadForm from "./components/AdminDocumentUploadForm";

const AdminDocuments = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Upload Your Document
        </h2>

        <AdminDocumentUploadForm />
      </div>
    </div>
  );
};

export default AdminDocuments;
