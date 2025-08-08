import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from '../interfaces/contact';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: Contact[] | null | undefined, term: string): Contact[] {
    if (!items) return [];
    if (!term?.trim()) return items;

    const q = term.toLowerCase();
    return items.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }

}
