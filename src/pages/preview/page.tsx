import { useSearchParams } from "react-router-dom";

const PreviewPage = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");

  if (!url) return <div>No URL provided</div>;

  return (
    <div className="w-full h-screen">
      <iframe
        src={url}
        title="Preview"
        className="w-full h-full border-none"
      />
    </div>
  );
};

export default PreviewPage;
