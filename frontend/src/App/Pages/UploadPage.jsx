// src/App/Pages/UploadPage.jsx
import UploadFile from "../Components/UploadFile";

const UploadPage = () => {
  return (
    <div className="w-full max-w-xl text-center space-y-8">
      <h1 className="text-3xl font-bold mb-10">Upload Your Document</h1>
      <UploadFile />
    </div>
  );
};

export default UploadPage;
