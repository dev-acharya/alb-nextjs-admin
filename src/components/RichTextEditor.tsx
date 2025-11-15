// "use client";

// import React from "react";
// import dynamic from "next/dynamic";
// import "react-quill/dist/quill.snow.css";

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// interface Pros{
//     value : string;
//     onChange : (pfd:string) => void;
// }
// const RichTextEditor: React.FC<Pros> = ({value , onChange}) => {

// return (
// <div className="p-4 space-y-4">
// <ReactQuill theme="snow" value={value} onChange={onChange} />
// {/* <div className="border p-4 rounded bg-white" dangerouslySetInnerHTML={{ __html: value }} /> */}
// </div>
// );
// };

// export default RichTextEditor;