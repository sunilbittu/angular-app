import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search2'
})
export class SearchPipe2 implements PipeTransform {

  transform(items: any[], search: string): any {
    if (!items) return [];
    if (!search) return items;
    // search = search.toLowerCase();
    return items.filter(function (it: any) {
      return (it.permission.includes(search)) || (it.permission.includes(search));
    });
  }

}
