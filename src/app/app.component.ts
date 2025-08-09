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
  contactsList: Contact[] = [...contacts];

  private nextId = this.contactsList.length + 1;

  // Add Contact
  addContact(newContact: Omit<Contact, 'id' | 'dateAdded'>) {
    this.contactsList = [
      ...this.contactsList,
      { id: this.nextId++, ...newContact, dateAdded: new Date() }
    ];
  }

  // Update Contact
  updateContact(updatedContact: Contact) {
    this.contactsList = this.contactsList.map(c =>
      c.id === updatedContact.id ? updatedContact : c
    );
  }

  // Delete Contact
  deleteContact(id: number) {
    this.contactsList = this.contactsList.filter(c => c.id !== id);
  }

}
