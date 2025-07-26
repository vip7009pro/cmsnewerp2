import { useState, useCallback } from 'react';
import { ComponentAttribute, Field, Form, Page, PageComponent } from '../types/types';
import { f_load_pivotedData, f_loadComponentAttributes, f_loadComponents, f_loadFieldList, f_loadFormDetail, f_loadFormList, f_loadPageList } from './nocodelowcodeUtils';
export const use_f_loadFormList = () => {
  const [data, setData] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    let result = await f_loadFormList();
    setData(result);
  }, []);
  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fetchData]);
  return { data, loading, error, triggerFetch };
};
export const use_f_loadFieldList = (DATA: any) => {
  const [data, setData] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    let result = await f_loadFieldList(DATA);
    setData(result);
  }, [DATA]);
  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fetchData, DATA]);
  return { data, loading, error, triggerFetch };
};
export const use_f_loadPageList = (DATA: any) => {
  const [data, setData] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    let result = await f_loadPageList(DATA);
    setData(result);
  }, [DATA]);
  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fetchData, DATA]);
  return { data, loading, error, triggerFetch };
};
export const use_f_loadComponents = (DATA: any) => {
  const [data, setData] = useState<PageComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useCallback(
    async (params?: any) => {
      setLoading(true);
      setError(null);
      let result = await f_loadComponents(params ?? DATA);
      setData(result);
    },
    [DATA]
  );
  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fetchData, DATA]);
  const triggerFetchWithParams = useCallback(
    (params: any) => {
      fetchData(params);
    },
    [fetchData]
  );
  return { data, loading, error, triggerFetch, triggerFetchWithParams };
};
export const use_f_loadComponentAttributes = (DATA: any) => {
  const [data, setData] = useState<ComponentAttribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useCallback(
    async (params?: any) => {
      setLoading(true);
      setError(null);
      let result = await f_loadComponentAttributes(params ?? DATA);
      setData(result);
    },
    [DATA]
  );
  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fetchData, DATA]);
  const triggerFetchWithParams = useCallback(
    (params: any) => {
      fetchData(params);
    },
    [fetchData]
  );
  return { data, loading, error, triggerFetch, triggerFetchWithParams };
};
export const use_f_loadFormDetail = (DATA: any) => {
  const [data, setData] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    let result = await f_loadFormDetail(DATA);
    setData(result);
  }, [DATA]);
  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fetchData, DATA]);
  return { data, loading, error, triggerFetch };
};
export const use_f_load_pivotedData = (DATA: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    let result = await f_load_pivotedData(DATA);
    setData(result);
  }, [DATA]);
  const triggerFetch = useCallback(() => {
    fetchData();
  }, [fetchData, DATA]);
  return { data, loading, error, triggerFetch };
};
