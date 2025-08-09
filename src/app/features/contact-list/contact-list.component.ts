import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../../core/interfaces/contact';

import { FormsModule } from '@angular/forms';
import { PhonePipe } from '../../core/pipes/phone.pipe';
import { SearchPipe } from '../../core/pipes/search.pipe';

import { ContactItemComponent } from '../contact-item/contact-item.component';

@Component({
  selector: 'app-contact-list',
  imports: [FormsModule, PhonePipe, CommonModule, SearchPipe, ContactItemComponent],

  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent {
  @Input() contactsList: Contact[] = [];
  @Output() add = new EventEmitter<Omit<Contact, 'id' | 'dateAdded'>>();
  @Output() update = new EventEmitter<Contact>();
  @Output() delete = new EventEmitter<number>();

  searchTerm: string = ''


  // add form model
  newContact: Omit<Contact, 'id' | 'dateAdded'> = {
    name: '',
    phone: '',
    email: '',
  };

  // edit state
  editingId: number | null = null;
  editModel: Omit<Contact, 'id' | 'dateAdded'> = {
    name: '',
    phone: '',
    email: '',
  };

  trackById(_: number, c: Contact) { return c.id; }

  // --- ADD ---
  addContact() {
    const { name, phone, email } = this.newContact;

    if (!name.trim() || !phone.trim() || !email.trim()) {
      alert('Please fill in name, phone, and email.');
      return;
    }
    if (!this.isValidEmail(email)) {
      alert('Invalid email.');
      return;
    }

    this.add.emit({ name: name.trim(), phone: phone.trim(), email: email.trim() });

    // reset form
    this.newContact = { name: '', phone: '', email: '' };
  }

  // --- EDIT ---
  startEdit(c: Contact) {
    this.editingId = c.id;
    this.editModel = { name: c.name, phone: c.phone, email: c.email };
  }

  saveEdit(c: Contact) {
    const { name, phone, email } = this.editModel;

    if (!name.trim() || !phone.trim() || !email.trim()) {
      alert('Please fill in name, phone, and email.');
      return;
    }
    if (!this.isValidEmail(email)) {
      alert('Invalid email.');
      return;
    }

    this.update.emit({ ...c, name: name.trim(), phone: phone.trim(), email: email.trim() });

    this.cancelEdit();
  }

  cancelEdit() {
    this.editingId = null;
    this.editModel = { name: '', phone: '', email: '' };
  }

  // --- DELETE ---
  deleteContact(id: number) {
    if (!confirm('Delete this contact?')) return;
    this.delete.emit(id);
    if (this.editingId === id) this.cancelEdit();
  }

  // helpers
  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
