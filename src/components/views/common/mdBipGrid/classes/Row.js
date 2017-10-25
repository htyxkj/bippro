import moment from 'moment';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import enumCache from '../../../../core/utils/enumCache';
export default class Row {
  constructor(data, columns) {
    this.data = data;
    this.columns = columns;
  }
  getValue(columnName) {
    const column = this.getColumn(columnName);
    if (column && column.dataType === 'entity') {
      // columnName += '.name';
      var id = this.data[column.field];
      var val = null;
      if(column.refValues&&column.refValues.values){
        _.forEach(column.refValues.values,(item,index)=>{
          if(item[column.refValues.cols[0]] === id){
            val = item[column.refValues.cols[1]];
          }
        });
      }
      if(val){
        return val;
      }
      return get(this.data, columnName);
    }
    if (column && column.dataType === 'enum') {
      return enumCache.getEnumName(column.refId || column.refType, get(this.data, columnName));
    }
    return get(this.data, columnName);
  }
  getValueKey(columnName){
    const column = this.getColumn(columnName);
    if (column && column.dataType === 'entity') {
      // columnName += '.id';
      console.log('getKey entity');
      console.log(columnName,this.data);
      return get(this.data, columnName);
    }
    return get(this.data, columnName);
  }
  getData(columnName) {
    return get(this.data, columnName);
  }
  setData(columnName, value) {
    return set(this.data, columnName, value);
  }
  getColumn(columnName) {
    return this.columns.find(column => column.field === columnName);
  }

  getFilterableValue(columnName) {
    const value = this.getValue(columnName);
    if (!value) {
      return '';
    }
    return value.toString().toLowerCase();
  }

  getSortableValue(columnName) {
    const dataType = this.getColumn(columnName).dataType;

    let value = this.getValue(columnName);

    if (value === undefined) {
      return '';
    }

    if (value instanceof String) {
      value = value.toLowerCase();
    }

    if (dataType.startsWith('date')) {
      const format = dataType.replace('date:', '');
      return moment(value, format).format('YYYY-MM-DD HH:mm:ss');
    }

    if (dataType === 'numeric') {
      return value;
    }

    return value.toString();
  }
  displayed(nor) {
    return !this.data.sys_deleted;
  }

  passesFilter(filter) {
    return this.columns
      .filter(column => column.isFilterable())
      .map(column => this.getFilterableValue(column.getFilterFieldName()))
      .filter(filterableValue => filterableValue.includes(filter.toLowerCase()))
      .length;
  }
}