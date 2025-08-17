import React from 'react'
import { ReactFlowProvider } from 'reactflow'
import WorkflowEditor from './WorkflowEditor'

export default function ProcessManager() {
  return (
    <ReactFlowProvider><WorkflowEditor /></ReactFlowProvider>
  )
}
