import "./theme/editor.css";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { EDITOR_THEME } from "./theme/EditorTheme";
import { ToolbarPlugin } from "./plugIn/ToolbarPlugin";
import { CodeHighlightPlugin } from "./plugIn/CodeHighlightPlugin";
import { PlaygroundAutoLinkPlugin } from "./plugIn/AutoLinkPlugin";
import { ListMaxIndentLevelPlugin } from "./plugIn/ListMaxIndentLevelPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { Dispatch, SetStateAction } from "react";

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const lexicalCommonConfig = {
  theme: EDITOR_THEME,
  onError(error: Error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

export function Editor(props: {
  prevContents?: string | null;
  setContents: Dispatch<SetStateAction<string>>;
}) {
  const { prevContents, setContents } = props;

  const editorConfig: InitialConfigType = {
    // The editor theme
    namespace: "editor",
    editorState: prevContents,
    ...lexicalCommonConfig,
    // Any custom nodes go here
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState) => {
              const editorStateJson = editorState.toJSON();
              setContents(JSON.stringify(editorStateJson));
            }}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <PlaygroundAutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}

export function Viewer(props: { contents: string }) {
  const { contents } = props;

  const viewerConfig: InitialConfigType = {
    namespace: "viewer",
    editable: false,
    editorState: contents,
    ...lexicalCommonConfig,
  };
  return (
    <LexicalComposer initialConfig={viewerConfig}>
      <div className="editor-container">
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={null}
          />
        </div>
      </div>
    </LexicalComposer>
  );
}
