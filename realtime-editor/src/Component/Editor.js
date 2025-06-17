import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions'; // Make sure this file exists and exports CODE_CHANGE
import Actions from '../Actions.js';

const Editor = ({ socketref, roomid, onCodeChange }) => {
  const editorRef = useRef(null); // for <textarea>
  const editorInstance = useRef(null); // for CodeMirror instance

  useEffect(() => {
    if (editorRef.current && !editorInstance.current) {
      editorInstance.current = CodeMirror.fromTextArea(editorRef.current, {
        mode: { name: 'javascript', json: true },
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });

      editorInstance.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);

        if (origin !== 'setValue') {
          socketref.current.emit(Actions.CODE_CHANGE, {
            roomid,
            code,
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (socketref.current) {
      const handler = ({ code }) => {
        if (code !== null) {
          editorInstance.current.setValue(code);
        }
      };

      socketref.current.on(Actions.CODE_CHANGE, handler);

      return () => {
        socketref.current.off(Actions.CODE_CHANGE, handler);
      };
    }
  }, [socketref.current]);

  return <textarea ref={editorRef} id="realtimeEditor"></textarea>;
};

export default Editor;
