import { useEffect } from 'react';
import { use_f_loadComponents } from '../../../../utils/nocodelowcodeHooks';
import FormComponent from '../Form/FormComponent';
import TableComponent from '../Table/TableComponent';
import TableFromQueryComponent from '../Table/TableFromQueryComponent';
export default function PageShow({ pageId }: { pageId: string | number }) {
  const { data: components, loading: loadingComponents, error: errorComponents, triggerFetch: fetchComponents, triggerFetchWithParams: triggerFetchComponentsWithParams } = use_f_loadComponents({ PageID: pageId });
  useEffect(() => {
    fetchComponents();
  }, [pageId]);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',     
        background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)',
      }}
    >
      {components.map((component) => {
        return (
          <div
            key={component.ComponentID}
            style={{
              gridColumn: component.GridWidth === 'full' ? 'span 3' : component.GridWidth === 'half' ? 'span 2' : 'span 1',
              gridRow: `span 1`,              
             boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              padding: '10px',
              border: '1px solid #ccc',
            }}
          >
            {component.ComponentType === 'Form' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%', height: '100%' }}>
                <h4>{component.ComponentName}</h4>
                <FormComponent formId={component.ReferenceID ?? 0} />
              </div>
            )}
            {component.ComponentType === 'FormFromQuery' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%', height: '100%' }}>
                <h4>{component.ComponentName}</h4>
                <TableFromQueryComponent queryName='loadPoTable' />
              </div>
            )}
            {component.ComponentType === 'DataTable' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%', height: '100%' }}>
                <h4>{component.ComponentName}</h4>
                <TableComponent formID={component.ReferenceID ?? 0} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
