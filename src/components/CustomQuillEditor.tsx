// // components/CustomQuillEditor.tsx
// 'use client';

// import dynamic from 'next/dynamic';
// import { useMemo } from 'react';
// import 'react-quill/dist/quill.snow.css';

// interface CustomQuillEditorProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }

// export default function CustomQuillEditor({ value, onChange, placeholder }: CustomQuillEditorProps) {
//   const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { 
//     ssr: false,
//     loading: () => <p>Loading editor...</p>
//   }), []);

//   const modules = useMemo(() => ({
//     toolbar: [
//       [{ 'header': [1, 2, 3, false] }],
//       ['bold', 'italic', 'underline', 'strike'],
//       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//       ['link', 'image'],
//       ['clean']
//     ],
//   }), []);

//   return (
//     <ReactQuill
//       theme="snow"
//       value={value}
//       onChange={onChange}
//       modules={modules}
//       placeholder={placeholder || ''}
//       className="bg-white rounded-md"
//     />
//   );
// }