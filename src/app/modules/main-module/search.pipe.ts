import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search3'
})
export class SearchPipe3 implements PipeTransform {

  transform(items: any[], search: string): any {
      return items.includes(search);
    
  }

}
