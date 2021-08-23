declare class Dialog {
  container: HTMLElement
}
declare class Form {

}

interface DialogForm {

}

export interface FormItemInfos {
  type: 'input' | 'listbox' | 'checkbox'
  label: string
  key: string
  items ?: { label: string, value: string }[]
}
