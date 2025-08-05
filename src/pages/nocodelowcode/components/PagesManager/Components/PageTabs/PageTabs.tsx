import React, { useEffect, useState } from 'react';
import { f_loadPageListFromGroupID} from '../../../../utils/nocodelowcodeUtils';
import { Page } from '../../../../types/types';
import PageShow from '../Page/Page';
import MyTabs from '../../../../../../components/MyTab/MyTab';

export default function PageTabs({ PageGroupID }: { PageGroupID: number }) {
  const [pages, setPages] = useState<Page[]>([]);

  const loadPageList = async () => {
    let result = await f_loadPageListFromGroupID({ PageGroupID: PageGroupID });
    setPages(result);
  };
  useEffect(() => {
    loadPageList();
  }, []);

  return (
    <div style={{ width: '100%' }}>
     {pages.length > 1 && <MyTabs defaultActiveTab={0}>
        {pages.map((page: Page) => (         
            <MyTabs.Tab title={page.Description ?? 'Blank'}>
              <PageShow pageId={page.PageID} />
            </MyTabs.Tab>        
        ))}
      </MyTabs>}
      {
        pages.length === 1 && <PageShow pageId={pages[0].PageID} />
      }
    </div>
  );
}
