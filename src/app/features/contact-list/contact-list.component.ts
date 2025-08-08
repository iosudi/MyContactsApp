import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Contact } from '../../core/interfaces/contact';

import { FormsModule } from '@angular/forms';
import { PhonePipe } from '../../core/pipes/phone.pipe';
import { SearchPipe } from '../../core/pipes/search.pipe';
@Component({
  selector: 'app-contact-list',
  imports: [FormsModule, PhonePipe, CommonModule, SearchPipe],

  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent {
  @Input() contactsList: Contact[] = [];

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

  private nextId = 4;

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

    const id = this.nextId++;
    this.contactsList = [
      ...this.contactsList,
      { id, name: name.trim(), phone: phone.trim(), email: email.trim(), dateAdded: new Date() },
    ];

    // reset form
    this.newContact = { name: '', phone: '', email: '' };
  }

  // --- EDIT ---
  startEdit(c: Contact) {
    this.editingId = c.id;
    this.editModel = { name: c.name, phone: c.phone, email: c.email };
  }

  saveEdit(c: Contact) {
    if (!this.editingId) return;

    const { name, phone, email } = this.editModel;

    if (!name.trim() || !phone.trim() || !email.trim()) {
      alert('Please fill in name, phone, and email.');
      return;
    }
    if (!this.isValidEmail(email)) {
      alert('Invalid email.');
      return;
    }

    this.contactsList = this.contactsList.map(item =>
      item.id === c.id
        ? { ...item, name: name.trim(), phone: phone.trim(), email: email.trim() }
        : item
    );

    this.cancelEdit();
  }

  cancelEdit() {
    this.editingId = null;
    this.editModel = { name: '', phone: '', email: '' };
  }

  // --- DELETE ---
  deleteContact(id: number) {
    if (!confirm('Delete this contact?')) return;
    this.contactsList = this.contactsList.filter(c => c.id !== id);
    if (this.editingId === id) this.cancelEdit();
  }

  // helpers
  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
