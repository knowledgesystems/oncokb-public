import React from 'react';
import ReactTable, { Column, TableProps } from 'react-table';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import classNames from 'classnames';
import { COLOR_BLUE } from './../../config/theme';
import {
  HandleColumnsChange,
  MUTATIONS_TABLE_COLUMN_KEY,
  TREATMENTS_TABLE_COLUMN_KEY,
} from './../../config/constants';
import Dropdown from '../dropdown/Dropdown';
import './OncoKBTable.scss';

export type SearchColumn<T> = Column<T> & {
  onFilter?: (data: T, keyword: string) => boolean;
};

interface ITableWithSearchBox<T> extends Partial<TableProps<T>> {
  data: T[];
  disableSearch?: boolean;
  fixedHeight?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  minRows?: number;
  columns: SearchColumn<T>[];
  loading?: boolean;
  filters?: React.FunctionComponent;
  className?: string;
  tableName: string;
  selectedColumnsState: string[];
  selectedColumns: {
    key: MUTATIONS_TABLE_COLUMN_KEY | TREATMENTS_TABLE_COLUMN_KEY;
    label: string;
    prop: string;
  }[];
  handleColumnsChange: HandleColumnsChange;
}

@observer
export default class OncoKBTable<T> extends React.Component<
  ITableWithSearchBox<T>,
  { searchKeyword: string }
> {
  constructor(props: ITableWithSearchBox<T>) {
    super(props);
    this.state = {
      searchKeyword: '',
    };
  }

  public static defaultProps = {
    disableSearch: false,
    showPagination: false,
    searchIconClassName: 'fa fa-search',
  };

  @computed
  get filteredData() {
    return this.props.data.filter((item: T) => {
      const filterableColumns = this.props.columns.filter(
        column => !!column.onFilter
      );
      if (filterableColumns.length > 0) {
        return filterableColumns
          .map(column => column.onFilter!(item, this.state.searchKeyword))
          .includes(true);
      } else {
        return true;
      }
    });
  }

  componentDidUpdate() {
    this.toggleOverflowClass();
  }

  componentDidMount() {
    this.toggleOverflowClass();
  }

  toggleOverflowClass() {
    const tableBody = document.querySelector(
      '.oncoKBTable-container .oncokbTable-main .rt-table .rt-tbody'
    );
    if (tableBody) {
      if (this.filteredData.length === 0) {
        tableBody.classList.add('no-data');
        tableBody.classList.remove('has-data');
      } else {
        tableBody.classList.add('has-data');
        tableBody.classList.remove('no-data');
      }
    }
  }

  render() {
    const NoDataConst = () => (
      <div className="text-center justify-center no-results">No Results</div>
    );

    return (
      <div className="oncoKBTable-container">
        {!this.props.disableSearch && (
          <div className="header">
            <div className="table-header-left">{this.props.tableName}</div>
            <div className="table-header-right">
              <div className="dropdown-container">
                <Dropdown
                  options={this.props.selectedColumns.map(col => ({
                    value: col.key,
                    label: col.label,
                  }))}
                  selectedOptions={this.props.selectedColumnsState}
                  onChange={this.props.handleColumnsChange}
                />
              </div>
              <div className="search-container">
                <input
                  onChange={event =>
                    this.setState({
                      searchKeyword: event.target.value.toLowerCase(),
                    })
                  }
                  className="form-control input-sm search-input"
                  type="text"
                  placeholder="Search ..."
                />
              </div>
            </div>
          </div>
        )}
        <div className="oncokbTable-main">
          <ReactTable
            {...this.props}
            showPagination={this.props.showPagination}
            className={classNames(
              `-highlight oncokbReactTable`,
              this.props.className ? this.props.className : ''
            )}
            data={this.filteredData}
            NoDataComponent={NoDataConst}
          />
        </div>
      </div>
    );
  }
}
