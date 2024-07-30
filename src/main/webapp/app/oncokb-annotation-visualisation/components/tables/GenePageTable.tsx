import OncoKBTable, { SearchColumn } from './OncoKBTable';
import {
  HandleColumnsChange,
  LG_TABLE_FIXED_HEIGHT,
  MUTATIONS_TABLE_COLUMN_KEY,
  THRESHOLD_TABLE_FIXED_HEIGHT,
  TREATMENTS_TABLE_COLUMN_KEY,
} from '../../config/constants';
import React from 'react';
import { SortingRule } from 'react-table';

export const GenePageTable: React.FunctionComponent<{
  data: any[];
  columns: SearchColumn<any>[];
  isPending: boolean;
  defaultSorted?: SortingRule[];
  selectedAnnotationColumns: string[];
  selectedColumns: {
    key: MUTATIONS_TABLE_COLUMN_KEY | TREATMENTS_TABLE_COLUMN_KEY;
    label: string;
    prop: string;
  }[];
  name: string;
  handleColumnsChange: HandleColumnsChange;
}> = props => {
  return (
    <OncoKBTable
      tableName={props.name}
      data={props.data}
      columns={props.columns}
      loading={props.isPending}
      pageSize={props.data.length === 0 ? 1 : props.data.length}
      selectedColumnsState={props.selectedAnnotationColumns}
      selectedColumns={props.selectedColumns}
      handleColumnsChange={props.handleColumnsChange}
      style={
        props.data.length === 0 || props.selectedAnnotationColumns.length === 0
          ? { height: '10vh' }
          : props.data.length > THRESHOLD_TABLE_FIXED_HEIGHT
          ? { height: LG_TABLE_FIXED_HEIGHT }
          : {}
      }
      fixedHeight={
        props.data.length === 0 || props.selectedAnnotationColumns.length === 0
          ? true
          : props.data.length > THRESHOLD_TABLE_FIXED_HEIGHT
      }
      defaultSorted={
        props.defaultSorted || [
          {
            id: MUTATIONS_TABLE_COLUMN_KEY.ONCOGENICITY,
            desc: true,
          },
        ]
      }
      className={'no-scroll'}
    />
  );
};
