export class Filter {
  type: 'byProperty' | 'byId' | 'byCreationTime' | 'byUpdateTime';
  targetKey?: string;
  compareMethod:
    | 'isNull'
    | 'containsAny'
    | 'containsAll'
    | 'equal'
    | 'notEqual'
    | 'lessThan'
    | 'lessOrEqual'
    | 'greaterThan'
    | 'greaterOrEqual'
    | 'like'
    | 'withinGeoRange';
  targetValue: any;
}

export class FilterModel {
  def: 'filter';
  filter: Filter;
}

export class FilterGroupModel {
  def: 'filterGroup';
  type: 'and' | 'or';
  filters: (FilterGroupModel | FilterModel)[];
}
