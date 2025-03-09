import {
  Collection,
  FilterById,
  FilterByProperty,
  FilterByTime,
  Filters,
  FilterValue,
} from 'weaviate-client';
import { FilterGroupModel } from '../model/filter.model';

export function createFilterValue(
  filter: FilterGroupModel,
  collection: Collection<undefined, string>,
): FilterValue {
  let filterValues: FilterValue[] = [];

  for (const currFilter of filter.filters) {
    if (currFilter.def === 'filterGroup') {
      // recursive stuff
      const currValue = createFilterValue(currFilter, collection);
      filterValues.push(currValue);
    } else {
      //currFilter.def === "filter"

      // create the filter value for the current filter (currFilter) here.

      let filterTarget: FilterByProperty<any> | FilterById | FilterByTime;

      if (currFilter.filter.type === 'byProperty') {
        filterTarget = collection.filter.byProperty(
          currFilter.filter.targetKey,
        );
      } else if (currFilter.filter.type === 'byId') {
        filterTarget = collection.filter.byId();
      } else if (currFilter.filter.type === 'byCreationTime') {
        filterTarget = collection.filter.byCreationTime();
      } else if (currFilter.filter.type === 'byUpdateTime') {
        filterTarget = collection.filter.byUpdateTime();
      }

      switch (currFilter.filter.compareMethod) {
        case 'isNull':
          filterValues.push(
            (filterTarget as FilterByProperty<any>).isNull(
              currFilter.filter.targetValue,
            ),
          );
          break;
        case 'containsAny':
          filterValues.push(
            filterTarget.containsAny(currFilter.filter.targetValue),
          );
          break;
        case 'containsAll':
          filterValues.push(
            (filterTarget as FilterByProperty<any>).containsAll(
              currFilter.filter.targetValue,
            ),
          );
          break;
        case 'equal':
          filterValues.push(filterTarget.equal(currFilter.filter.targetValue));
          break;
        case 'notEqual':
          filterValues.push(
            filterTarget.notEqual(currFilter.filter.targetValue),
          );
          break;
        case 'lessThan':
          filterValues.push(
            (filterTarget as FilterByProperty<any> | FilterByTime).lessThan(
              currFilter.filter.targetValue,
            ),
          );
          break;
        case 'lessOrEqual':
          filterValues.push(
            (filterTarget as FilterByProperty<any> | FilterByTime).lessOrEqual(
              currFilter.filter.targetValue,
            ),
          );
          break;
        case 'greaterThan':
          filterValues.push(
            (filterTarget as FilterByProperty<any> | FilterByTime).greaterThan(
              currFilter.filter.targetValue,
            ),
          );
          break;
        case 'greaterOrEqual':
          filterValues.push(
            (
              filterTarget as FilterByProperty<any> | FilterByTime
            ).greaterOrEqual(currFilter.filter.targetValue),
          );
          break;
        case 'like':
          filterValues.push(
            (filterTarget as FilterByProperty<any>).like(
              currFilter.filter.targetValue,
            ),
          );
          break;
        case 'withinGeoRange':
          filterValues.push(
            (filterTarget as FilterByProperty<any>).withinGeoRange(
              currFilter.filter.targetValue,
            ),
          );
          break;
        default:
          break;
      }
    }
  }

  if (filterValues.length === 0) return undefined;

  // remove undifened values
  filterValues = filterValues.filter(function (element) {
    return element !== undefined;
  });

  if (filter.type === 'and') {
    return Filters.and(...filterValues);
  } else {
    return Filters.or(...filterValues);
  }
}
