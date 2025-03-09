export interface Filter {
    type: "byProperty" | "byId" | "byCreationTime" | "byUpdateTime";
    targetKey?: string;
    compareMethod:
      | "isNull"
      | "containsAny"
      | "containsAll"
      | "equal"
      | "notEqual"
      | "lessThan"
      | "lessOrEqual"
      | "greaterThan"
      | "greaterOrEqual"
      | "like"
      | "withinGeoRange";
    targetValue: any;
  }
  
  export interface FilterModel {
    def: "filter";
    filter: Filter;
  }
  
  export interface FilterGroupModel {
    def: "filterGroup";
    type: "and" | "or";
    filters: (FilterGroupModel | FilterModel)[];
  }