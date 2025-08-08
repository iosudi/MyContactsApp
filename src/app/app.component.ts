import { Component } from '@angular/core';
import { Contact } from './core/interfaces/contact';
import { ContactListComponent } from './features/contact-list/contact-list.component';
import { contacts } from './shared/data/contacts';

@Component({
  selector: 'app-root',
  imports: [ContactListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyContactsApp';
  contactsList: Contact[] = contacts;

}
