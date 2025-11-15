// declare module 'react-rte' {
//   import { Component } from 'react';

//   export interface EditorValue {
//     toString(format: 'html' | 'markdown'): string;
//     getEditorState(): any;
//   }

//   export interface RichTextEditorProps {
//     value: EditorValue;
//     onChange?: (value: EditorValue) => void;
//     className?: string;
//     toolbarClassName?: string;
//     editorClassName?: string;
//     placeholder?: string;
//     customStyleMap?: any;
//     handleReturn?: any;
//     customControls?: any;
//     readOnly?: boolean;
//     disabled?: boolean;
//     toolbarConfig?: any;
//     blockStyleFn?: any;
//     autoFocus?: boolean;
//     keyBindingFn?: any;
//     rootStyle?: any;
//     editorStyle?: React.CSSProperties;
//     toolbarStyle?: React.CSSProperties;
//     onFocus?: () => void;
//     onBlur?: () => void;
//   }

//   export default class RichTextEditor extends Component<RichTextEditorProps> {
//     static createEmptyValue(): EditorValue;
//     static createValueFromString(markup: string, format: 'html' | 'markdown'): EditorValue;
//   }
// }